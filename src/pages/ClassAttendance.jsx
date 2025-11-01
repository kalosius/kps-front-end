import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';

const STATUS = ['present', 'absent', 'late', 'excused'];

export default function ClassAttendance() {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [attendance, setAttendance] = useState({}); // { studentId: { status, note } }
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState('');

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			try {
				const res = await api.get('students/');
				const data = res.data;
				const items = Array.isArray(data) ? data : (data.results || data);
				setStudents(items || []);
				const map = {};
				(items || []).forEach(s => { map[s.id] = { status: 'present', note: '' }; });
				setAttendance(map);
			} catch (e) {
				console.error('Failed to load students', e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const setStatus = (id, status) => setAttendance(prev => ({ ...prev, [id]: { ...(prev[id]||{}), status } }));
	const setNote = (id, note) => setAttendance(prev => ({ ...prev, [id]: { ...(prev[id]||{}), note } }));

	const markAll = (status) => {
		const next = { ...attendance };
		students.forEach(s => { next[s.id] = { ...(next[s.id]||{}), status }; });
		setAttendance(next);
	};

	const saveAll = async () => {
		setSaving(true);
		try {
			for (const s of students) {
				const a = attendance[s.id] || { status: 'present', note: '' };
				const payload = { student: s.id, date, status: a.status, note: a.note };
				await api.post('attendance/', payload);
			}
			setMsg('Attendance saved successfully');
			setTimeout(() => setMsg(''), 3000);
		} catch (err) {
			console.error('Save failed', err);
			setMsg('Failed to save attendance (see console)');
			setTimeout(() => setMsg(''), 4000);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<Navbar />
			<main className="content-area">
				<div className="app-container">
					<div className="site-card">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold">Class Attendance</h1>
								<p className="muted">Quickly mark attendance for a class and date.</p>
							</div>

							<div className="flex items-center gap-3">
								<input type="date" value={date} onChange={e=>setDate(e.target.value)} className="form-input" />
								<button onClick={() => markAll('present')} className="btn-ghost">Mark all Present</button>
								<button onClick={() => markAll('absent')} className="btn-ghost">Mark all Absent</button>
								<button onClick={saveAll} className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save attendance'}</button>
							</div>
						</div>

						<div className="mt-6">
							{msg && <div className="small muted mb-3">{msg}</div>}

							{loading ? (
								<div>Loading students...</div>
							) : (
								<div className="table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th style={{width: '44%'}}>Student</th>
												<th style={{width: '20%'}}>Admission</th>
												<th style={{width: '20%'}}>Class</th>
												<th style={{width: '16%'}}>Status</th>
											</tr>
										</thead>
										<tbody>
											{students.map(s => (
												<tr key={s.id}>
													<td>
														<div className="name-cell">
															<div className="avatar-initials">{`${(s.first_name||'').charAt(0)}${(s.last_name||'').charAt(0)}`.toUpperCase()}</div>
															<div>
																<div className="font-semibold">{s.first_name} {s.last_name}</div>
																<div className="muted small">{s.dob ? new Date(s.dob).toLocaleDateString() : ''}</div>
															</div>
														</div>
													</td>
													<td className="small">{s.admission_number}</td>
													<td className="small">{(s.current_class && (s.current_class.name || s.current_class)) || '-'}</td>
													<td>
														<div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'flex-end'}}>
															<select value={(attendance[s.id] && attendance[s.id].status) || 'present'} onChange={e=>setStatus(s.id, e.target.value)} className="form-input" style={{width:140}}>
																{STATUS.map(st => <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>)}
															</select>
															<input placeholder="note" value={(attendance[s.id] && attendance[s.id].note) || ''} onChange={e=>setNote(s.id, e.target.value)} className="form-input" style={{width:220}} />
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
