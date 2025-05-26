
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface Goal {
  id: string;
  title: string;
  reward: string;
  pointsRequired: number;
  isCompleted: boolean;
  rewardGiven: boolean;
}

interface GoalCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal;
  onGiveReward: () => void;
}

const GoalCompletedModal = ({ isOpen, onClose, goal, onGiveReward }: GoalCompletedModalProps) => {
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
              Mark this goal as completed!
            </p>
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
              onClick={onGiveReward}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
            >
              Mark as Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalCompletedModal;
