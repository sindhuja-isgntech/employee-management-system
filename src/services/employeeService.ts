import API from '../api/axiosInstance';

import type { Employee as EmployeeRecord,
  PaginatedResponse, 
  CheckInRequest, 
  AttendanceResponse, 
  DashboardSummary 
} from '../types/index';

export type Employee = EmployeeRecord & { name: string; role: string };

export const getEmployees = async (
  page: number = 0, 
  size: number = 10, 
  search: string = ''
): Promise<PaginatedResponse<EmployeeRecord>> => {
  const response = await API.get<PaginatedResponse<EmployeeRecord>>(
    '/api/employees',
    { params: { page, size, search } },
  );
  return response.data;
};

export const employeeService = {
  getAllEmployees: async (): Promise<Employee[]> => {
    const response = await getEmployees(0, 100);
    return response.content.map((employee) => ({
      ...employee,
      name: `${employee.firstName} ${employee.lastName}`,
      role: employee.designation || 'Employee',
    }));
  },
  deleteEmployee: async (id: number): Promise<void> => {
    await API.delete(`/api/employees/${id}`);
  },
};

// Check-In Attendance
export const checkIn = async (employeeId: number): Promise<AttendanceResponse> => {
  const payload: CheckInRequest = { employeeId };
  const response = await API.post<AttendanceResponse>('/attendance/check-in', payload);
  return response.data;
};

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await API.get<DashboardSummary>('/dashboard/summary');
  return response.data;
};