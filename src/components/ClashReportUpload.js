import React, { useRef } from 'react';
import { useTimetableContext } from '../context/TimetableContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { parseClashReport } from '../utils/clashReportParser';
import './ClashReportUpload.css';

const ClashReportUpload = () => {
  const fileInputRef = useRef(null);
  const { setClashReport, setShowClashes } = useTimetableContext();
  const { readExcelFile, loading, error } = useFileUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log('Reading clash report file:', file.name);
        const rawData = await readExcelFile(file);
        console.log('Raw clash report data:', rawData);
        const parsedReport = parseClashReport(rawData);
        console.log('Parsed clash report:', parsedReport);
        setClashReport(parsedReport);
        setShowClashes(true);
      } catch (err) {
        console.error('Error processing clash report:', err);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="clash-report-upload">
      <h2>Upload Clash Report</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button onClick={handleButtonClick} disabled={loading}>
        {loading ? 'Processing...' : 'Choose File'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ClashReportUpload;
