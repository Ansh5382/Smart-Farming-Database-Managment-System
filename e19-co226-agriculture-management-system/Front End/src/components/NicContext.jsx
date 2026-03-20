import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const NicContext = createContext();

const STORAGE_KEYS = {
    nic: 'cropmasterNic',
    role: 'cropmasterRole',
};

export function useNic() {
    return useContext(NicContext);
}

export function NicProvider({ children }) {
    const [authState, setAuthState] = useState({
        nic: localStorage.getItem(STORAGE_KEYS.nic) || '',
        role: localStorage.getItem(STORAGE_KEYS.role) || '',
        isLoading: false,
    });

    // Persist simple NIC-based session locally.
    useEffect(() => {
        if (authState.nic) {
            localStorage.setItem(STORAGE_KEYS.nic, authState.nic);
        } else {
            localStorage.removeItem(STORAGE_KEYS.nic);
        }

        if (authState.role) {
            localStorage.setItem(STORAGE_KEYS.role, authState.role);
        } else {
            localStorage.removeItem(STORAGE_KEYS.role);
        }
    }, [authState.nic, authState.role]);

    const setSession = (session) => {
        setAuthState({
            nic: session?.nic || '',
            role: session?.role || '',
            isLoading: false,
        });
    };

    const clearNic = () => {
        setAuthState({ nic: '', role: '', isLoading: false });
    };

    const value = useMemo(() => ({
        nic: authState.nic,
        role: authState.role,
        isLoading: authState.isLoading,
        isAuthenticated: Boolean(authState.nic && authState.role),
        setSession,
        clearNic,
    }), [authState]);

    return (
        <NicContext.Provider value={value}>
            {children}
        </NicContext.Provider>
    );
}
