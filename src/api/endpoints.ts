// src/api/endpoints.ts
export const ENDPOINTS = {
  EMPLOYEES: '/users', // Maps to mock endpoint https://jsonplaceholder.typicode.com/users
  EMPLOYEE_BY_ID: (id: number | string) => `/users/${id}`,
};