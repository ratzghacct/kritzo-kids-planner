
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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-premium rounded-2xl border-0 animate-bounce-in">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary">Kritzo</h1>
            <p className="text-lg text-accent-foreground font-medium">The Kids Planner and Rewards App</p>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-foreground font-medium mb-3">What's your name?</p>
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-xl text-center font-bold rounded-2xl border-2 border-secondary/30 focus:border-secondary h-14"
                onKeyPress={(e) => e.key === 'Enter' && username.trim() && onLogin()}
              />
            </div>
            
            <Button
              onClick={onLogin}
              disabled={!username.trim()}
              className="w-full h-14 text-xl font-bold rounded-2xl bg-gradient-premium hover:opacity-90 text-white shadow-kid-friendly transform transition hover:-translate-y-1"
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
