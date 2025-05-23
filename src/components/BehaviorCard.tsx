
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Behavior {
  name: string;
  points: number;
  icon: string;
  type: 'positive' | 'negative';
}

interface BehaviorCardProps {
  behavior: Behavior;
  onAdjustPoints: (points: number) => void;
  onRequestParentAccess: (action: string) => void;
}

const BehaviorCard = ({ behavior, onAdjustPoints, onRequestParentAccess }: BehaviorCardProps) => {
  const handleClick = () => {
    onRequestParentAccess(`adjust-points-${behavior.name}`);
    // For demo purposes, we'll adjust points immediately
    // In a real app, this would happen after parent code verification
    setTimeout(() => onAdjustPoints(behavior.points), 100);
  };

  return (
    <Card className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
      behavior.type === 'positive' 
        ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:border-green-300' 
        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300'
    }`}>
      <Button
        onClick={handleClick}
        className="w-full h-auto p-0 bg-transparent hover:bg-transparent text-left"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{behavior.icon}</div>
            <div>
              <div className={`font-bold text-lg ${
                behavior.type === 'positive' ? 'text-green-700' : 'text-red-700'
              }`}>
                {behavior.name}
              </div>
              <div className={`text-sm font-medium ${
                behavior.type === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {behavior.points > 0 ? '+' : ''}{behavior.points} points
              </div>
            </div>
          </div>
          
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
            behavior.type === 'positive'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {behavior.type === 'positive' ? '+' : '-'}
          </div>
        </div>
      </Button>
    </Card>
  );
};

export default BehaviorCard;
