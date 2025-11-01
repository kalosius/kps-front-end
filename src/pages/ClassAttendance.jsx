import React from 'react';
import Navbar from '../components/Navbar';

export default function ClassAttendance() {
	return (
		<>
			<Navbar />
			<main className="content-area">
				<div className="app-container">
					<section className="site-card">
						<h1 className="text-2xl font-bold">Class Attendance</h1>
						<p className="mt-2 text-gray-600">This is the attendance page. Add attendance-taking UI here.</p>
					</section>
				</div>
			</main>
		</>
	);
}
