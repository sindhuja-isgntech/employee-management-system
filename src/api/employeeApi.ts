// src/api/employeeApi.ts
import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface ApiEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive' | 'Onboarding';
}

export const employeeApi = {
  // Fetch all employees
  getEmployees: async (): Promise<ApiEmployee[]> => {
    const response = await axiosInstance.get<ApiEmployee[]>(ENDPOINTS.EMPLOYEES);
    return response.data;
  },

  // Fetch single employee by ID
  getEmployeeById: async (id: number | string): Promise<ApiEmployee> => {
    const response = await axiosInstance.get<ApiEmployee>(ENDPOINTS.EMPLOYEE_BY_ID(id));
    return response.data;
  },

  // Create employee
  createEmployee: async (data: Partial<ApiEmployee>): Promise<ApiEmployee> => {
    const response = await axiosInstance.post<ApiEmployee>(ENDPOINTS.EMPLOYEES, data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: number | string, data: Partial<ApiEmployee>): Promise<ApiEmployee> => {
    const response = await axiosInstance.put<ApiEmployee>(ENDPOINTS.EMPLOYEE_BY_ID(id), data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.EMPLOYEE_BY_ID(id));
  },
};

export default employeeApi;

