import React, { useState } from 'react';
import placeholder from '../assets/placeholder.jpg';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TableSortLabel,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface AttendanceRecord {
  employeeID: string;
  attenDate: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  empStatus: string;
  imageUrl?: string;
  isEditing?: boolean;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEditClick: (employeeID: string, attenDate: string) => void;
  onSaveClick: (employeeID: string, attenDate: string, updatedStatus: string) => void;
  onCancelClick: (employeeID: string, attenDate: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onEditClick,
  onSaveClick,
  onCancelClick,
}) => {
  const [editedStatus, setEditedStatus] = useState<{ [key: string]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof AttendanceRecord; direction: 'desc' | 'asc' }>({
    key: 'attenDate',
    direction: 'desc',
  });

  const handleStatusChange = (key: string, value: string) => {
    setEditedStatus((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancel = (employeeID: string, attenDate: string) => {
    const key = `${employeeID}-${attenDate}`;
    setEditedStatus((prev) => {
      const { [key]: _, ...rest } = prev; // Remove the key from editedStatus
      return rest;
    });
    onCancelClick(employeeID, attenDate); // Call the parent cancel handler
  };

  const handleSort = (key: keyof AttendanceRecord) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedRecords = React.useMemo(() => {
    if (!sortConfig) return records;

    const { key, direction } = sortConfig;
    return [...records].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (key === 'attenDate' || key === 'checkInTime' || key === 'checkOutTime') {
        const aDate = aValue ? new Date(aValue.toString()).getTime() : 0;
        const bDate = bValue ? new Date(bValue.toString()).getTime() : 0;
        return direction === 'asc' ? aDate - bDate : bDate - aDate;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [records, sortConfig]);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mb: 4 }}>
      <Table aria-label="attendance table">
        <TableHead sx={{ bgcolor: 'primary.light' }}>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Image
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'employeeID'}
                direction={sortConfig?.key === 'employeeID' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('employeeID')}
              >
                Employee ID
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'attenDate'}
                direction={sortConfig?.key === 'attenDate' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('attenDate')}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'checkInTime'}
                direction={sortConfig?.key === 'checkInTime' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('checkInTime')}
              >
                Check-In Time
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'checkOutTime'}
                direction={sortConfig?.key === 'checkOutTime' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('checkOutTime')}
              >
                Check-Out Time
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRecords.map((record) => {
            const key = `${record.employeeID}-${record.attenDate}`;
            return (
              <TableRow key={key}>
                <TableCell align="center">
                  <img
                    src={record.imageUrl || placeholder}
                    alt="Visitor"
                    width="100"
                    style={{ borderRadius: '10%' }}
                    onClick={() => {
                      window.open(record.imageUrl || placeholder, '_blank');
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholder;
                      (e.target as HTMLImageElement).onclick = () => { window.open(placeholder, '_blank'); };
                    }}
                  />
                </TableCell>
                <TableCell align="center">{record.employeeID}</TableCell>
                <TableCell align="center">{record.attenDate}</TableCell>
                <TableCell align="center">
                  {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {record.isEditing ? (
                    <Select
                      value={editedStatus[key] || record.empStatus}
                      onChange={(e) => handleStatusChange(key, e.target.value)}
                      sx={{ width: '120px' }}
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Late">Late</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                    </Select>
                  ) : (
                    <span
                      style={{
                        color:
                          record.empStatus === 'Absent'
                            ? 'red'
                            : record.empStatus === 'Late'
                              ? 'orange'
                              : 'green',
                        fontWeight: 'bold',
                      }}
                    >
                      {record.empStatus}
                    </span>
                  )}
                </TableCell>
                <TableCell align="center">
                  {record.isEditing ? (
                    <>
                      <IconButton
                        onClick={() =>
                          onSaveClick(record.employeeID, record.attenDate, editedStatus[key] || record.empStatus)
                        }
                        color="primary"
                      >
                        <SaveIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleCancel(record.employeeID, record.attenDate)}
                        color="secondary"
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      onClick={() => onEditClick(record.employeeID, record.attenDate)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;