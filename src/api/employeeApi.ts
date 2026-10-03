// src/api/employeeApi.ts
import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './endpoints';

export interface ApiEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfJoining: string;
  salary: number;
  departmentId: number;
  department: string;
  designation: string;
  status: 'Active' | 'Inactive';
}

export interface EmployeeRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  designation: string;
  dateOfJoining: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  departmentId: number;
}

interface EmployeeResponse extends Omit<EmployeeRequest, 'status' | 'phone'> {
  id: number;
  departmentName?: string | null;
  phone?: string | null;
  status: string;
}

interface PaginatedEmployees {
  content: EmployeeResponse[];
}

const toApiEmployee = (employee: EmployeeResponse): ApiEmployee => ({
  id: String(employee.id),
  employeeCode: employee.employeeCode,
  firstName: employee.firstName,
  lastName: employee.lastName,
  name: `${employee.firstName} ${employee.lastName}`.trim(),
  email: employee.email,
  phone: employee.phone ?? null,
  dateOfJoining: employee.dateOfJoining,
  salary: employee.salary,
  departmentId: employee.departmentId,
  department: employee.departmentName || 'General',
  designation: employee.designation || 'Employee',
  status: employee.status.toLowerCase() === 'active' ? 'Active' : 'Inactive',
});

export const employeeApi = {
  // Fetch all employees
  getEmployees: async (): Promise<ApiEmployee[]> => {
    const response = await axiosInstance.get<PaginatedEmployees>(ENDPOINTS.EMPLOYEES, {
      params: { page: 0, size: 100 },
    });
    return response.data.content.map(toApiEmployee);
  },

  // Fetch single employee by ID
  getEmployeeById: async (id: number | string): Promise<ApiEmployee> => {
    const response = await axiosInstance.get<EmployeeResponse>(ENDPOINTS.EMPLOYEE_BY_ID(id));
    return toApiEmployee(response.data);
  },

  getMyEmployee: async (): Promise<ApiEmployee> => {
    const response = await axiosInstance.get<EmployeeResponse>(`${ENDPOINTS.EMPLOYEES}/me`);
    return toApiEmployee(response.data);
  },

  // Create employee
  createEmployee: async (data: EmployeeRequest | Partial<ApiEmployee>): Promise<ApiEmployee> => {
    const response = await axiosInstance.post<EmployeeResponse>(ENDPOINTS.EMPLOYEES, data);
    return toApiEmployee(response.data);
  },

  // Update employee
  updateEmployee: async (id: number | string, data: EmployeeRequest | Partial<ApiEmployee>): Promise<ApiEmployee> => {
    const response = await axiosInstance.put<EmployeeResponse>(ENDPOINTS.EMPLOYEE_BY_ID(id), data);
    return toApiEmployee(response.data);
  },

  // Delete employee
  deleteEmployee: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.EMPLOYEE_BY_ID(id));
  },
};

export default employeeApi;

