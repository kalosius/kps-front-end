import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { AuthContext } from '../auth/AuthProvider';
import { useMessages } from '../notifications/MessageProvider';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Messages() {
  // debug helper: log when Messages component mounts
  // eslint-disable-next-line no-console
  console.log('Messages component mounting');
  const { user } = useContext(AuthContext);
  const notify = useMessages();

  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [newThreadParticipants, setNewThreadParticipants] = useState([]); // array of ids
  const [availableUsers, setAvailableUsers] = useState([]);
  const [initialMessage, setInitialMessage] = useState('');
  const [messageBody, setMessageBody] = useState('');

  const loadThreads = async () => {
    setLoading(true);
    try {
      const res = await api.get('threads/');
      // normalize paginated or plain list responses
      const raw = res.data;
      const items = Array.isArray(raw) ? raw : (raw?.results || raw?.items || []);
      setThreads(items);
    } catch (err) {
      console.error(err);
      notify?.addMessage?.('Failed to load threads', 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get('users/');
      const raw = res.data;
      // support both array and paginated responses
      const items = Array.isArray(raw) ? raw : (raw?.results || raw?.items || []);
      setAvailableUsers(items);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const loadThreadMessages = async (threadId) => {
    if (!threadId) return;
    try {
      const res = await api.get(`threads/${threadId}/messages/`);
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
      notify?.addMessage?.('Failed to load messages', 'error', 4000);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedThread) loadThreadMessages(selectedThread.id);
    // start a polling interval to refresh messages for selected thread
    let iv = null;
    if (selectedThread) {
      iv = setInterval(() => loadThreadMessages(selectedThread.id), 5000);
    }
    return () => { if (iv) clearInterval(iv); };
  }, [selectedThread]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadSubject) return notify?.addMessage?.('Subject required', 'error', 3000);

    const participants = Array.isArray(newThreadParticipants)
      ? newThreadParticipants
      : (newThreadParticipants || '').split(',').map(s => Number(s.trim())).filter(Boolean);

    try {
      const res = await api.post('threads/', {
        subject: newThreadSubject,
        participants,
        initial_message: initialMessage || undefined,
      });
      notify?.addMessage?.('Thread created', 'success', 3000);
  setNewThreadSubject('');
  setNewThreadParticipants([]);
  setInitialMessage('');
      // refresh list and select new thread
      await loadThreads();
      setSelectedThread(res.data);

      // update unread badge immediately
      try {
        const r2 = await api.get('threads/unread_count/');
        const unread = r2.data?.unread ?? 0;
        window.dispatchEvent(new CustomEvent('unreadCountUpdated', { detail: { unread } }));
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error(err);
      notify?.addMessage?.('Failed to create thread', 'error', 4000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedThread) return notify?.addMessage?.('Select a thread', 'error', 3000);
    if (!messageBody.trim()) return;
    try {
      const res = await api.post(`threads/${selectedThread.id}/messages/`, { body: messageBody });
      setMessages((m) => [...m, res.data]);
      setMessageBody('');
      notify?.addMessage?.('Message sent', 'success', 2000);

      // update unread badge immediately
      try {
        const r2 = await api.get('threads/unread_count/');
        const unread = r2.data?.unread ?? 0;
        window.dispatchEvent(new CustomEvent('unreadCountUpdated', { detail: { unread } }));
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error(err);
      notify?.addMessage?.('Failed to send message', 'error', 4000);
    }
  };

  return (
    <ErrorBoundary>
      <>
        <Navbar />
        <main className="content-area">
          <div className="app-container" style={{ display: 'flex', gap: 20 }}>
          <section className="site-card" style={{ flex: '0 0 320px' }}>
            <h1 className="text-xl font-bold">Threads</h1>
            <p className="muted">{user ? `${user.first_name || user.username}` : 'User'}</p>

            <div style={{ marginTop: 12 }}>
              <form onSubmit={handleCreateThread}>
                <input placeholder="Subject" value={newThreadSubject} onChange={e => setNewThreadSubject(e.target.value)} className="input" />

                <label style={{ display: 'block', marginTop: 6, fontSize: 13 }}>Participants</label>
                <select multiple value={newThreadParticipants.map(String)} onChange={e => {
                  const opts = Array.from(e.target.selectedOptions).map(o => Number(o.value));
                  setNewThreadParticipants(opts);
                }} style={{ width: '100%', marginTop: 6 }}>
                  {(Array.isArray(availableUsers) ? availableUsers : []).map(u => (
                    <option key={u.id} value={u.id}>{u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username} {u.role ? `(${u.role})` : ''}</option>
                  ))}
                </select>

                <textarea placeholder="Initial message (optional)" value={initialMessage} onChange={e => setInitialMessage(e.target.value)} className="input" style={{ marginTop: 6, minHeight: 64 }} />

                <button type="submit" className="btn" style={{ marginTop: 8 }}>Create</button>
              </form>
            </div>

            <div style={{ marginTop: 16, maxHeight: '60vh', overflow: 'auto' }}>
              {loading && <div>Loading...</div>}
              {threads.map(t => (
                <div key={t.id} onClick={() => setSelectedThread(t)} style={{ padding: 8, borderBottom: '1px solid #eee', cursor: 'pointer', background: selectedThread?.id === t.id ? '#f3f4f6' : 'transparent' }}>
                  <div style={{ fontWeight: 600 }}>{t.subject}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{t.participants ? t.participants.map(p => p.first_name || p.username).slice(0,3).join(', ') : ''}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="site-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 className="text-xl font-bold">{selectedThread ? selectedThread.subject : 'Select a thread'}</h1>

            <div style={{ flex: 1, overflow: 'auto', padding: 8, border: '1px solid #eee', borderRadius: 6, marginTop: 8, minHeight: 200 }}>
              {selectedThread ? (
                messages.length === 0 ? <div className="muted">No messages yet</div> : (
                  messages.map(m => (
                    <div key={m.id} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.sender ? (m.sender.first_name || m.sender.username) : 'Unknown'}</div>
                      <div style={{ marginTop: 4 }}>{m.body}</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{new Date(m.sent_at).toLocaleString()}</div>
                    </div>
                  ))
                )
              ) : (
                <div className="muted">Select a thread to view messages or create a new thread.</div>
              )}
            </div>

            <form onSubmit={handleSendMessage} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <input value={messageBody} onChange={e => setMessageBody(e.target.value)} placeholder={selectedThread ? 'Write a message...' : 'Select a thread first'} className="input" style={{ flex: 1 }} />
              <button type="submit" className="btn" disabled={!selectedThread}>Send</button>
            </form>
          </section>
        </div>
      </main>
      </>
    </ErrorBoundary>
  );
}
