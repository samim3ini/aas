import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import AttendanceTable from '../components/AttendanceTable';
import {
  fetchAttendanceRecords,
  updateAttendanceStatus,
} from '../services/employeeService';
import { useError } from '../context/ErrorContext';

interface AttendanceRecord {
  employeeID: string;
  attenDate: string;
  checkInTime: string | null;
  empStatus: string;
  imageUrl?: string;
  isEditing?: boolean;
}

const AttendanceManagement: React.FC = () => {
  const { setError } = useError();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load attendance on mount
  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const response = await fetchAttendanceRecords();
      setRecords(response.data);
    } catch (e: any) {
      setError(e, e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employeeID: string, attenDate: string) => {
    setRecords(prev =>
      prev.map(record =>
        record.employeeID === employeeID && record.attenDate === attenDate
          ? { ...record, isEditing: true }
          : record
      )
    );
  };

  const handleSaveClick = async (
    employeeID: string,
    attenDate: string,
    updatedStatus: string
  ) => {
    const record = records.find(
      r => r.employeeID === employeeID && r.attenDate === attenDate
    );
    if (!record || record.empStatus === updatedStatus) {
      handleCancelClick(employeeID, attenDate);
      return;
    }

    setLoading(true);
    try {
      await updateAttendanceStatus(employeeID, attenDate, updatedStatus);
      setRecords(prev =>
        prev.map(r =>
          r.employeeID === employeeID && r.attenDate === attenDate
            ? { ...r, empStatus: updatedStatus, isEditing: false }
            : r
        )
      );
    } catch (e: any) {
      setError(e, e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (employeeID: string, attenDate: string) => {
    setRecords(prev =>
      prev.map(record =>
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
        sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}
      >
        Attendance Management
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <AttendanceTable
          records={records}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveClick}
          onCancelClick={handleCancelClick}
        />
      )}
    </Container>
  );
};

export default AttendanceManagement;