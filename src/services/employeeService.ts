import api from './api';

export interface Employee {
  id?: number;
  name: string;
  email: string;
  dept: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Onboarding';
  phone?: string;
}

export const employeeService = {
  // GET all employees
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  },

  // GET employee by ID
  getEmployeeById: async (id: number): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  },

  // POST create new employee
  createEmployee: async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await api.post<Employee>('/employees', employeeData);
    return response.data;
  },

  // PUT update employee
  updateEmployee: async (id: number, employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.put<Employee>(`/employees/${id}`, employeeData);
    return response.data;
  },

  // DELETE employee
  deleteEmployee: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};