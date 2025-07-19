import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from "react";

// TypeScript interfaces
interface User {
    name: string | null;
    email: string | null;
    token: string | null;
    firstname?: string | null;
    lastname?: string | null;
    is_admin?: boolean;
    role?: string;
}

interface AuthContextType {
    authed: boolean;
    setAuthed: (authed: boolean) => void;
    loading: boolean;
    user: User;
    isAdmin: boolean;
    login: (data: object) => Promise<void>;
    logout: (config: object) => Promise<void>;
    register: (config: object) => Promise<void>;
}

// Helper function to create full name from firstname and lastname
const createFullName = (user: User): string => {
    if (user.name) {
        return user.name;
    }
    
    const firstname = user.firstname || '';
    const lastname = user.lastname || '';
    
    if (firstname && lastname) {
        return `${firstname} ${lastname}`;
    } else if (firstname) {
        return firstname;
    } else if (lastname) {
        return lastname;
    }
    
    return 'Utilisateur';
};

// Create the context
const AuthContext = createContext<AuthContextType>({
    authed: false,
    setAuthed: (authed: boolean) => {},
    loading: true,
    user: {
        name: null,
        email: null,
        token: null,
    },
    isAdmin: false,
    login: (data: object) => Promise.resolve(),
    logout: (config: object) => Promise.resolve(),
    register: (config: object) => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // Using the useState hook to keep track of the value authed (if a user is logged in)
    const [authed, setAuthed] = useState<boolean>(false);
    // Store new value to indicate the call has not finished. Default to true
    const [loading, setLoading] = useState<boolean>(true);
    // A state that defines user values (email, name, token)
    const [user, setUser] = useState<User>({
        name: null,
        email: null,
        token: null,
    });
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Set up axios interceptor for 401 responses
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Clear authentication state on 401
                    setAuthed(false);
                    setUser({ name: null, email: null, token: null });
                    setIsAdmin(false);
                    
                    // Clear stored token
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    
                    // Clear axios default header
                    delete axios.defaults.headers.common['Authorization'];
                    
                    // Don't use window.location.href - let React Router handle navigation
                    // The ProtectedRoutes component will handle the redirect
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    // Listen for storage changes (logout from other tabs)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && e.newValue === null) {
                // Token was removed from another tab, logout here too
                console.log('Token removed from another tab, logging out');
                setAuthed(false);
                setUser({ name: null, email: null, token: null });
                setIsAdmin(false);
                delete axios.defaults.headers.common['Authorization'];
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // More frequent authentication check (every 30 seconds)
    useEffect(() => {
        if (authed) {
            const interval = setInterval(async () => {
                try {
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (!token) {
                        // No token found, clear auth state
                        console.log('No token found during periodic check, logging out');
                        setAuthed(false);
                        setUser({ name: null, email: null, token: null });
                        setIsAdmin(false);
                        delete axios.defaults.headers.common['Authorization'];
                        return;
                    }

                    // Verify token is still valid
                    const config = { headers: { 'Authorization': 'Bearer ' + token } };
                    await axios.get('/api/me', config);
                } catch (error) {
                    // Token is invalid or expired, clear auth state
                    console.log('Periodic auth check failed:', error);
                    setAuthed(false);
                    setUser({ name: null, email: null, token: null });
                    setIsAdmin(false);
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }, 30 * 1000); // Check every 30 seconds instead of 5 minutes

            return () => clearInterval(interval);
        }
    }, [authed]);

    // Runs once when the component first mounts
    useEffect(() => { loginCheck(); }, []);

    /* ** Async Promises functions ** */
    const loginCheck = async (): Promise<void> => {
        try {
            const logged = await loginCheckAsync();
            if (logged) {
                console.log(logged);
                await initUser();
            }
        } catch (error) {
            console.log('Login check failed:', error);
            setAuthed(false);
            setLoading(false);
        }
    };

    const initUser = async (): Promise<void> => {
        try {
            // Get token from localStorage or sessionStorage
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                console.log('No token found, user not authenticated');
                setAuthed(false);
                setLoading(false);
                return;
            }

            // Set up axios default authorization header
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            
            const config = { headers: { 'Authorization': 'Bearer ' + token }, };
            const activeUser = await initUserAsync(config);
            if (activeUser) {
                console.log(activeUser);
                setAuthed(true);
                setLoading(false);
            }
        } catch (error) {
            console.log('Init user failed:', error);
            setAuthed(false);
            setUser({ name: null, email: null, token: null });
            setIsAdmin(false);
            // Clear invalid token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            // Clear axios default header
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    };

    const login = async (data: object): Promise<void> => {
        try {
            const logged_in = await loginAsync(data);
            if (logged_in) {
                console.log(logged_in);
                setAuthed(true);
                // Store token for future use
                if (user.token) {
                    localStorage.setItem('token', user.token);
                    // Set up axios default authorization header
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                }
            }
        } catch (error) {
            throw new Error(error as string);
        }
    };

    const logout = async (config: object): Promise<void> => {
        try {
            const logged_out = await logoutAsync(config);
            if (logged_out) {
                console.log(logged_out);
                setAuthed(false);
                setUser({ name: null, email: null, token: null });
                setIsAdmin(false);
                // Clear stored token
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                // Clear axios default header
                delete axios.defaults.headers.common['Authorization'];
                
                // Trigger storage event for other tabs
                const oldToken = (config as any)?.headers?.Authorization?.replace('Bearer ', '') || null;
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'token',
                    newValue: null,
                    oldValue: oldToken
                }));
            }
        } catch (error) {
            // Even if logout fails, clear the auth state
            console.log('Logout failed, clearing auth state anyway:', error);
            setAuthed(false);
            setUser({ name: null, email: null, token: null });
            setIsAdmin(false);
            // Clear stored token
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            // Clear axios default header
            delete axios.defaults.headers.common['Authorization'];
            
            // Trigger storage event for other tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'token',
                newValue: null,
                oldValue: null
            }));
            
            if (!user.token) {
                throw new Error('Token non trouvé.');
            } else {
                throw new Error(error as string);
            }
        }
    };

    const register = async (data: object): Promise<void> => {
        try {
            const registered = await resgisterAsync(data);
            console.log(registered);
        } catch (error) {
            throw new Error(error as string);
        }
    };

    /* ** Async API calls functions ** */

    // Check if user is authenticated
    const loginCheckAsync = async (): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.get('/api/authenticated').then((response) => {
                let resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    var resp = error.response.data;
                    
                    // Handle 401 Unauthorized specifically
                    if (error.response.status === 401) {
                        console.log('User not authenticated (401)');
                        reject('Utilisateur non authentifié');
                        return;
                    }

                    if (resp.success === false) {
                        reject(resp.data?.error || 'Échec de l\'authentification');
                    } else {
                        console.log(resp);
                        reject('Échec de l\'authentification');
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    const initUserAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.get('/api/me', config).then((response) => {
                let resp = response.data;
                const userData = resp.user;
                
                // Create full name if not available
                if (!userData.name && (userData.firstname || userData.lastname)) {
                    userData.name = createFullName(userData);
                }
                
                // Add token to user data from localStorage/sessionStorage
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (token) {
                    userData.token = token;
                }
                
                console.log('Init user response userData:', userData);
                setUser(userData);
                // Set admin status based on user data
                const adminStatus = userData.is_admin || userData.role === 'admin' || userData.role === 'super_admin';
                console.log('Setting admin status from init:', adminStatus, 'based on:', { is_admin: userData.is_admin, role: userData.role });
                setIsAdmin(adminStatus);
                resolve(resp.message);
            }).catch((error) => {
                console.log('Init user error:', error);
                reject(error);
            });
        });
    };

    // Login API call
    const loginAsync = async (data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/login', data).then((response) => {
                let resp = response.data;
                const userData = resp.data;
                
                // Create full name if not available
                if (!userData.name && (userData.firstname || userData.lastname)) {
                    userData.name = createFullName(userData);
                }
                
                console.log('Login response userData:', userData);
                setUser(userData);
                // Store token for future requests
                if (userData.token) {
                    localStorage.setItem('token', userData.token);
                }
                // Set admin status based on user data
                const adminStatus = userData.is_admin || userData.role === 'admin' || userData.role === 'super_admin';
                console.log('Setting admin status:', adminStatus, 'based on:', { is_admin: userData.is_admin, role: userData.role });
                setIsAdmin(adminStatus);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    var resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data?.error || 'Échec de la connexion');
                    } else {
                        console.log(resp);
                        reject('Échec de la connexion');
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    // Logout API call
    const logoutAsync = async (config: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/logout', config).then((response) => {
                let resp = response.data;
                resolve(resp.message);
            }).catch((error) => {
                console.log('Logout error:', error);
                // Don't reject on logout errors, just resolve
                resolve('Déconnecté');
            });
        });
    };

    const resgisterAsync = async(data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/register', data).then((response) => {
                let resp = response.data;
                const userData = resp.data;
                
                // Create full name if not available
                if (!userData.name && (userData.firstname || userData.lastname)) {
                    userData.name = createFullName(userData);
                }
                
                setUser(userData);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    let resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                        reject('Échec de l\'inscription');
                    }
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(error.message);
                }
            });
        });
    };

    return (
        // Using the provider so that ANY component in our application can use the values that we are sending.
        <AuthContext.Provider value={{ authed, setAuthed, loading, user, isAdmin, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// Finally creating the custom hook
export const useAuth = () => useContext(AuthContext);
