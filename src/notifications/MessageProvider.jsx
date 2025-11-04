import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext();

export const useMessages = () => useContext(MessageContext);

let nextId = 1;

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = useCallback((text, type = 'success', ttl = 5000) => {
    const id = nextId++;
    setMessages((m) => [...m, { id, text, type }]);
    if (ttl > 0) setTimeout(() => setMessages((m) => m.filter(x => x.id !== id)), ttl);
    return id;
  }, []);

  const removeMessage = useCallback((id) => {
    setMessages((m) => m.filter(x => x.id !== id));
  }, []);

  return (
    <MessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}

      {/* Toast container */}
      <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map(msg => (
          <div key={msg.id} role="status" aria-live="polite" style={{ minWidth: 220, maxWidth: 360, boxShadow: '0 6px 18px rgba(15,23,42,0.08)', borderRadius: 10, padding: '10px 14px', background: msg.type === 'error' ? '#fee2e2' : '#ecfdf5', color: msg.type === 'error' ? '#991b1b' : '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14 }}>{msg.text}</div>
            <button onClick={() => removeMessage(msg.id)} aria-label="Dismiss" style={{ marginLeft: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 16 }}>✕</button>
          </div>
        ))}
      </div>
    </MessageContext.Provider>
  );
};

export default MessageProvider;
