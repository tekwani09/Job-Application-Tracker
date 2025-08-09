import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';


const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== 'All') params.append('status', statusFilter);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      try {
        const res = await axios.get(`http://localhost:8080/api/jobs?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("❌ Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [statusFilter, sortBy, order]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted job from state
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("❌ Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
      <h2>📋 My Job Applications</h2>
      </div>
      <div className="filter-bar">
        <label>Status Filter: </label>
        <select value={statusFilter} onChange={handleStatusChange}>
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Selected">Selected</option>
        </select>

        <label>Sort By: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Default</option>
          <option value="company">Company</option>
          <option value="appliedDate">Applied Date</option>
          <option value="status">Status</option>
        </select>

        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">↑ Ascending</option>
          <option value="desc">↓ Descending</option>
        </select>
      </div>

      <Link to="/add-job">
        <button style={{ marginBottom: '15px' }}>➕ Add New Job</button>
      </Link>

      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <h3>{job.role} at {job.company}</h3>
          <p>Status: {job.status}</p>
          <p>Applied Date: {job.appliedDate?.slice(0, 10)}</p>
          <p>Notes: {job.notes}</p>
          <Link to={`/edit-job/${job._id}`}>
            <button className="edit-btn">Edit</button>
          </Link>
          <button className="delete-btn" onClick={() => handleDelete(job._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
