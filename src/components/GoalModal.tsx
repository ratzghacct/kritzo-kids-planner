
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Goal {
  id: string;
  title: string;
  reward: string;
  targetPoints: number;
  completed: boolean;
  dateCompleted?: string;
}

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: Goal;
  onSaveGoal: (goal: Goal) => void;
}

const GoalModal = ({ isOpen, onClose, currentGoal, onSaveGoal }: GoalModalProps) => {
  const [title, setTitle] = useState(currentGoal.title);
  const [reward, setReward] = useState(currentGoal.reward);
  const [targetPoints, setTargetPoints] = useState(currentGoal.targetPoints.toString());

  const handleSave = () => {
    onSaveGoal({
      ...currentGoal,
      title,
      reward,
      targetPoints: parseInt(targetPoints) || 30,
      completed: false,
      dateCompleted: undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🎯 Set New Goal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-gray-700">
              Goal Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Be Super Helpful"
              className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reward" className="text-sm font-bold text-gray-700">
              Reward
            </Label>
            <Input
              id="reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="e.g., Trip to the Park"
              className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points" className="text-sm font-bold text-gray-700">
              Target Points
            </Label>
            <Input
              id="points"
              type="number"
              value={targetPoints}
              onChange={(e) => setTargetPoints(e.target.value)}
              placeholder="30"
              className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
            />
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
              onClick={handleSave}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
            >
              Save Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalModal;
