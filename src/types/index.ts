export type role =
  | 'ADMIN'
  | 'HR'
  | 'EMPLOYEE'
  | 'ROLE_ADMIN'
  | 'ROLE_HR'
  | 'ROLE_EMPLOYEE'
  | 'Admin'
  | 'Employee';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  roles: role[];
  user: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  roles: role[];
}

export interface Employee {
    id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  dateOfJoining: string;
  salary: number;
  status: 'ACTIVE' | 'INACTIVE';
  departmentId?: number;
}

export interface PaginatedResponse<T> {
    content : T[];
    totalElements : number;
    totalPages : number;
    size : number;
    number : number;
}

export interface CheckInRequest {
  employeeId: number;
}


export interface AttendanceResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  attendanceDate: string;
  checkIn: string;
  checkOut?: string;
  workingHours?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY';
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  employeesOnLeave: number;
  presentToday: number;
}