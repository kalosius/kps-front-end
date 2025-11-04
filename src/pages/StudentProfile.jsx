import React, { useContext, useEffect, useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { AuthContext } from '../auth/AuthProvider';

export default function StudentProfile() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [student, setStudent] = useState(null);
	const [incidents, setIncidents] = useState([]);
	const [attendance, setAttendance] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const [sRes, iRes, aRes] = await Promise.all([
					api.get(`students/${id}/`),
					api.get(`incidents/?student=${id}`),
					api.get(`attendance/?student=${id}`)
				]);

				if (!mounted) return;
				setStudent(sRes.data);
				// incidents may be returned as results or an array
				const inc = Array.isArray(iRes.data) ? iRes.data : (iRes.data.results || []);
				setIncidents(inc.slice(0, 10));
				const attItems = Array.isArray(aRes.data) ? aRes.data : (aRes.data.results || []);
				setAttendance({ total: attItems.length, latest: attItems.slice(-5).reverse() });
			} catch (err) {
				console.error(err);
				if (!mounted) return;
				setError('Failed to load student profile');
			} finally {
				if (mounted) setLoading(false);
			}
		};
		load();
		return () => { mounted = false; };
	}, [id]);

	if (loading) {
		return (
			<>
				<Navbar />
				<main className="content-area">
					<div className="app-container">
						<div className="site-card">Loading student profile…</div>
					</div>
				</main>
			</>
		);
	}

	if (error) {
		return (
			<>
				<Navbar />
				<main className="content-area">
					<div className="app-container">
						<div className="site-card">
							<div style={{ marginBottom: 12 }}>{error}</div>
							<button className="btn btn-outline" onClick={() => navigate(-1)}>Go back</button>
						</div>
					</div>
				</main>
			</>
		);
	}

	if (!student) {
		return (
			<>
				<Navbar />
				<main className="content-area">
					<div className="app-container">
						<div className="site-card">
							<div>No student found.</div>
							<NavLink to="/students" className="btn btn-outline" style={{ marginTop: 12 }}>Back to students</NavLink>
						</div>
					</div>
				</main>
			</>
		);
	}

	return (
		<>
			<Navbar />
			<main className="content-area">
				<div className="app-container">
					<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
						<div className="site-card">
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<div>
									<h2 style={{ margin: 0 }}>{student.first_name} {student.last_name}</h2>
									<div style={{ fontSize: 13, color: '#6b7280' }}>{student.admission_number || '—'} • {student.current_class?.name || student.current_class || 'No class'}</div>
								</div>
								<div>
									<NavLink to="/students" className="btn btn-outline" style={{ marginRight: 8 }}>Back</NavLink>
									{(user?.role === 'admin' || user?.role === 'teacher' || user?.is_superuser) && (
										<NavLink to={`/students/${student.id}/edit`} className="btn btn-primary">Edit</NavLink>
									)}
								</div>
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
								<div>
									<h4 style={{ marginBottom: 8 }}>Details</h4>
									<table style={{ width: '100%', borderCollapse: 'collapse' }}>
										<tbody>
											<tr>
												<td style={{ padding: '6px 0', fontWeight: 600 }}>Date of birth</td>
												<td style={{ padding: '6px 0' }}>{student.date_of_birth || '—'}</td>
											</tr>
											<tr>
												<td style={{ padding: '6px 0', fontWeight: 600 }}>Gender</td>
												<td style={{ padding: '6px 0' }}>{student.gender || '—'}</td>
											</tr>
											<tr>
												<td style={{ padding: '6px 0', fontWeight: 600 }}>Admission no.</td>
												<td style={{ padding: '6px 0' }}>{student.admission_number || '—'}</td>
											</tr>
											<tr>
												<td style={{ padding: '6px 0', fontWeight: 600 }}>Current class</td>
												<td style={{ padding: '6px 0' }}>{student.current_class?.name || student.current_class || '—'}</td>
											</tr>
										</tbody>
									</table>
								</div>

								<div>
									<h4 style={{ marginBottom: 8 }}>Guardians</h4>
									{Array.isArray(student.guardian) && student.guardian.length > 0 ? (
										<ul style={{ marginTop: 8 }}>
											{student.guardian.map(g => (
												<li key={g.id || g.email} style={{ padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
													<div style={{ fontWeight: 700 }}>{g.first_name ? `${g.first_name} ${g.last_name || ''}` : (g.username || g.email)}</div>
													<div style={{ fontSize: 13, color: '#6b7280' }}>{g.email || 'No email'}</div>
												</li>
											))}
										</ul>
									) : (
										<div className="text-gray-600">No guardians listed for this student.</div>
									)}
								</div>
							</div>

							<div style={{ marginTop: 16 }}>
								<h4 style={{ marginBottom: 8 }}>About</h4>
								<div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{student.notes || student.description || 'No additional details.'}</div>
							</div>
						</div>

						<div>
							<div className="site-card">
								<h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>Attendance</h3>
								<div style={{ marginTop: 8 }}>
									<div style={{ fontSize: 20, fontWeight: 700 }}>{attendance?.total ?? '-'}</div>
									<div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Records found</div>
								</div>
								{attendance?.latest && attendance.latest.length > 0 && (
									<ul style={{ marginTop: 12 }}>
										{attendance.latest.map((a, i) => (
											<li key={i} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
												<div style={{ fontSize: 13 }}>{a.date} — {a.status || a.present ? 'Present' : 'Absent'}</div>
											</li>
										))}
									</ul>
								)}
							</div>

							<div className="site-card" style={{ marginTop: 12 }}>
								<h3 style={{ margin: 0 }}>Recent incidents</h3>
								<ul style={{ marginTop: 8 }}>
									{incidents.length === 0 && <li className="text-gray-600">No incidents recorded.</li>}
									{incidents.map(i => (
										<li key={i.id} style={{ padding: '8px 0', borderBottom: '1px dashed #eee' }}>
											<div style={{ fontWeight: 700 }}>{i.type || i.title || 'Incident'}</div>
											<div style={{ fontSize: 12, color: '#6b7280' }}>{i.date} • {i.severity || i.level || ''}</div>
											<div style={{ marginTop: 6 }}>{i.description}</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
