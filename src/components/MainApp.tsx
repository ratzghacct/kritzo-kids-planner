
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlannerTab from '@/components/PlannerTab';
import RewardsTab from '@/components/RewardsTab';
import ParentCodeModal from '@/components/ParentCodeModal';

interface MainAppProps {
  username: string;
}

const MainApp = ({ username }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState('planner');
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentAction, setParentAction] = useState<string>('');

  const requestParentAccess = (action: string) => {
    setParentAction(action);
    setShowParentModal(true);
  };

  const handleParentCodeSuccess = () => {
    setShowParentModal(false);
    // Handle the parent action here
    console.log('Parent access granted for:', parentAction);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-300">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Welcome back, {username}! 👋
          </h1>
          <p className="text-purple-600 font-medium">Ready to plan your awesome day?</p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            <PlannerTab username={username} onRequestParentAccess={requestParentAccess} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <RewardsTab username={username} onRequestParentAccess={requestParentAccess} />
          </TabsContent>
        </Tabs>

        {/* Parent Code Modal */}
        <ParentCodeModal
          isOpen={showParentModal}
          onClose={() => setShowParentModal(false)}
          onSuccess={handleParentCodeSuccess}
          action={parentAction}
        />
      </div>
    </div>
  );
};

export default MainApp;
