import React from 'react';
import { useAuth } from 'contexts/auth.context';
import { useNavigate } from 'react-router-dom';

function Logout(): React.ReactElement | null {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // AuthApi.Logout(user).then((response: any) => {
  setUser(null);
  localStorage.removeItem('user');
  navigate('/auth/sign-in/default');
  
  // You can render UI elements or return null if not needed
  return null;
}

export default Logout;
