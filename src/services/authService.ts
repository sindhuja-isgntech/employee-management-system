import API from '../api/axiosInstance';
import type { AuthenticatedUser, LoginCredentials, AuthResponse, role } from '../types/index';

export interface CreateLoginRequest {
    name: string;
    email: string;
    password: string;
    roles: Array<'EMPLOYEE' | 'HR'>;
}

export const createLoginAccount = async (account: CreateLoginRequest): Promise<string> => {
    const response = await API.post<string>('/api/auth/register', account);
    return response.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await API.post<Omit<AuthResponse, 'user'>>('/api/auth/login', credentials);
    if (!response.data.token) {
        throw new Error('The authentication service did not return a token.');
    }

    localStorage.setItem('jwt_token', response.data.token);
    localStorage.setItem('user_roles', JSON.stringify(response.data.roles));
    try {
        const user = await getCurrentUser();
        return { ...response.data, user };
    } catch (error) {
        logOutUser();
        throw error;
    }
};

export const getCurrentUser = async (): Promise<AuthenticatedUser> => {
    const response = await API.get<AuthenticatedUser>('/api/auth/me');
    localStorage.setItem('user_profile', JSON.stringify(response.data));
    localStorage.setItem('user_roles', JSON.stringify(response.data.roles));
    return response.data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await API.put('/api/auth/change-password', { currentPassword, newPassword });
};

export const requestPasswordReset = async (email: string): Promise<void> => {
    await API.post('/api/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    await API.post('/api/auth/reset-password', { token, newPassword });
};

export const getStoredRoles = (): role[] => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem('user_roles') || '[]');
        return Array.isArray(parsed)
            ? parsed.filter((value): value is role => typeof value === 'string')
            : [];
    } catch {
        return [];
    }
};

export const getStoredUser = (): AuthenticatedUser | null => {
    try {
        const parsed: unknown = JSON.parse(localStorage.getItem('user_profile') || 'null');
        if (typeof parsed === 'object' && parsed !== null && 'email' in parsed && 'name' in parsed) {
            return parsed as AuthenticatedUser;
        }
    } catch {
        return null;
    }
    return null;
};

export const hasAnyRole = (userRoles: string[], allowedRoles: string[]): boolean => {
    const normalize = (value: string) => value.replace(/^ROLE_/i, '').toUpperCase();
    const normalizedRoles = new Set(userRoles.map(normalize));
    return allowedRoles.some((roleName) => normalizedRoles.has(normalize(roleName)));
};

export const logOutUser = (): void => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('user_profile');
}