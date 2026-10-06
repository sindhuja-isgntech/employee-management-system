import API from '@/api/axiosInstance';
import type { PaginatedResponse } from '@/types';

export interface DepartmentRecord {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export type DepartmentRequest = Pick<DepartmentRecord, 'name' | 'description' | 'status'>;

export interface DepartmentSummary {
  total: number;
  active: number;
  inactive: number;
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number | null;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
}

export interface LeaveRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'SICK' | 'CASUAL' | 'EARNED';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  rejectionReason?: string | null;
  approvedByName?: string | null;
  createdAt?: string;
}

export type LeaveApplication = Pick<LeaveRecord, 'leaveType' | 'startDate' | 'endDate' | 'reason'>;

export const getDepartments = async (): Promise<DepartmentRecord[]> => {
  const response = await API.get<PaginatedResponse<DepartmentRecord>>('/api/departments', {
    params: { page: 0, size: 1000 },
  });
  return response.data.content;
};

export const getDepartmentsPage = async (
  page: number,
  size: number,
  search: string,
  status?: DepartmentRecord['status'],
): Promise<PaginatedResponse<DepartmentRecord>> => {
  const response = await API.get<PaginatedResponse<DepartmentRecord>>('/api/departments', {
    params: { page, size, search, status },
  });
  return response.data;
};

export const getDepartmentSummary = async (): Promise<DepartmentSummary> => {
  const response = await API.get<DepartmentSummary>('/api/departments/summary');
  return response.data;
};

export const createDepartment = async (department: DepartmentRequest): Promise<DepartmentRecord> => {
  const response = await API.post<DepartmentRecord>('/api/departments', department);
  return response.data;
};

export const updateDepartment = async (
  id: number,
  department: DepartmentRequest,
): Promise<DepartmentRecord> => {
  const response = await API.put<DepartmentRecord>(`/api/departments/${id}`, department);
  return response.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await API.delete(`/api/departments/${id}`);
};

export const getAttendance = async (
  isManager: boolean,
  date?: string,
  page = 0,
  size = 10,
): Promise<PaginatedResponse<AttendanceRecord>> => {
  const response = await API.get<PaginatedResponse<AttendanceRecord>>(
    isManager ? '/attendance' : '/attendance/my',
    { params: { ...(isManager && date ? { date } : {}), page, size } },
  );
  return response.data;
};

export const checkInToAttendance = async (): Promise<AttendanceRecord> => {
  const response = await API.post<AttendanceRecord>('/attendance/check-in');
  return response.data;
};

export const checkOutFromAttendance = async (): Promise<AttendanceRecord> => {
  const response = await API.put<AttendanceRecord>('/attendance/check-out');
  return response.data;
};

export const getLeaves = async (
  isManager: boolean,
  page = 0,
  size = 10,
  search = '',
): Promise<PaginatedResponse<LeaveRecord>> => {
  const response = await API.get<PaginatedResponse<LeaveRecord>>(isManager ? '/leaves' : '/leaves/my', {
    params: { page, size, search },
  });
  return response.data;
};

export const applyForLeave = async (application: LeaveApplication): Promise<LeaveRecord> => {
  const response = await API.post<LeaveRecord>('/leaves', application);
  return response.data;
};

export const approveLeave = async (id: number): Promise<LeaveRecord> => {
  const response = await API.put<LeaveRecord>(`/leaves/${id}/approve`);
  return response.data;
};

export const rejectLeave = async (id: number, rejectionReason?: string): Promise<LeaveRecord> => {
  const response = await API.put<LeaveRecord>(`/leaves/${id}/reject`, { rejectionReason });
  return response.data;
};