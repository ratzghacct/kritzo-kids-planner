
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ParentCodeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupCode: (code: string) => void;
}

const ParentCodeSetupModal = ({ isOpen, onClose, onSetupCode }: ParentCodeSetupModalProps) => {
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (code.length !== 4 || !/^\d+$/.test(code)) {
      setError('Code must be exactly 4 digits');
      return;
    }
    
    if (code !== confirmCode) {
      setError('Codes do not match');
      return;
    }

    onSetupCode(code);
    resetForm();
  };

  const resetForm = () => {
    setCode('');
    setConfirmCode('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🔒 Set Parent Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-4">
              Create a 4-digit parent code to lock parent-only features
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="parentCode" className="text-sm font-medium text-gray-700">New Code</label>
              <Input
                id="parentCode"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 4-digit code"
                maxLength={4}
                className="text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-purple-400 h-14"
              />
            </div>
            
            <div>
              <label htmlFor="confirmCode" className="text-sm font-medium text-gray-700">Confirm Code</label>
              <Input
                id="confirmCode"
                type="password"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="Confirm 4-digit code"
                maxLength={4}
                className="text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-purple-400 h-14"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            
            {error && (
              <div className="text-center text-red-600 font-medium text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={code.length !== 4 || confirmCode.length !== 4}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
            >
              Save Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentCodeSetupModal;
