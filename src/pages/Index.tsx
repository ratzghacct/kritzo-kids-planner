
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
    if (savedUsername) {
      setUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
      localStorage.setItem('username', username.trim());
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    // Don't remove the username from storage to prevent full reset
    // This allows the app to remember the user when they return
  };

  if (!isLoggedIn) {
    return <WelcomeScreen username={username} setUsername={setUsername} onLogin={handleLogin} />;
  }

  return <MainApp username={username} onLogout={handleLogout} />;
};

export default Index;
