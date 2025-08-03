// Declare module for useAuth hook with named exports
declare module './hooks/useAuth.jsx' {
    import { ReactNode } from 'react';

    export interface AuthContextType {
        user: any;
        loading: boolean;
        signInWithGoogle: () => Promise<void>;
        signOutUser: () => Promise<void>;
        isAuthenticated: boolean;
    }

    export const useAuth: () => AuthContextType;
    export const AuthProvider: React.ComponentType<{ children: ReactNode }>;
}

// Generic JSX module declaration (for default exports)
declare module '*.jsx' {
    import React from 'react';
    const Component: React.ComponentType<any>;
    export default Component;
} 