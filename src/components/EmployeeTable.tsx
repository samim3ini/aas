import React, { useState } from 'react';
import placeholder from '../assets/placeholder.jpg';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  TableContainer,
  TableSortLabel,
} from '@mui/material';

interface Employee {
  employeeID: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  imageUrl?: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employeeID: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Employee; direction: 'asc' | 'desc' }>({
    key: 'employeeID',
    direction: 'asc',
  });

  const handleSort = (key: keyof Employee) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedEmployees = React.useMemo(() => {
    if (!sortConfig) return employees;

    const { key, direction } = sortConfig;
    return [...employees].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }, [employees, sortConfig]);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mb: 4 }}>
      <Table aria-label="employee table">
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
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'fullName'}
                direction={sortConfig?.key === 'fullName' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('fullName')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'email'}
                direction={sortConfig?.key === 'email' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('email')}
              >
                Email
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'phoneNumber'}
                direction={sortConfig?.key === 'phoneNumber' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('phoneNumber')}
              >
                Phone
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              <TableSortLabel
                active={sortConfig?.key === 'department'}
                direction={sortConfig?.key === 'department' ? sortConfig.direction : 'asc'}
                onClick={() => handleSort('department')}
              >
                Department
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedEmployees.map((employee) => (
            <TableRow key={employee.employeeID} hover>
              <TableCell align="center">
                {employee.imageUrl ? (
                  <img
                    src={`${employee.imageUrl}`}
                    alt="Employee"
                    width="75"
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <img src={placeholder} alt="No Image" width="75" style={{ borderRadius: '50%' }} />
                )}
              </TableCell>
              <TableCell align="center">{employee.employeeID}</TableCell>
              <TableCell align="center">{employee.fullName}</TableCell>
              <TableCell align="center">{employee.email}</TableCell>
              <TableCell align="center">{employee.phoneNumber}</TableCell>
              <TableCell align="center">{employee.department}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" onClick={() => onEdit(employee)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => onDelete(employee.employeeID)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeTable;