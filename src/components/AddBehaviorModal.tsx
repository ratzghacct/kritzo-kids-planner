
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Behavior {
  name: string;
  points: number;
  icon: string;
  type: 'positive' | 'negative';
}

interface AddBehaviorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (behavior: Behavior) => void;
}

const iconOptions = ['🧹', '🤝', '📚', '💝', '😤', '🙉', '🗂️', '⭐', '👍', '🌟', '🎯', '👏', '😊', '🥇'];

const AddBehaviorModal = ({ isOpen, onClose, onAdd }: AddBehaviorModalProps) => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState('2');
  const [icon, setIcon] = useState('⭐');
  const [type, setType] = useState<'positive' | 'negative'>('positive');

  const handleAdd = () => {
    if (name.trim() === '') return;
    
    onAdd({
      name: name.trim(),
      points: type === 'positive' ? Math.abs(parseInt(points) || 1) : -Math.abs(parseInt(points) || 1),
      icon,
      type
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPoints('2');
    setIcon('⭐');
    setType('positive');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            Add New Behavior
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-gray-700">
              Behavior Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Cleaned Room"
              className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              Behavior Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => setType('positive')}
                className={`rounded-xl py-3 font-bold ${
                  type === 'positive'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👍 Positive
              </Button>
              <Button
                type="button"
                onClick={() => setType('negative')}
                className={`rounded-xl py-3 font-bold ${
                  type === 'negative'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👎 Negative
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points" className="text-sm font-bold text-gray-700">
              Points Value
            </Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              max="10"
              className="rounded-xl border-2 border-gray-200 focus:border-purple-400"
            />
            <p className="text-xs text-gray-500">
              {type === 'positive' 
                ? `This behavior will add ${points || 0} points` 
                : `This behavior will subtract ${points || 0} points`}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              Choose Icon
            </Label>
            <div className="grid grid-cols-7 gap-2">
              {iconOptions.map((emoji, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  variant={icon === emoji ? "default" : "outline"}
                  className="h-10 w-10 p-0 text-xl rounded-lg"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
            >
              Add Behavior
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBehaviorModal;
