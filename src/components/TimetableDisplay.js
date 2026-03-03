import React, { useEffect, useCallback } from 'react';
import { useTimetableContext } from '../context/TimetableContext';
import { useClashDetection } from '../hooks/useClashDetection';
import './TimetableDisplay.css';

const TimetableDisplay = () => {
  const { timetableData, clashReport, showClashes } = useTimetableContext();
  const { clashingCourses, clashCounts, slotClashCounts } = useClashDetection(timetableData, clashReport);

  useEffect(() => {
    if (timetableData) {
      console.log('Timetable loaded:', timetableData);
    }
  }, [timetableData]);

  const isClashing = useCallback((courseText) => {
    if (!showClashes || !courseText) return false;
    
    for (const clash of clashingCourses) {
      if (courseText.includes(clash)) {
        return true;
      }
    }
    return false;
  }, [showClashes, clashingCourses]);

  const getClashCount = useCallback((courseText) => {
    if (!showClashes || !courseText) return 0;
    
    let total = 0;
    for (const [key, count] of Object.entries(clashCounts)) {
      if (courseText.includes(key)) {
        total += count;
      }
    }
    return total;
  }, [showClashes, clashCounts]);

  if (!timetableData) {
    return <div className="no-data">Please upload a timetable file</div>;
  }

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>Timetable</h2>
        {showClashes && <span className="clash-indicator">Showing Clashes</span>}
      </div>
      
      <div className="timetable-wrapper">
        <table className="timetable">
          <thead>
            <tr>
              <th>Day</th>
              {timetableData.timeSlots?.map((slot, index) => (
                <th key={index}>
                  {slot}
                  {showClashes && slotClashCounts[slot] > 0 && (
                    <div className="slot-clash-count">
                      {slotClashCounts[slot]} clashes
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timetableData.days?.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td className="day-cell">{day.name}</td>
                {day.slots?.map((slot, slotIndex) => {
                  const isClash = isClashing(slot);
                  const clashCount = getClashCount(slot);
                  
                  return (
                    <td 
                      key={slotIndex} 
                      className={`slot-cell ${isClash ? 'clash' : ''} ${!slot ? 'empty' : ''}`}
                    >
                      {slot && (
                        <>
                          <div className="course-info">{slot}</div>
                          {isClash && clashCount > 0 && (
                            <div className="clash-count">{clashCount} students</div>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableDisplay;
