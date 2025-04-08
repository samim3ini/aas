import axios from 'axios';

const API_EMP_URL = 'https://rjjunsawi4.execute-api.us-east-1.amazonaws.com/test/employees';
const API_ATTEN_URL = 'https://rjjunsawi4.execute-api.us-east-1.amazonaws.com/test/attendance';
const API_ANYL_URL = 'https://rjjunsawi4.execute-api.us-east-1.amazonaws.com/test/attendance/analytics';

export const fetchEmployees = async () => {
  return axios.get(API_EMP_URL);
};

export const addEmployee = async (employeeData: any) => {
  return axios.post(API_EMP_URL, employeeData, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const updateEmployee = async (employeeID: string, updatedData: any) => {
  return axios.put(`${API_EMP_URL}/${employeeID}`, updatedData, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const deleteEmployee = async (employeeID: string) => {
  return axios.delete(`${API_EMP_URL}/${employeeID}`);
};

export const fetchAttendanceRecords = async () => {
    return axios.get(API_ATTEN_URL);
};

export const updateAttendanceStatus = async (employeeID: string, updatedStatus: string) => {
  return axios.put(`${API_ATTEN_URL}/${employeeID}`, { empStatus: updatedStatus }, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const fetchAttendanceAnalytics = async (date?: string) => {
  const query = date ? `?date=${date}` : '';
  return axios.get(`${API_ANYL_URL}${query}`);
};
