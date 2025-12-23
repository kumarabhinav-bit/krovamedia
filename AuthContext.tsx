import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  buyCourse: (courseId: string) => Promise<void>;
  hasAccess: (courseId: string) => boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  markLessonComplete: (lessonId: string) => void;
  // Admin Functions
  getAllUsers: () => User[];
  adminAddUser: (user: Omit<User, 'id' | 'purchasedCourseIds' | 'completedLessonIds'>) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from session storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('krova_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Helper to get all users from storage (simulating DB)
  const getUsersDB = (): User[] => {
    const db = localStorage.getItem('krova_users_db');
    return db ? JSON.parse(db) : [];
  };

  const saveUsersDB = (users: User[]) => {
    localStorage.setItem('krova_users_db', JSON.stringify(users));
  };

  const updateUserInDB = (updatedUser: User) => {
    const users = getUsersDB();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
        users[idx] = updatedUser;
        saveUsersDB(users);
        setUser(updatedUser);
        localStorage.setItem('krova_current_user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const users = getUsersDB();
        const found = users.find(u => u.email === email && u.password === pass);
        if (found) {
          // Ensure new fields exist for legacy users
          if (!found.completedLessonIds) found.completedLessonIds = [];
          
          setUser(found);
          localStorage.setItem('krova_current_user', JSON.stringify(found));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 800);
    });
  };

  const signup = async (name: string, email: string, pass: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const users = getUsersDB();
        if (users.find(u => u.email === email)) {
          reject(new Error("Email already exists"));
          return;
        }
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          password: pass,
          purchasedCourseIds: [],
          completedLessonIds: []
        };
        users.push(newUser);
        saveUsersDB(users);
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krova_current_user');
  };

  const buyCourse = async (courseId: string) => {
    if (!user) return;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const updatedUser = { 
            ...user, 
            purchasedCourseIds: [...user.purchasedCourseIds, courseId] 
        };
        updateUserInDB(updatedUser);
        resolve();
      }, 1000); 
    });
  };

  const hasAccess = (courseId: string) => {
    if (!user) return false;
    return user.purchasedCourseIds.includes(courseId);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const updatedUser = { ...user, ...data };
            updateUserInDB(updatedUser);
            resolve();
        }, 500);
    });
  };

  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user) return;
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (user.password !== currentPass) {
                reject(new Error("Current password is incorrect"));
                return;
            }
            const updatedUser = { ...user, password: newPass };
            updateUserInDB(updatedUser);
            resolve();
        }, 800);
    });
  };

  const markLessonComplete = (lessonId: string) => {
      if (!user) return;
      if (user.completedLessonIds.includes(lessonId)) return;

      const updatedUser = {
          ...user,
          completedLessonIds: [...(user.completedLessonIds || []), lessonId]
      };
      updateUserInDB(updatedUser);
  };

  // --- Admin Functions ---

  const getAllUsers = () => {
      return getUsersDB();
  };

  const adminAddUser = async (userData: Omit<User, 'id' | 'purchasedCourseIds' | 'completedLessonIds'>) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            const users = getUsersDB();
            if (users.find(u => u.email === userData.email)) {
                reject(new Error("Email already exists"));
                return;
            }
            const newUser: User = {
                id: Date.now().toString(),
                ...userData,
                purchasedCourseIds: [],
                completedLessonIds: []
            };
            users.push(newUser);
            saveUsersDB(users);
            resolve();
        }, 500);
      });
  };

  const adminDeleteUser = async (userId: string) => {
      return new Promise<void>((resolve) => {
          const users = getUsersDB().filter(u => u.id !== userId);
          saveUsersDB(users);
          resolve();
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, buyCourse, hasAccess, updateProfile, changePassword, markLessonComplete, getAllUsers, adminAddUser, adminDeleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};