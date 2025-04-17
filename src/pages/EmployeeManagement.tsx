import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';
import {
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from '../services/employeeService';
import { useError } from '../context/ErrorContext';

interface Employee {
    employeeID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    department: string;
    imageBase64?: string;
}

const EmployeeManagement: React.FC = () => {
    const { setError } = useError();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    // Load all employees on mount
    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await fetchEmployees();
            setEmployees(response.data);
        } catch (e: any) {
            setError(e, e.response?.data);
        }
    };

    const handleAdd = async (data: any) => {
        try {
            await addEmployee(data);
            setOpenForm(false);
            loadEmployees();
        } catch (e: any) {
            setError(e, e.response?.data);
        }
    };

    const handleUpdate = async (data: any) => {
        try {
            await updateEmployee(data.employeeID, data);
            setOpenForm(false);
            setIsEditing(false);
            setEditingEmployee(null);
            loadEmployees();
        } catch (e: any) {
            setError(e, e.response?.data);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEmployee(id);
            loadEmployees();
        } catch (e: any) {
            setError(e, e.response?.data);
        }
    };

    const handleEditClick = (emp: Employee) => {
        setEditingEmployee(emp);
        setIsEditing(true);
        setOpenForm(true);
    };

    const handleFormSubmit = (data: any) => {
        if (data.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result?.toString().split(',')[1];
                const payload = { ...data, imageBase64: base64 };
                isEditing ? handleUpdate(payload) : handleAdd(payload);
            };
            reader.readAsDataURL(data.image);
        } else {
            isEditing ? handleUpdate(data) : handleAdd(data);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: 4
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                    Employee Management
                </Typography>
                <Button
                    variant="contained"
                    sx={{ px: 4, py: 1.5 }}
                    onClick={() => {
                        setIsEditing(false);
                        setEditingEmployee(null);
                        setOpenForm(true);
                    }}
                >
                    Add Employee
                </Button>
            </Box>

            <EmployeeTable
                employees={employees}
                onEdit={handleEditClick}
                onDelete={handleDelete}
            />

            <Dialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                    {isEditing ? 'Edit Employee' : 'Add Employee'}
                </DialogTitle>
                <DialogContent>
                    <EmployeeForm
                        initialData={editingEmployee || undefined}
                        isEditing={isEditing}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setOpenForm(false);
                            setIsEditing(false);
                            setEditingEmployee(null);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default EmployeeManagement;