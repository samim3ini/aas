import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';

interface Employee {
    employeeID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    department: string;
    imageBase64?: string;
}

const EmployeeManagement: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await fetchEmployees();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleAdd = async (formData: any) => {
        try {
            await addEmployee(formData);
            setOpenForm(false);
            loadEmployees();
        } catch (error: any) {
            console.error('Error adding employee:', error);
            setErrorMessage('Error adding employee: ' + error.message);
            setErrorDialogOpen(true);
        }
    };

    const handleUpdate = async (formData: any) => {
        try {
            await updateEmployee(formData.employeeID, formData);
            setOpenForm(false);
            setIsEditing(false);
            setEditingEmployee(null);
            loadEmployees();
        } catch (error) {
            console.error('Error updating employee:', error);
            // Optionally handle update errors here too.
        }
    };

    const handleDelete = async (employeeID: string) => {
        try {
            await deleteEmployee(employeeID);
            loadEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleEditClick = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsEditing(true);
        setOpenForm(true);
    };

    const handleFormSubmit = (data: any) => {
        if (data.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(',')[1];
                const payload = { ...data, imageBase64: base64 };
                if (isEditing) {
                    handleUpdate(payload);
                } else {
                    handleAdd(payload);
                }
            };
            reader.readAsDataURL(data.image);
        } else {
            if (isEditing) {
                handleUpdate(data);
            } else {
                handleAdd(data);
            }
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 4 }}>
                <Typography textAlign="center" variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Employee Management
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        setOpenForm(true);
                        setIsEditing(false);
                        setEditingEmployee(null);
                    }}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Add Employee
                </Button>
            </Box>
            <Paper sx={{ p: 2, mb: 4, boxShadow: 3 }}>
                <EmployeeTable employees={employees} onEdit={handleEditClick} onDelete={handleDelete} />
            </Paper>
            <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    {isEditing ? 'Edit Employee' : 'Add Employee'}
                </DialogTitle>
                <DialogContent>
                    <EmployeeForm
                        initialData={editingEmployee || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setOpenForm(false);
                            setIsEditing(false);
                            setEditingEmployee(null);
                        }}
                        isEditing={isEditing}
                    />
                </DialogContent>
            </Dialog>
            <Dialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
                aria-labelledby="error-dialog-title"
                aria-describedby="error-dialog-description"
            >
                <DialogTitle id="error-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <DialogContentText id="error-dialog-description" color="error">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeeManagement;
