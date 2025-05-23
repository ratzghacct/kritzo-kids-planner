import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WelcomeScreen from '@/components/WelcomeScreen';
import MainApp from '@/components/MainApp';

const Index = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user was already logged in
    const savedUsername = localStorage.getItem('username');
    const loginState = localStorage.getItem('isLoggedIn');
    
    if (savedUsername && loginState === 'true') {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
      localStorage.setItem('username', username.trim());
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.setItem('isLoggedIn', 'false');
    // Keep the username in storage for convenience
  };

  if (!isLoggedIn) {
    return <WelcomeScreen username={username} setUsername={setUsername} onLogin={handleLogin} />;
  }

  return <MainApp username={username} onLogout={handleLogout} />;
};

export default Index;
