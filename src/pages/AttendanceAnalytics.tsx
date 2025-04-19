import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
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
import { fetchAttendanceAnalytics } from '../services/employeeService';
import { useError } from '../context/ErrorContext';

interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
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

const barColors = ['#4caf50', '#ff9800', '#f44336', '#2196f3'];
const pieColors = ['#4caf50', '#ff9800', '#f44336'];
const periodLabels: Record<AnalyticsData['period'], string> = {
  day: 'Daily',
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
};

const AttendanceAnalytics: React.FC = () => {
  const theme = useTheme();
  const { setError } = useError();

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [period, setPeriod] = useState<AnalyticsData['period']>('day');

  // initialize date
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // fetch on date/period change
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    fetchAttendanceAnalytics(selectedDate, period)
      .then(resp => {
        setAnalytics(resp.data);
      })
      .catch((e: any) => {
        setError(e, e.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedDate, period, setError]);

  const handleExportCSV = () => {
    if (!analytics) return;
    const rows = [
      ['Period', periodLabels[analytics.period]],
      ['Start Date', analytics.startDate],
      ['End Date', analytics.endDate],
      ['Total Records', analytics.totalRecords.toString()],
      ['Present', analytics.presentCount.toString()],
      ['Late', analytics.lateCount.toString()],
      ['Absent', analytics.absentCount.toString()],
      ['Attendance Rate', analytics.attendanceRate.toString() + '%'],
      ['Average Check‑In', analytics.averageCheckInTime ?? ''],
      ['Earliest Check‑In', analytics.earliestCheckIn ?? ''],
      ['Latest Check‑In', analytics.latestCheckIn ?? ''],
      ['Peak Hour', analytics.peakCheckInHour.toString()],
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}-${period}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  const pieData = [
    { name: 'Present', value: analytics.presentCount },
    { name: 'Late', value: analytics.lateCount },
    { name: 'Absent', value: analytics.absentCount },
  ];
  const barData = [
    { name: 'On Time', rate: analytics.onTimeRate },
    { name: 'Late', rate: analytics.lateRate },
    { name: 'Absent', rate: analytics.absentRate },
    { name: 'Attendance', rate: analytics.attendanceRate },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header & Controls */}
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Attendance Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            size="small"
          />
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_e, v) => v && setPeriod(v)}
            size="small"
          >
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="year">Year</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          size="small"
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Summary Chips */}
      <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 2, mb: 4 }}>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
          <Chip label={`Period: ${periodLabels[analytics.period]}`} variant="outlined" />
          <Chip label={`Range: ${analytics.startDate} → ${analytics.endDate}`} variant="outlined" />
          <Chip label={`Total Records: ${analytics.totalRecords}`} />
          <Chip label={`Present: ${analytics.presentCount}`} color="success" />
          <Chip label={`Late: ${analytics.lateCount}`} color="warning" />
          <Chip label={`Absent: ${analytics.absentCount}`} color="error" />
          <Chip label={`Attendance Rate: ${analytics.attendanceRate}%`} color="info" />
        </Stack>
      </Box>

      {/* Check‑In Time Chips */}
      <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 2, mb: 4 }}>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
          <Chip label={`Average Check‑In: ${analytics.averageCheckInTime ?? 'N/A'}`} />
          <Chip label={`Earliest Check‑In: ${analytics.earliestCheckIn ?? 'N/A'}`} />
          <Chip label={`Latest Check‑In: ${analytics.latestCheckIn ?? 'N/A'}`} />
          <Chip label={`Peak Hour: ${analytics.peakCheckInHour}`} />
        </Stack>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        <Box sx={{ flex: '1 1 300px', maxWidth: 500, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" align="center" color="primary" gutterBottom>
            Status Breakdown
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ flex: '1 1 300px', maxWidth: 500, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" align="center" color="primary" gutterBottom>
            Punctuality Rates (%)
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} tickFormatter={t => `${t}%`} />
              <Tooltip
                formatter={(value: number) => `${value}%`}
                labelFormatter={() => ""}
               />
              <Bar dataKey="rate">
                {barData.map((_: { name: string; rate: number }, i: number) => (
                  <Cell key={`cell-${i}`} fill={barColors[i % barColors.length]} />
                ))}
                <LabelList dataKey="rate" position="top" formatter={(v: number) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default AttendanceAnalytics;