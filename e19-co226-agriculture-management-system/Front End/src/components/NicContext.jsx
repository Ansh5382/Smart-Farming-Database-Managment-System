import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const NicContext = createContext();

const STORAGE_KEYS = {
    token: 'cropmasterToken',
};

const API_BASE_URL = 'http://localhost:8080';

export function useNic() {
    return useContext(NicContext);
}

export function NicProvider({ children }) {
    const [authState, setAuthState] = useState({
        nic: '',
        role: '',
        token: localStorage.getItem(STORAGE_KEYS.token) || '',
        isLoading: true,
    });

    // Handle token persistence
    useEffect(() => {
        if (authState.token) {
            localStorage.setItem(STORAGE_KEYS.token, authState.token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.token);
        }
    }, [authState.token]);

    // Fetch profile if token exists
    useEffect(() => {
        const fetchProfile = async () => {
            if (!authState.token) {
                setAuthState(prev => ({ ...prev, nic: '', role: '', isLoading: false }));
                return;
            }

            try {
                // Try farmer profile first
                let response = await fetch(`${API_BASE_URL}/farmer/profile`);
                let data;
                
                if (response.ok) {
                    data = await response.json();
                    setAuthState(prev => ({ ...prev, nic: data.nic, role: 'farmer', isLoading: false }));
                    return;
                }

                // Try owner profile if farmer failed
                response = await fetch(`${API_BASE_URL}/owner/profile`);
                if (response.ok) {
                    data = await response.json();
                    setAuthState(prev => ({ ...prev, nic: data.nic, role: 'owner', isLoading: false }));
                    return;
                }

                // If both fail, token is likely invalid
                setAuthState({ nic: '', role: '', token: '', isLoading: false });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setAuthState(prev => ({ ...prev, isLoading: false }));
            }
        };

        fetchProfile();
    }, [authState.token]);

    useEffect(() => {
        const originalFetch = window.fetch.bind(window);

        window.fetch = async (input, init = {}) => {
            const requestUrl = typeof input === 'string' ? input : input?.url || '';
            const isBackendRequest = requestUrl.startsWith(API_BASE_URL);

            if (!isBackendRequest || !authState.token) {
                return originalFetch(input, init);
            }

            const headers = new Headers(
                init.headers || (input instanceof Request ? input.headers : undefined)
            );
            
            // Add Authorization header if not present
            if (!headers.has('Authorization')) {
                headers.set('Authorization', `Bearer ${authState.token}`);
            }

            const response = input instanceof Request
                ? await originalFetch(new Request(input, { headers }))
                : await originalFetch(input, { ...init, headers });

            if (response.status === 401) {
                // Only clear if it's not a login attempt
                if (!requestUrl.includes('/login')) {
                    setAuthState({ nic: '', role: '', token: '', isLoading: false });
                    if (window.location.pathname !== '/') {
                        window.location.assign('/');
                    }
                }
            }

            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [authState.token]);

    const setSession = (session) => {
        setAuthState({
            nic: session?.nic || '',
            role: session?.role || '',
            token: session?.token || '',
            isLoading: false,
        });
    };

    const clearNic = () => {
        setAuthState({ nic: '', role: '', token: '', isLoading: false });
    };

    const value = useMemo(() => ({
        nic: authState.nic,
        role: authState.role,
        token: authState.token,
        isLoading: authState.isLoading,
        isAuthenticated: Boolean(authState.token && authState.nic),
        setSession,
        clearNic,
    }), [authState]);

    return (
        <NicContext.Provider value={value}>
            {children}
        </NicContext.Provider>
    );
}
