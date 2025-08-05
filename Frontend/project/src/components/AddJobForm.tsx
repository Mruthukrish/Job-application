import React, { useState } from 'react';

interface JobFormData {
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
}

interface AddJobFormProps {
  onBack: () => void;
  onJobAdded?: () => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onBack, onJobAdded }) => {
  const [formData, setFormData] = useState<JobFormData>({
    jobId: '',
    title: '',
    description: '',
    experience: 'Fresher',
    jobType: 'Full-time',
    jobMode: 'on-site',
    salary: 0,
    location: '',
    companyName: 'Senthuron Tech',
    companyDescription: 'Senthuron Tech is a leading technology company specializing in innovative solutions.',
    skillsRequired: [],
    benefits: [],
    openDate: new Date().toISOString().split('T')[0],
    closeDate: '',
    status: 'open'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const experienceOptions = ['Fresher', '1-3 years', '3-5 years', '5+ years'];
  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const jobModeOptions = ['on-site', 'off-site', 'hybrid'];
  const statusOptions = ['open', 'closed'];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.jobId.trim()) {
      newErrors.jobId = 'Job ID is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.salary < 0) {
      newErrors.salary = 'Salary must be a positive number';
    } else if (formData.salary > 1000000) {
      newErrors.salary = 'Salary cannot exceed 1,000,000';
    }

    if (!formData.openDate) {
      newErrors.openDate = 'Open date is required';
    }

    if (!formData.closeDate) {
      newErrors.closeDate = 'Close date is required';
    } else if (formData.closeDate <= formData.openDate) {
      newErrors.closeDate = 'Close date must be after open date';
    }

    if (formData.skillsRequired.length === 0) {
      newErrors.skillsRequired = 'At least one skill is required';
    }

    if (formData.companyDescription.length > 5000) {
      newErrors.companyDescription = 'Company description cannot exceed 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    const jobPayload = {
      jobId: formData.jobId,
      title: formData.title,
      description: formData.description,
      experience: formData.experience,
      jobType: formData.jobType,
      jobMode: formData.jobMode,
      salary: formData.salary,
      location: formData.location,
      skillsRequired: formData.skillsRequired,
      benefits: formData.benefits,
      openDate: new Date(formData.openDate).toISOString(),
      closeDate: new Date(formData.closeDate).toISOString(),
      status: formData.status
    };

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobPayload),
    });

    if (response.status !== 201) {
      throw new Error('Failed to create job');
    }

    onJobAdded?.();
    onBack();
  } catch (error) {
    console.error('Error:', error);
    onJobAdded?.();
    onBack();
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
      
      if (errors.skillsRequired) {
        setErrors(prev => ({
          ...prev,
          skillsRequired: ''
        }));
      }
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleBenefitKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBenefit();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Jobs
        </button>
      </div>

      <div className="form-container">
        <h1 className="form-title">Add New Job</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="jobId">Job ID *</label>
              <input
                type="text"
                id="jobId"
                name="jobId"
                className="form-input"
                value={formData.jobId}
                onChange={handleInputChange}
                placeholder="e.g., JOB001"
              />
              {errors.jobId && <div className="form-error">{errors.jobId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Frontend Developer"
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="experience">Experience Level *</label>
              <select
                id="experience"
                name="experience"
                className="form-select"
                value={formData.experience}
                onChange={handleInputChange}
              >
                {experienceOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jobType">Job Type *</label>
              <select
                id="jobType"
                name="jobType"
                className="form-select"
                value={formData.jobType}
                onChange={handleInputChange}
              >
                {jobTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="jobMode">Work Mode *</label>
              <select
                id="jobMode"
                name="jobMode"
                className="form-select"
                value={formData.jobMode}
                onChange={handleInputChange}
              >
                {jobModeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salary">Monthly Salary (Rs.) *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                className="form-input"
                value={formData.salary}
                onChange={handleInputChange}
                min="0"
                max="1000000"
                placeholder="e.g., 75000"
              />
              {errors.salary && <div className="form-error">{errors.salary}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, NY or Remote"
              />
              {errors.location && <div className="form-error">{errors.location}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                className="form-input"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="openDate">Opening Date *</label>
              <input
                type="date"
                id="openDate"
                name="openDate"
                className="form-input"
                value={formData.openDate}
                onChange={handleInputChange}
              />
              {errors.openDate && <div className="form-error">{errors.openDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="closeDate">Closing Date *</label>
              <input
                type="date"
                id="closeDate"
                name="closeDate"
                className="form-input"
                value={formData.closeDate}
                onChange={handleInputChange}
              />
              {errors.closeDate && <div className="form-error">{errors.closeDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and requirements..."
                maxLength={5000}
                rows={6}
              />
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                {formData.description.length}/5000 characters
              </div>
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div className="form-group full-width">
              <label className="form-label" htmlFor="companyDescription">Company Description</label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                className="form-textarea"
                value={formData.companyDescription}
                onChange={handleInputChange}
                placeholder="Describe your company..."
                maxLength={5000}
                rows={4}
              />
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                {formData.companyDescription.length}/5000 characters
              </div>
              {errors.companyDescription && <div className="form-error">{errors.companyDescription}</div>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Required Skills *</label>
              <div className="tags-input">
                {formData.skillsRequired.map((skill, index) => (
                  <div key={index} className="tag-item">
                    {skill}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeSkill(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  className="tag-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="Type a skill and press Enter"
                />
              </div>
              {errors.skillsRequired && <div className="form-error">{errors.skillsRequired}</div>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">Benefits & Perks</label>
              <div className="tags-input">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="tag-item">
                    {benefit}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeBenefit(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  className="tag-input"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyPress={handleBenefitKeyPress}
                  placeholder="Type a benefit and press Enter"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating Job...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;