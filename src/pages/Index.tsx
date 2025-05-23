
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WelcomeScreen from '@/components/WelcomeScreen';
import MainApp from '@/components/MainApp';

const Index = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return <WelcomeScreen username={username} setUsername={setUsername} onLogin={handleLogin} />;
  }

  return <MainApp username={username} />;
};

export default Index;
