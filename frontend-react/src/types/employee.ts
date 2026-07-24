// src/types/employee.ts
export type EmployeeStatus = 'Active' | 'Inactive';

export interface Employee {
  id: string;
  name: string;
  dept: string;
  role: string;
  status: EmployeeStatus;
  avatarUrl?: string;
  email:string;
  designation:string;
}