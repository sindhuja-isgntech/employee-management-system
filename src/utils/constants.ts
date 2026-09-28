import type { Employee } from '@/types/employee';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: '1024',
    name: 'Sarah Chen',
    dept: 'Engineering',
    role: 'Developer',
    designation: 'Senior Frontend Developer',
    email: 'sarah.chen@company.com',
    status: 'Active',
    avatarUrl: 'https://via.placeholder.com/48',
  },
  {
    id: '1025',
    name: 'Marcus Vance',
    dept: 'Marketing',
    role: 'SEO specialist',
    designation: 'SEO Specialist',
    email: 'marcus.vance@company.com',
    status: 'Inactive',
    avatarUrl: 'https://via.placeholder.com/48',
  },
  {
    id: '1026',
    name: 'Elena Rostova',
    dept: 'Human Resources',
    role: 'Human Resources',
    designation: 'HR Generalist',
    email: 'elena.rostova@company.com',
    status: 'Active',
    avatarUrl: 'https://via.placeholder.com/48',
  },
];