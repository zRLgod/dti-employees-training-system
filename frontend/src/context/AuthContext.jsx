import { useState, createContext, useContext, useEffect } from 'react';
import { is_authenticated, user_profile, login, logout, update_user } from '../endpoints/api';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const get_authenticated = async () => {
    try {
      const success = await is_authenticated();
      setIsAuthenticated(success);
      if (success) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.success && parsedUser.user ? parsedUser.user : parsedUser);
        } else {
          const data = await user_profile();
          setUser(data.success && data.user ? data.user : data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

const login_user = async (username, password) => {
  try {
    const response = await login(username, password);
    if (response && response.success) {
      setIsAuthenticated(true);
      const data = await user_profile();
      const finalUser = data.success && data.user ? data.user : data;
      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
      return { success: true, user: finalUser }; 
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
      return { success: false };
    }
  } catch (error) {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
    return { success: false };
  }
};

  const logout_user = async () => {
    try {
      await logout();
    } catch (error) {
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  
  const updateUser = async (updatedData) => {
    if (!user || !user.id) {
      throw new Error("No user is currently logged in.");
    }
    try {
      
      const dataToSend = { ...updatedData };
      if (dataToSend.password === "") {
        delete dataToSend.password;
      }
      
      dataToSend.username = user.username;
      dataToSend.department = user.department;
      const updatedUser = await update_user(user.id, dataToSend);
      
      if (updatedUser.success && updatedUser.user) {
        setUser(updatedUser.user);
        localStorage.setItem('user', JSON.stringify(updatedUser.user));
      } else {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return updatedUser;
    } catch (error) {
      if (error.response) {
        console.error("Error updating user response data:");
      } else {
        console.error("Error updating user:", error);
      }
      throw error;
    }
  };

  useEffect(() => {
    get_authenticated();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login_user, logout_user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
