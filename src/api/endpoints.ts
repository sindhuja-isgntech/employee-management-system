// src/api/endpoints.ts
export const ENDPOINTS = {
  EMPLOYEES: '/api/employees',
  EMPLOYEE_BY_ID: (id: number | string) => `/api/employees/${id}`,
};