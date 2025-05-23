
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Activity {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  time?: string;
}

interface ActivityCardProps {
  activity: Activity;
  onToggle: (id: string) => void;
  isLocked: boolean;
}

const ActivityCard = ({ activity, onToggle, isLocked }: ActivityCardProps) => {
  return (
    <Card className={`p-4 rounded-2xl transition-all ${
      activity.completed 
        ? 'bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-300' 
        : 'bg-white border-2 border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{activity.icon}</div>
          <div>
            <h3 className={`font-bold text-lg ${
              activity.completed ? 'text-green-700 line-through' : 'text-gray-800'
            }`}>
              {activity.name}
            </h3>
            {activity.time && (
              <p className="text-sm text-gray-600">{activity.time}</p>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => onToggle(activity.id)}
          disabled={isLocked}
          className={`w-12 h-12 rounded-full font-bold text-xl ${
            activity.completed
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {activity.completed ? '✓' : '○'}
        </Button>
      </div>
    </Card>
  );
};

export default ActivityCard;
