import API from '@/api/axiosInstance';

export interface DepartmentRecord {
  id: number;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export type DepartmentRequest = Pick<DepartmentRecord, 'name' | 'description' | 'status'>;

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
  const response = await API.get<DepartmentRecord[]>('/api/departments');
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
): Promise<AttendanceRecord[]> => {
  const response = await API.get<AttendanceRecord[]>(
    isManager ? '/attendance' : '/attendance/my',
    { params: isManager && date ? { date } : undefined },
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

export const getLeaves = async (isManager: boolean): Promise<LeaveRecord[]> => {
  const response = await API.get<LeaveRecord[]>(isManager ? '/leaves' : '/leaves/my');
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