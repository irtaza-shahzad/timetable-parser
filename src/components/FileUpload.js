import React, { useRef } from 'react';
import { useTimetableContext } from '../context/TimetableContext';
import { useFileUpload } from '../hooks/useFileUpload';
import { parseTimetableData } from '../utils/timetableParser';
import './FileUpload.css';

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const { setTimetableData } = useTimetableContext();
  const { readExcelFile, loading, error } = useFileUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        console.log('Reading timetable file:', file.name);
        const rawData = await readExcelFile(file);
        console.log('Raw timetable data:', rawData);
        const parsedData = parseTimetableData(rawData);
        console.log('Parsed timetable data:', parsedData);
        setTimetableData(parsedData);
      } catch (err) {
        console.error('Error processing file:', err);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="file-upload">
      <h2>Upload Timetable</h2>
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

export default FileUpload;
