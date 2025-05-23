
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

interface Behavior {
  id: string;
  name: string;
  points: number;
  icon: string;
  type: 'positive' | 'negative';
}

interface BehaviorCardProps {
  behavior: Behavior;
  onAdjustPoints: (points: number) => void;
  onRequestParentAccess: (action: string) => void;
  onRemove?: (id: string) => void;
  isParentModeActive?: boolean;
}

const BehaviorCard = ({ 
  behavior, 
  onAdjustPoints, 
  onRequestParentAccess,
  onRemove,
  isParentModeActive = false
}: BehaviorCardProps) => {
  const handleClick = () => {
    if (isParentModeActive) {
      // If parent mode is active, adjust points directly
      onAdjustPoints(behavior.points);
    } else {
      onRequestParentAccess(`adjust-points-${behavior.name}`);
      // For demo purposes, we'll adjust points immediately
      // In a real app, this would happen after parent code verification
      setTimeout(() => onAdjustPoints(behavior.points), 100);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(behavior.id);
    }
  };

  return (
    <Card className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
      behavior.type === 'positive' 
        ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:border-green-300' 
        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300'
    }`}>
      <div className="flex justify-between items-center w-full">
        <Button
          onClick={handleClick}
          className="flex-grow h-auto p-0 bg-transparent hover:bg-transparent text-left"
        >
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
        </Button>
        
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
            behavior.type === 'positive'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {behavior.type === 'positive' ? '+' : '-'}
          </div>
          
          {isParentModeActive && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="ml-2 text-red-500 hover:bg-red-100 h-10 w-10 rounded-full p-0"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BehaviorCard;
