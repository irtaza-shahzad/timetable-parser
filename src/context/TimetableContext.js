import React, { createContext, useState, useContext } from 'react';

const TimetableContext = createContext();

export const useTimetableContext = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetableContext must be used within TimetableProvider');
  }
  return context;
};

export const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState(null);
  const [clashReport, setClashReport] = useState(null);
  const [showClashes, setShowClashes] = useState(false);

  const value = {
    timetableData,
    setTimetableData,
    clashReport,
    setClashReport,
    showClashes,
    setShowClashes
  };

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  );
};
