
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Goal {
  id: string;
  title: string;
  reward: string;
  pointsRequired: number;
  isCompleted: boolean;
  rewardGiven: boolean;
}

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Goal) => void;
}

const GoalModal = ({ isOpen, onClose, onAddGoal }: GoalModalProps) => {
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState('');
  const [pointsRequired, setPointsRequired] = useState('30');

  const handleSave = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      reward,
      pointsRequired: parseInt(pointsRequired) || 30,
      isCompleted: false,
      rewardGiven: false,
    };
    
    onAddGoal(newGoal);
    
    // Reset form
    setTitle('');
    setReward('');
    setPointsRequired('30');
    
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
              Points Required
            </Label>
            <Input
              id="points"
              type="number"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(e.target.value)}
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
              disabled={!title.trim() || !reward.trim()}
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
