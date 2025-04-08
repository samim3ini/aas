import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { fetchAttendanceRecords, updateAttendanceStatus } from '../services/employeeService';
import AttendanceTable from '../components/AttendanceTable';

interface AttendanceRecord {
  employeeID: string;
  attenDate: string;
  checkInTime: string | null;
  empStatus: string;
  imageUrl?: string;
  isEditing?: boolean;
}

const AttendanceManagement: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const response = await fetchAttendanceRecords();
        setRecords(response.data);
      } catch (err: any) {
        console.error('Error fetching attendance records:', err);
        setError('Failed to load attendance records.');
      }
    };
    loadAttendance();
  }, []);

  const handleEditClick = (employeeID: string, attenDate: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.employeeID === employeeID && record.attenDate === attenDate
          ? { ...record, isEditing: true }
          : record
      )
    );
  };

  const handleSaveClick = async (employeeID: string, attenDate: string, updatedStatus: string) => {
    const recordToUpdate = records.find(
      (record) => record.employeeID === employeeID && record.attenDate === attenDate
    );

    if (recordToUpdate && recordToUpdate.empStatus !== updatedStatus) {
      try {
        await updateAttendanceStatus(employeeID, updatedStatus);
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.employeeID === employeeID && record.attenDate === attenDate
              ? { ...record, empStatus: updatedStatus, isEditing: false }
              : record
          )
        );
      } catch (err) {
        console.error('Error updating attendance status:', err);
        setError('Failed to update attendance status.');
      }
    } else {
      // If no change, just exit edit mode
      handleCancelClick(employeeID, attenDate);
    }
  };

  const handleCancelClick = (employeeID: string, attenDate: string) => {
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.employeeID === employeeID && record.attenDate === attenDate
          ? { ...record, isEditing: false }
          : record
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        textAlign="center"
        variant="h4"
        component="h1"
        sx={{ fontWeight: 'bold', color: 'text.primary' }}
      >
        Attendance Management
      </Typography>
      <br />
      {error && <Typography color="error">{error}</Typography>}
      <AttendanceTable
        records={records}
        onEditClick={handleEditClick}
        onSaveClick={handleSaveClick}
        onCancelClick={handleCancelClick}
      />
    </Container>
  );
};

export default AttendanceManagement;