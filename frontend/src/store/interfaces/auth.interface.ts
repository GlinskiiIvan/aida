export interface AuthRequest {
    email: string,
    password: string
}

export interface User {
    id: number,
    email: string,
    banned: boolean,
    roles: {
        id: number,
        value: string,
    }[],
}

export interface AuthResponse {
    user: User;
    access_token: string;
}