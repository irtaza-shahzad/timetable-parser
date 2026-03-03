import { useMemo } from 'react';

export const useClashDetection = (timetableData, clashReport) => {
  const clashingCourses = useMemo(() => {
    if (!timetableData || !clashReport || clashReport.length === 0) return new Set();
    
    const clashes = new Set();
    
    clashReport.forEach(item => {
      if (item.courseCode) {
        clashes.add(item.courseCode);
      }
      if (item.courseName) {
        clashes.add(item.courseName);
      }
      if (item.fullCourse) {
        clashes.add(item.fullCourse);
      }
    });
    
    console.log('Clashing courses:', Array.from(clashes));
    return clashes;
  }, [timetableData, clashReport]);

  const clashCounts = useMemo(() => {
    if (!timetableData || !clashReport || clashReport.length === 0) return {};
    
    const counts = {};
    
    clashReport.forEach(item => {
      if (item.courseName) {
        const key = item.courseName;
        if (!counts[key]) {
          counts[key] = 0;
        }
        counts[key] += item.count || 0;
      }
      
      if (item.courseCode && item.courseCode !== item.courseName) {
        const key = item.courseCode;
        if (!counts[key]) {
          counts[key] = 0;
        }
        counts[key] += item.count || 0;
      }
    });
    
    console.log('Clash counts:', counts);
    return counts;
  }, [timetableData, clashReport]);

  const slotClashCounts = useMemo(() => {
    if (!timetableData || !clashReport || clashReport.length === 0) return {};
    
    const slotCounts = {};
    
    timetableData.days?.forEach((day, dayIndex) => {
      day.slots?.forEach((slot, slotIndex) => {
        if (slot) {
          const slotKey = timetableData.timeSlots[slotIndex];
          clashReport.forEach(item => {
            if (slot.includes(item.courseCode) || slot.includes(item.courseName)) {
              if (!slotCounts[slotKey]) {
                slotCounts[slotKey] = 0;
              }
              slotCounts[slotKey] += item.count || 0;
            }
          });
        }
      });
    });
    
    return slotCounts;
  }, [timetableData, clashReport]);

  return { clashingCourses, clashCounts, slotClashCounts };
};
