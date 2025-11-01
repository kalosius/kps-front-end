import React, { useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../auth/AuthProvider';

export default function GradeEntry({assessmentId}) {
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');
  const { user } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('grades/', {
      student: studentId,
      assessment: assessmentId,
      score: parseFloat(score),
      remarks
    });
    alert('Saved');
  };

  return (
    <form onSubmit={submit}>
      <input value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student ID" />
      <input value={score} onChange={e=>setScore(e.target.value)} placeholder="Score" />
      <textarea value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Remarks" />
      <button type="submit">Save</button>
    </form>
  );
}
