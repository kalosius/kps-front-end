import React from 'react';
import Navbar from '../components/Navbar';

export default function ClassAttendance() {
	return (
		<>
			<Navbar />
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Class Attendance</h1>
				<p className="text-gray-600">This is the attendance page. Add attendance-taking UI here.</p>
			</div>
		</>
	);
}
