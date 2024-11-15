// import React, { createContext, useContext, useState, useEffect } from 'react';

// interface User {
//   role: 'ADMIN' | 'COLLECTOR';
//   area?: string;
// }

// interface LoginResponse {
//   success: boolean;
//   data?: {
//     accessToken: string;
//     role: User['role'];
//     area?: string;
//   };
//   error?: {
//     code: string;
//     message: string;
//   };
// }

// interface AuthContextType {
//   user: User | null;
//   accessToken: string | null;
//   login: (credentials: { username: string; password: string }) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   error: string | null;
// }

// interface LoginCredentials {
//   username: string;
//   password: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const TOKEN_KEY = 'auth_token';
// const USER_KEY = 'auth_user';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const savedUser = localStorage.getItem(USER_KEY);
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const [accessToken, setAccessToken] = useState<string | null>(() => {
//     return localStorage.getItem(TOKEN_KEY);
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem(TOKEN_KEY);
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const response = await fetch('/api/auth/verify', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Invalid token');
//       }

//       const userData = await response.json();
//       setUser({
//         role: userData.data.role,
//         area: userData.data.area
//       });
//       setAccessToken(token);
//     } catch (err) {
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (credentials: LoginCredentials) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });

//       const data: LoginResponse = await response.json();

//       if (!data.success || !data.data) {
//         throw new Error(data.error?.message || '로그인에 실패했습니다.');
//       }

//       const { accessToken, role, area } = data.data;

//       const userData: User = {
//         role,
//         ...(area && { area })
//       };

//       localStorage.setItem(TOKEN_KEY, accessToken);
//       localStorage.setItem(USER_KEY, JSON.stringify(userData));

//       setAccessToken(accessToken);
//       setUser(userData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       if (accessToken) {
//         await fetch('/api/auth/logout', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Logout error:', err);
//     } finally {
//       localStorage.removeItem(TOKEN_KEY);
//       localStorage.removeItem(USER_KEY);
//       setAccessToken(null);
//       setUser(null);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     accessToken,
//     login,
//     logout,
//     loading,
//     error,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Custom hook for protecting routes
// export const useRequireAuth = (allowedRoles?: User['role'][]) => {
//   const auth = useAuth();
//   const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     if (!auth.loading) {
//       if (!auth.user) {
//         window.location.href = '/login';
//       } else if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
//         window.location.href = '/unauthorized';
//       } else {
//         setIsAuthorized(true);
//       }
//     }
//   }, [auth.loading, auth.user, allowedRoles]);

//   return {
//     isAuthorized,
//     user: auth.user,
//     loading: auth.loading
//   };
// };

// export default AuthContext;
