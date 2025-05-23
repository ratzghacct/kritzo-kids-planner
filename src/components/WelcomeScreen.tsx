
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WelcomeScreenProps {
  username: string;
  setUsername: (username: string) => void;
  onLogin: () => void;
}

const WelcomeScreen = ({ username, setUsername, onLogin }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-0">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-purple-700">🎯 Kritzo</h1>
            <p className="text-lg text-purple-600 font-medium">The Kids Planner and Rewards App</p>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700 font-medium mb-3">What's your name?</p>
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-xl text-center font-bold rounded-2xl border-2 border-purple-200 focus:border-purple-400 h-14"
                onKeyPress={(e) => e.key === 'Enter' && onLogin()}
              />
            </div>
            
            <Button
              onClick={onLogin}
              disabled={!username.trim()}
              className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg transform transition hover:scale-105"
            >
              Let's Go! 🚀
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
