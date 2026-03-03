import React from 'react';
import { TimetableProvider } from './context/TimetableContext';
import FileUpload from './components/FileUpload';
import ClashReportUpload from './components/ClashReportUpload';
import TimetableDisplay from './components/TimetableDisplay';
import './App.css';

function App() {
  return (
    <TimetableProvider>
      <div className="App">
        <header className="app-header">
          <h1>Timetable Clash Detector</h1>
        </header>
        <main className="app-main">
          <div className="upload-section">
            <FileUpload />
            <ClashReportUpload />
          </div>
          <TimetableDisplay />
        </main>
      </div>
    </TimetableProvider>
  );
}

export default App;
