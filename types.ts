
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    email: string;
    role: Role;
}

export enum ReportStatus {
    UNRESOLVED = 'UNRESOLVED',
    RESOLVED = 'RESOLVED'
}

export enum ReportType {
    GAS = 'GAS',
    FIRE = 'FIRE'
}

export interface Report {
    id: string;
    userId: string;
    userEmail: string;
    lat: number;
    lng: number;
    status: ReportStatus;
    type: ReportType;
    createdAt: Date;
    resolvedAt?: Date;
}

export type LatLngExpression = [number, number];