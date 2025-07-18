import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext({
    authed: false,
    setAuthed: (authed: boolean) => {},
    loading: true,
    user: {},
    login: (data: object) => {},
    logout: (config: object) => {},
    register: (config: object) => {},
});

export const AuthProvider = ({ children }) => {
    // Using the useState hook to keep track of the value authed (if a user is logged in)
    const [authed, setAuthed] = useState<boolean>(false);
    // Store new value to indicate the call has not finished. Default to true
    const [loading, setLoading] = useState<boolean>(true);
    // A state that defines user values (email, name, token)
    const [user, setUser] = useState({
        name: null,
        email: null,
        token: null,
    });

    // Set up axios interceptor for 401 responses
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Clear authentication state on 401
                    setAuthed(false);
                    setUser({ name: null, email: null, token: null });
                    
                    // Only redirect if trying to access protected routes
                    const currentPath = window.location.pathname;
                    const protectedRoutes = ['/reservation', '/admin'];
                    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
                    
                    if (isProtectedRoute && currentPath !== '/login') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

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
            const config = { headers: { 'Authorization': 'Bearer ' + user.token }, };
            const activeUser = await initUserAsync(config);
            if (activeUser) {
                console.log(activeUser);
                setAuthed(true);
                setLoading(false);
            }
        } catch (error) {
            console.log('Init user failed:', error);
            setAuthed(false);
            setLoading(false);
        }
    };

    const login = async (data: object): Promise<void> => {
        try {
            const logged_in = await loginAsync(data);
            if (logged_in) {
                console.log(logged_in);
                setAuthed(true);
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const logout = async (config: object): Promise<void> => {
        try {
            const logged_out = await logoutAsync(config);
            if (logged_out) {
                console.log(logged_out);
                setAuthed(false);
                setUser({ name: null, email: null, token: null });
            }
        } catch (error) {
            // Even if logout fails, clear the auth state
            setAuthed(false);
            setUser({ name: null, email: null, token: null });
            if (!user.token) {
                throw new Error('Token not found.');
            } else {
                throw new Error(error);
            }
        }
    };

    const register = async (data: object): Promise<void> => {
        try {
            const registered = await resgisterAsync(data);
            console.log(registered);
        } catch (error) {
            throw new Error(error);
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
                        reject('User not authenticated');
                        return;
                    }

                    if (resp.success === false) {
                        reject(resp.data?.error || 'Authentication failed');
                    } else {
                        console.log(resp);
                        reject('Authentication failed');
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
                setUser(resp.user);
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
                setUser(resp.data);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    var resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data?.error || 'Login failed');
                    } else {
                        console.log(resp);
                        reject('Login failed');
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
                resolve('Logged out');
            });
        });
    };

    const resgisterAsync = async(data: object): Promise<string> => {
        return new Promise((resolve, reject) => {
            axios.post('/api/register', data).then((response) => {
                let resp = response.data;
                setUser(resp.data);
                resolve(resp.message);
            }).catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    let resp = error.response.data;

                    if (resp.success === false) {
                        reject(resp.data[Object.keys(resp.data)[0]][0]);
                    } else {
                        console.log(resp);
                        reject('Registration failed');
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
        <AuthContext.Provider value={{ authed, setAuthed, loading, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// Finally creating the custom hook
export const useAuth = () => useContext(AuthContext);
