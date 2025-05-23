import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import PlannerTab from '@/components/PlannerTab';
import RewardsTab from '@/components/RewardsTab';
import ParentCodeModal from '@/components/ParentCodeModal';
import ParentCodeSetupModal from '@/components/ParentCodeSetupModal';
import { toast } from 'sonner';

interface MainAppProps {
  username: string;
  onLogout: () => void;
}

const MainApp = ({ username, onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('planner');
  const [showParentModal, setShowParentModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [parentAction, setParentAction] = useState<string>('');
  const [parentCode, setParentCode] = useState<string>(() => {
    return localStorage.getItem('parentCode') || '';
  });
  const [isParentModeActive, setIsParentModeActive] = useState(false);
  const [rewardsTabVisited, setRewardsTabVisited] = useState(false);

  useEffect(() => {
    // Check if parent code is set
    if (!parentCode) {
      setShowSetupModal(true);
    }
    
    // Save username to localStorage to prevent app reset
    localStorage.setItem('username', username);
  }, [parentCode, username]);

  const requestParentAccess = (action) => {
    // If parent mode is already active, execute the action directly
    if (isParentModeActive) {
      executeParentAction(action);
      return;
    }

    // Otherwise, request parent verification
    setParentAction(action);
    setShowParentModal(true);
  };

  const executeParentAction = (action) => {
    // Handle different parent actions
    switch(action) {
      case 'lock-day':
        toast.success("Day schedule locked successfully!");
        break;
      case 'manage-goals':
        toast.success("Goals management unlocked!");
        break;
      case 'confirm-reward':
        toast.success("Reward confirmed as given!");
        break;
      case 'add-holiday':
        toast.success("Holiday added to calendar!");
        break;
      case 'parent-mode-toggle':
        setIsParentModeActive(!isParentModeActive);
        toast.success(isParentModeActive ? "Parent mode deactivated" : "Parent mode activated");
        break;
      case 'change-code':
        setShowSetupModal(true);
        break;
      default:
        if (action.startsWith('adjust-points')) {
          const behavior = action.replace('adjust-points-', '');
          toast.success(`${behavior} behavior recorded!`);
        }
    }
  };

  const handleParentCodeSuccess = () => {
    setShowParentModal(false);
    
    if (parentAction === 'parent-mode-toggle') {
      setIsParentModeActive(true);
      toast.success("Parent mode activated");
    } else {
      executeParentAction(parentAction);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Show parent modal on first visit to rewards tab if parent code exists
    // and parent mode is not active
    if (value === 'rewards' && !rewardsTabVisited && parentCode && !isParentModeActive) {
      setRewardsTabVisited(true);
      setParentAction('access-rewards');
      setShowParentModal(true);
    }
  };

  const handleSetupCode = (code: string) => {
    setParentCode(code);
    localStorage.setItem('parentCode', code);
    setShowSetupModal(false);
    toast.success("Parent code has been set!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-center py-6 flex-grow">
              <h1 className="text-3xl font-bold text-purple-700 mb-2 font-playfair">
                Welcome back, {username}! 👋
              </h1>
              <p className="text-purple-600 font-medium">Ready to plan your awesome day?</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => requestParentAccess('parent-mode-toggle')}
                variant="outline"
                size="sm"
                className="rounded-lg text-xs flex items-center gap-2"
              >
                {isParentModeActive ? (
                  <>
                    <Unlock size={14} /> Lock Parent Mode
                  </>
                ) : (
                  <>
                    <Lock size={14} /> Unlock Parent Mode
                  </>
                )}
              </Button>
              {isParentModeActive && (
                <Button
                  onClick={() => requestParentAccess('change-code')}
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs"
                >
                  Change Parent Code
                </Button>
              )}
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2 h-16">
              <TabsTrigger 
                value="planner" 
                className="text-lg font-bold rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
              >
                📅 Planner
              </TabsTrigger>
              <TabsTrigger 
                value="rewards" 
                className="text-lg font-bold rounded-xl data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
              >
                🏆 Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planner" className="space-y-4">
              <PlannerTab 
                username={username} 
                onRequestParentAccess={requestParentAccess} 
                isParentModeActive={isParentModeActive} 
              />
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <RewardsTab 
                username={username} 
                onRequestParentAccess={requestParentAccess} 
                isParentModeActive={isParentModeActive} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="app-footer">
        <p>Created by Rathish, copyright reserved 2025, made in Germany.</p>
      </footer>
      
      {/* Parent Code Modal */}
      <ParentCodeModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
        onSuccess={handleParentCodeSuccess}
        action={parentAction}
        correctCode={parentCode}
      />

      {/* Parent Code Setup Modal */}
      <ParentCodeSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSetupCode={handleSetupCode}
      />
    </div>
  );
};

export default MainApp;
