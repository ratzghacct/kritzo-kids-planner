
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface Goal {
  id: string;
  title: string;
  reward: string;
  targetPoints: number;
  completed: boolean;
  dateCompleted?: string;
}

interface GoalCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  onComplete: (markAsGiven: boolean) => void;
}

const GoalCompletedModal = ({ isOpen, onClose, goal, onComplete }: GoalCompletedModalProps) => {
  React.useEffect(() => {
    if (isOpen) {
      // Trigger confetti when modal is opened
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🎉 Goal Completed!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <div className="text-4xl py-4">🏆</div>
            <h3 className="text-xl font-bold text-green-700">{goal.title}</h3>
            <p className="text-green-600 font-medium">
              You've earned your reward: <span className="font-bold">{goal.reward}</span>
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-yellow-700 font-medium">
              What would you like to do with this reward?
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              onClick={() => onComplete(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl"
            >
              Mark As Given
            </Button>
            <Button
              onClick={() => onComplete(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl"
            >
              Mark As Pending
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Choose "Mark As Given" if the reward has been provided.
            <br />
            Choose "Mark As Pending" if the reward will be given later.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCompletedModal;
