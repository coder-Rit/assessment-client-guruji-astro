import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/jobs.css'; // Import the CSS file
import { Toaster, toast } from 'sonner'; // Import the Toaster and toast
import Cookies from 'js-cookie';
import { socket } from '../App';



const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data using axios
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE}/api/v1/job/get`, { withCredentials: true });

      const sortedJobs = response.data.jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
      setJobs(sortedJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("takeUser", JSON.parse(window.localStorage.getItem('user')))
    }
  }, [socket])


  const handleApply = async (obj) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE}/api/v1/job/apply`,

        obj, { withCredentials: true }

      );
      toast.success(`Request is enqueued: ${response.data.message}`);
    } catch (error) {
      toast.error('Request enqueue failed: ' + (error.response?.data?.message || error.message));
    }
  };


  useEffect(() => {
    socket.on("JOB_STATUS_FROM_SERVER", (data) => {
      toast.success(`Successfuly applied for: ${data.user_id}`);
    })
  }, [socket])


  return (
    <div className="jobs-container">
      <Toaster position="top-center" /> {/* Toaster component */}
      <h1 className="jobs-title">Job Listings</h1>
      {loading ? (
        <div>Loading jobs...</div>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job._id} className="job-item">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">Company: {job.company}</p>
              <p className="job-salary">Salary: {job.salary ? `$${job.salary}` : 'Not specified'}</p>
              <p className="job-postedAt">Posted on: {new Date(job.postedAt).toLocaleDateString()}</p>

              <button className="apply-button" onClick={() => handleApply({job_id:job._id,title:job.title})}>Apply</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Jobs;
