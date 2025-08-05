import React, { useState } from 'react';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import AddJobForm from './components/AddJobForm';
import './styles.css';

type ViewType = 'list' | 'detail' | 'add';

interface AppState {
  currentView: ViewType;
  selectedJobId: string | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentView: 'list',
    selectedJobId: null
  });

  const handleJobSelect = (jobId: string) => {
    setState({
      currentView: 'detail',
      selectedJobId: jobId
    });
  };

  const handleBackToList = () => {
    setState({
      currentView: 'list',
      selectedJobId: null
    });
  };

  const handleAddJob = () => {
    setState({
      currentView: 'add',
      selectedJobId: null
    });
  };

  const handleJobAdded = () => {
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'detail':
        if (!state.selectedJobId) {
          return <JobList onJobSelect={handleJobSelect} />;
        }
        return (
          <JobDetail
            jobId={state.selectedJobId}
            onBack={handleBackToList}
          />
        );
      case 'add':
        return (
          <AddJobForm
            onBack={handleBackToList}
            onJobAdded={handleJobAdded}
          />
        );
      default:
        return <JobList onJobSelect={handleJobSelect} />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              Senthuron Tech Jobs
            </div>
            <div className="nav-buttons">
              <button
                className={`btn ${state.currentView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleBackToList}
              >
                All Jobs
              </button>
              <button
                className={`btn ${state.currentView === 'add' ? 'btn-primary' : 'btn-outline'}`}
                onClick={handleAddJob}
              >
                + Add New Job
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;