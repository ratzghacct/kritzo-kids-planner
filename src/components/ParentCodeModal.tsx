
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ParentCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  action: string;
  correctCode: string;
}

const ParentCodeModal = ({ isOpen, onClose, onSuccess, action, correctCode }: ParentCodeModalProps) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (code === correctCode) {
      setError('');
      setCode('');
      onSuccess();
    } else {
      setError('Incorrect code. Please try again.');
      setCode('');
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  const getActionDescription = () => {
    switch(action) {
      case 'lock-day':
        return 'Lock day schedule';
      case 'manage-goals':
        return 'Manage goals';
      case 'confirm-reward':
        return 'Mark reward as given';
      case 'add-holiday':
        return 'Add holiday to calendar';
      case 'access-rewards':
        return 'Access rewards tab';
      case 'change-code':
        return 'Change parent code';
      default:
        if (action.startsWith('adjust-points')) {
          const behavior = action.replace('adjust-points-', '');
          return `Record "${behavior}" behavior`;
        }
        return action;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🔒 Parent Access
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-4">
              Enter parent code to continue
            </p>
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
              Action: {getActionDescription()}
            </p>
          </div>
          
          <div className="space-y-3">
            <Input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 4-digit code"
              maxLength={4}
              className="text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-purple-400 h-14"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            
            {error && (
              <div className="text-center text-red-600 font-medium text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={code.length !== 4}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
            >
              Verify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentCodeModal;
