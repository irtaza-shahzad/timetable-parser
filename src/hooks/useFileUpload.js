import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const readExcelFile = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          setLoading(false);
          resolve(jsonData);
        } catch (err) {
          setLoading(false);
          setError('Error parsing file');
          reject(err);
        }
      };
      
      reader.onerror = () => {
        setLoading(false);
        setError('Error reading file');
        reject(new Error('Error reading file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }, []);

  return { readExcelFile, loading, error };
};
