
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
    // Always adjust points when behavior is clicked
    onAdjustPoints(behavior.points);
    
    // Request parent access for tracking but don't block the action
    if (!isParentModeActive) {
      onRequestParentAccess(`adjust-points-${behavior.name}`);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(behavior.id);
    }
  };

  return (
    <Card className={`p-4 rounded-2xl border-2 transition-all hover:scale-102 ${
      behavior.type === 'positive' 
        ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/30' 
        : 'bg-gradient-to-r from-secondary/10 to-destructive/10 border-secondary/20 hover:border-secondary/30'
    } hover:shadow-kid-friendly`}>
      <div className="flex justify-between items-center w-full">
        <Button
          onClick={handleClick}
          className="flex-grow h-auto p-0 bg-transparent hover:bg-transparent text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{behavior.icon}</div>
            <div>
              <div className={`font-bold text-lg ${
                behavior.type === 'positive' ? 'text-primary-foreground/90 bg-primary px-3 py-1 rounded-lg' : 'text-secondary-foreground/90 bg-secondary px-3 py-1 rounded-lg'
              }`}>
                {behavior.name}
              </div>
              <div className={`text-sm font-medium mt-1 ${
                behavior.type === 'positive' ? 'text-primary' : 'text-secondary-foreground'
              }`}>
                {behavior.points > 0 ? '+' : ''}{behavior.points} points
              </div>
            </div>
          </div>
        </Button>
        
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-kid-friendly ${
            behavior.type === 'positive'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}>
            {behavior.type === 'positive' ? '+' : '-'}
          </div>
          
          {isParentModeActive && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="ml-2 text-destructive hover:bg-destructive/10 h-10 w-10 rounded-full p-0"
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
