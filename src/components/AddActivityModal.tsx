
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Activity {
  name: string;
  icon: string;
  completed: boolean;
  time?: string;
}

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
}

const predefinedActivities = [
  { name: 'Reading Time', icon: '📚' },
  { name: 'Drawing', icon: '🎨' },
  { name: 'Snack Time', icon: '🍎' },
  { name: 'Clean Up Room', icon: '🧹' },
  { name: 'Exercise', icon: '🏃‍♂️' },
  { name: 'Homework', icon: '📝' },
  { name: 'Play Time', icon: '🎮' },
  { name: 'Music Practice', icon: '🎵' },
  { name: 'Outdoor Time', icon: '🌳' },
  { name: 'Help Parent', icon: '🤝' },
  { name: 'Brush Teeth', icon: '🦷' },
  { name: 'Bath Time', icon: '🛁' },
];

const AddActivityModal = ({ isOpen, onClose, onAdd }: AddActivityModalProps) => {
  const [selectedActivity, setSelectedActivity] = useState<typeof predefinedActivities[0] | null>(null);

  const handleAdd = () => {
    if (selectedActivity) {
      onAdd({
        name: selectedActivity.name,
        icon: selectedActivity.icon,
        completed: false,
      });
      setSelectedActivity(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🎯 Choose an Activity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {predefinedActivities.map((activity, index) => (
              <Card
                key={index}
                className={`p-4 cursor-pointer transition-all rounded-xl ${
                  selectedActivity?.name === activity.name
                    ? 'bg-blue-100 border-2 border-blue-400 scale-105'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedActivity(activity)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{activity.icon}</div>
                  <div className="text-sm font-bold text-gray-700">{activity.name}</div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedActivity}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
            >
              Add Activity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
