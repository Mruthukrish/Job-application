import React, { useState, useEffect, useRef } from 'react';
import ToastMsg from './ToastMsg';

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

interface JobDetailProps {
  jobId: string;
  onBack: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ jobId, onBack }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false); 
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchJob();
    }
  }, []);

  const fetchJob = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
      const data = await response.json();
      setJob(data.data);
      setError(null);
    } finally {
      setLoading(false);
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
      month: 'long',
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

  if (error || !job) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Job Not Found</h2>
        <p>{error || 'The requested job could not be found.'}</p>
        <button className="btn btn-primary" onClick={onBack}>
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Jobs
        </button>
      </div>

      <div className="job-detail">
        <div className="job-detail-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h1 className="job-detail-title">{job.title}</h1>
              <div className="job-detail-company">{job.companyName}</div>
            </div>
            <span className={`job-status status-${job.status}`} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              {job.status.toUpperCase()}
            </span>
          </div>

          <div className="job-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span className="meta-value">📍 {job.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Job Type</span>
              <span className="meta-value">💼 {job.jobType}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Work Mode</span>
              <span className="meta-value">🏠 {job.jobMode}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Experience</span>
              <span className="meta-value">⭐ {job.experience}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Salary</span>
              <span className="meta-value" style={{ color: '#059669', fontSize: '1.125rem' }}>
                {formatSalary(job.salary)}/month
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Application Deadline</span>
              <span className="meta-value">📅 {formatDate(job.closeDate)}</span>
            </div>
          </div>
        </div>

        <div className="job-section">
          <h3 className="section-title">Job Description</h3>
          <div className="section-content" style={{ whiteSpace: 'pre-line' }}>
            {job.description}
          </div>
        </div>

        <div className="job-section">
          <h3 className="section-title">Required Skills</h3>
          <div className="job-skills">
            {job.skillsRequired.map((skill, index) => (
              <span key={index} className="skill-tag" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {job.benefits.length > 0 && (
          <div className="job-section">
            <h3 className="section-title">Benefits & Perks</h3>
            <ul className="benefits-list">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="job-section">
          <h3 className="section-title">About {job.companyName}</h3>
          <div className="section-content">
            {job.companyDescription}
          </div>
        </div>

        <div className="job-section">
          <h3 className="section-title">Application Details</h3>
          <div className="job-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Job ID</span>
              <span className="meta-value">{job.jobId}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Posted Date</span>
              <span className="meta-value">{formatDate(job.openDate)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Updated</span>
              <span className="meta-value">{formatDate(job.updatedAt)}</span>
            </div>
          </div>
        </div>

        {job.status === 'open' && (
          <div style={{ textAlign: 'center', marginTop: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '8px' }}>
            <button className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }} onClick={()=> ToastMsg('success','Applied successfully!')}>
              Apply for this Position
            </button>
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
              Application deadline: {formatDate(job.closeDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;