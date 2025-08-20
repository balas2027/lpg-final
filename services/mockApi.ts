
import { User, Role, Report, ReportStatus, ReportType } from '../types';

// --- MOCK DATABASE ---
// This is a simulation. Data will be reset on page refresh.
// In a real application, this would be a real database.

const initialUsers: User[] = [
    { id: '1', email: 'admin@gas.co', role: Role.ADMIN },
    { id: '2', email: 'user@example.com', role: Role.USER },
];
const users: Record<string, User> = {
    'admin@gas.co': { id: '1', email: 'admin@gas.co', role: Role.ADMIN },
    'user@example.com': { id: '2', email: 'user@example.com', role: Role.USER },
};
const passwords: Record<string, string> = {
    'admin@gas.co': 'admin123',
    'user@example.com': 'user123',
}

const initialReports: Report[] = [
    { id: 'r1', userId: '2', userEmail: 'user@example.com', lat: 34.0522, lng: -118.2437, status: ReportStatus.UNRESOLVED, type: ReportType.GAS, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 'r2', userId: '2', userEmail: 'user@example.com', lat: 34.0560, lng: -118.2500, status: ReportStatus.UNRESOLVED, type: ReportType.FIRE, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 'r3', userId: '2', userEmail: 'user@example.com', lat: 40.7128, lng: -74.0060, status: ReportStatus.RESOLVED, type: ReportType.GAS, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
    { id: 'r4', userId: '2', userEmail: 'user@example.com', lat: 40.7150, lng: -74.0080, status: ReportStatus.UNRESOLVED, type: ReportType.FIRE, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) },
];
let reports: Report[] = [...initialReports];


// --- MOCK API ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export type Credentials = { email: string, password: string};

export const api = {
    login: async ({ email, password }: Credentials): Promise<User> => {
        await simulateDelay(500);
        const user = users[email];
        if (user && passwords[email] === password) {
            return user;
        }
        throw new Error('Invalid email or password');
    },
    
    register: async ({ email, password, role }: Credentials & { role: Role }): Promise<User> => {
        await simulateDelay(500);
        if (users[email]) {
            throw new Error('User already exists');
        }
        const newUser: User = { id: String(Date.now()), email, role };
        users[email] = newUser;
        passwords[email] = password;
        return newUser;
    },

    logout: (): void => {
        // In a real app, this would invalidate a token
    },

    getReports: async (): Promise<Report[]> => {
        await simulateDelay(300);
        return [...reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },

    addReport: async (userId: string, lat: number, lng: number, type: ReportType): Promise<Report> => {
        await simulateDelay(400);
        const user = Object.values(users).find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        const newReport: Report = {
            id: `r${Date.now()}`,
            userId,
            userEmail: user.email,
            lat,
            lng,
            status: ReportStatus.UNRESOLVED,
            type,
            createdAt: new Date(),
        };
        reports.unshift(newReport);
        return newReport;
    },

    updateReportStatus: async (reportId: string, status: ReportStatus): Promise<Report> => {
        await simulateDelay(400);
        const reportIndex = reports.findIndex(r => r.id === reportId);
        if (reportIndex === -1) {
            throw new Error('Report not found');
        }
        reports[reportIndex] = { 
            ...reports[reportIndex], 
            status,
            resolvedAt: status === ReportStatus.RESOLVED ? new Date() : undefined
        };
        return reports[reportIndex];
    }
};