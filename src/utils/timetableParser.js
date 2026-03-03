export const parseTimetableData = (rawData) => {
  if (!rawData || rawData.length < 2) {
    return null;
  }

  let timeSlotRow = -1;
  let dataStartRow = -1;

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell && typeof cell === 'string' && cell.match(/\d{1,2}:\d{2}/)) {
        timeSlotRow = i;
        dataStartRow = i + 1;
        break;
      }
    }
    if (timeSlotRow !== -1) break;
  }

  if (timeSlotRow === -1) {
    return null;
  }

  const timeSlots = [];
  const headerRow = rawData[timeSlotRow];
  
  for (let i = 0; i < headerRow.length; i++) {
    if (headerRow[i] && headerRow[i].toString().trim() !== '') {
      const timeText = headerRow[i].toString().trim();
      if (timeText.match(/\d{1,2}:\d{2}/)) {
        timeSlots.push(timeText);
      }
    }
  }

  const days = [];
  let currentDay = '';

  for (let i = dataStartRow; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue;

    const firstCell = row[0] ? row[0].toString().trim() : '';
    
    if (firstCell.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i)) {
      currentDay = firstCell;
      
      if (!days.find(d => d.name === currentDay)) {
        days.push({
          name: currentDay,
          slots: []
        });
      }
    }

    if (currentDay) {
      const dayData = days.find(d => d.name === currentDay);
      const venue = row[1] ? row[1].toString().trim() : '';
      
      const rowSlots = [];
      for (let j = 0; j < timeSlots.length; j++) {
        let cellIndex = -1;
        for (let k = 2; k < row.length; k++) {
          if (headerRow[k] && headerRow[k].toString().includes(timeSlots[j].split('-')[0])) {
            cellIndex = k;
            break;
          }
        }
        
        if (cellIndex !== -1 && row[cellIndex]) {
          const courseText = row[cellIndex].toString().trim();
          if (courseText && venue) {
            rowSlots.push(`${courseText} - ${venue}`);
          } else {
            rowSlots.push(courseText);
          }
        } else {
          rowSlots.push('');
        }
      }
      
      if (dayData && rowSlots.some(s => s !== '')) {
        if (dayData.slots.length === 0) {
          dayData.slots = rowSlots;
        } else {
          for (let j = 0; j < rowSlots.length; j++) {
            if (rowSlots[j]) {
              if (dayData.slots[j]) {
                dayData.slots[j] += `\n${rowSlots[j]}`;
              } else {
                dayData.slots[j] = rowSlots[j];
              }
            }
          }
        }
      }
    }
  }

  return {
    timeSlots,
    days: days.filter(d => d.slots.length > 0)
  };
};
