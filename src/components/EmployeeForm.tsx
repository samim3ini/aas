import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';

interface EmployeeFormProps {
  initialData?: {
    employeeID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    department: string;
  };
  onSubmit: (formData: {
    employeeID: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    department: string;
    image?: File | null;
  }) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [employeeID, setEmployeeID] = useState(initialData?.employeeID || '');
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!employeeID || !fullName || !email || !phoneNumber || !department) {
      setErrorMessage('All fields are required.');
      return;
    }
    onSubmit({ employeeID, fullName, email, phoneNumber, department, image });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Button variant="contained" component="label">
            Upload Image
            <input hidden accept="image/*" type="file" onChange={handleImageChange} />
          </Button>
          {preview && (
            <Box mt={2}>
              <img src={preview} alt="Preview" style={{ maxWidth: '100%', borderRadius: 4 }} />
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField 
            name="employeeID"
            label="Employee ID"
            fullWidth
            value={employeeID}
            onChange={(e) => setEmployeeID(e.target.value)}
            required
            disabled={isEditing}
            autoFocus
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Grid>
        <Grid size={12}>
          <TextField
            name="department"
            label="Department"
            fullWidth
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </Grid>
        {errorMessage && (
          <Grid size={12}>
            <Typography variant="body2" color="error">{errorMessage}</Typography>
          </Grid>
        )}
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit" sx={{ mr: 1 }}>
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeForm;
