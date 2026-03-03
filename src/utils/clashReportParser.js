export const parseClashReport = (rawData) => {
  if (!rawData || rawData.length < 2) {
    return [];
  }

  const clashData = [];
  const courseGroups = new Map();

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 3) continue;

    const courseName = row[1] ? row[1].toString().trim() : '';
    const section = row[2] ? row[2].toString().trim() : '';
    const count = row[3] ? parseInt(row[3]) : 0;

    if (courseName && count > 0) {
      const courseCode = courseName.split(' - ')[0].trim();
      const fullCourse = `${courseName} (${section})`;
      
      if (!courseGroups.has(courseCode)) {
        courseGroups.set(courseCode, []);
      }
      
      courseGroups.get(courseCode).push({
        fullName: fullCourse,
        courseName: courseName,
        section: section,
        count: count
      });
    }
  }

  courseGroups.forEach((sections, courseCode) => {
    if (sections.length > 1) {
      const totalCount = sections.reduce((sum, s) => sum + s.count, 0);
      sections.forEach(section => {
        clashData.push({
          courseCode: courseCode,
          courseName: section.courseName,
          fullCourse: section.fullName,
          section: section.section,
          count: section.count,
          totalClashingStudents: totalCount,
          courses: [section.fullName]
        });
      });
    }
  });

  return clashData;
};
