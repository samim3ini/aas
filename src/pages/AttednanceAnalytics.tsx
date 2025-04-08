import React, { useState, useEffect } from 'react';
import { fetchAttendanceAnalytics } from '../services/employeeService';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField
} from '@mui/material';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';

interface AnalyticsData {
  date: string;
  totalRecords: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  onTimeRate: number;
  lateRate: number;
  absentRate: number;
  attendanceRate: number;
  averageCheckInTime: string | null;
  earliestCheckIn: string | null;
  latestCheckIn: string | null;
  peakCheckInHour: number | string;
}

const AttendanceAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Set default date on mount.
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const defaultDate = `${yyyy}-${mm}-${dd}`;
    setSelectedDate(defaultDate);
  }, []);

  const fetchData = async (date: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchAttendanceAnalytics(date);
      setAnalytics(response.data);
    } catch (err: any) {
      setError('Failed to fetch analytics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics when the selected date changes.
  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!analytics) return null;

  // Prepare data for the charts.
  const pieData = [
    { name: 'Present', value: analytics.presentCount },
    { name: 'Late', value: analytics.lateCount },
    { name: 'Absent', value: analytics.absentCount }
  ];

  const barData = [
    { name: 'On Time', value: analytics.onTimeRate },
    { name: 'Late', value: analytics.lateRate },
    { name: 'Absent', value: analytics.absentRate },
    { name: 'Attendance', value: analytics.attendanceRate }
  ];

  // Define colors for the pie chart segments.
  const pieColors = ['#4caf50', '#ff9800', '#f44336'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Attendance Analytics
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const newDate = e.target.value;
              setSelectedDate(newDate);
              fetchData(newDate);
            }}
          />
        </Box>
      </Stack>
      <br />

      {/* Summary Cards */}
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Attendance Summary
            </Typography>
            <Typography>Total Records: {analytics.totalRecords}</Typography>
            <Typography>Present: {analytics.presentCount}</Typography>
            <Typography>Late: {analytics.lateCount}</Typography>
            <Typography>Absent: {analytics.absentCount}</Typography>
            <Typography>
              Attendance Rate: {analytics.attendanceRate}%
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Check-In Times
            </Typography>
            <Typography>
              Average: {analytics.averageCheckInTime || 'N/A'}
            </Typography>
            <Typography>
              Earliest: {analytics.earliestCheckIn || 'N/A'}
            </Typography>
            <Typography>
              Latest: {analytics.latestCheckIn || 'N/A'}
            </Typography>
            <Typography>Peak Hour: {analytics.peakCheckInHour}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Charts */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 4
        }}
      >
        <Card sx={{ flex: '1 1 300px', maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom color="primary">
              Attendance Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 300px', maxWidth: 500 }}>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom color="primary">
              Attendance Rates (%)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(tick) => `${tick}%`} />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Legend />
                <Bar dataKey="value" fill="#2196f3">
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value: any) => `${value}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AttendanceAnalytics;
