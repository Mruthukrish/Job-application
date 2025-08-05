import React, { useState, useEffect, useRef } from 'react';

interface Job {
  _id: string;
  jobId: string;
  title: string;
  description: string;
  experience: string;
  jobType: string;
  jobMode: string;
  salary: number;
  location: string;
  companyName: string;
  companyDescription: string;
  skillsRequired: string[];
  benefits: string[];
  openDate: string;
  closeDate: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface JobListProps {
  onJobSelect: (jobId: string) => void;
}

const JobList: React.FC<JobListProps> = ({ onJobSelect }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  const hasFetched = useRef(false); 
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchJobs();
    }
  }, []);
  
  useEffect(() => {
    filterJobs();
  }, [jobs, filter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.data); // assuming the jobs array is inside "data"
      setError(null);
    } catch (err) {
      setError('Failed to fetch jobs', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };


  const filterJobs = () => {
    if (filter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status.toLowerCase() === filter));
    }
  };


  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="filter-section">
        <div className="filter-content">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              Available Jobs ({filteredJobs.length})
            </h2>
          </div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Jobs
            </button>
            <button
              className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
              onClick={() => setFilter('open')}
            >
              Open
            </button>
            <button
              className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
              onClick={() => setFilter('closed')}
            >
              Closed
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          {error}
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>There are no jobs matching your current filter.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
              onClick={() => onJobSelect(job._id)}
            >
              <div className="job-header">
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.companyName}</p>
                </div>
                <span className={`job-status status-${job.status}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-meta">
                <span>📍 {job.location}</span>
                <span>💼 {job.jobType}</span>
                <span>🏠 {job.jobMode}</span>
                <span>⭐ {job.experience}</span>
              </div>

              <p className="job-description">
                {job.description}
              </p>

              <div className="job-skills">
                {job.skillsRequired.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {job.skillsRequired.length > 4 && (
                  <span className="skill-tag">
                    +{job.skillsRequired.length - 4} more
                  </span>
                )}
              </div>

              <div className="job-footer">
                <div className="job-salary">
                  {formatSalary(job.salary)}/month
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Closes: {formatDate(job.closeDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;