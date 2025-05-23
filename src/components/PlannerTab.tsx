
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';

interface PlannerTabProps {
  username: string;
  onRequestParentAccess: (action: string) => void;
}

interface Activity {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
  time?: string;
}

const PlannerTab = ({ username, onRequestParentAccess }: PlannerTabProps) => {
  const [viewType, setViewType] = useState('day');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', name: 'Morning Reading', icon: '📚', completed: false, time: '9:00 AM' },
    { id: '2', name: 'Snack Time', icon: '🍎', completed: false, time: '10:30 AM' },
    { id: '3', name: 'Drawing', icon: '🎨', completed: true, time: '2:00 PM' },
    { id: '4', name: 'Clean Up Room', icon: '🧹', completed: false, time: '4:00 PM' },
  ]);

  const toggleActivity = (id: string) => {
    if (!isLocked) {
      setActivities(prev => prev.map(activity => 
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      ));
    }
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const lockDay = () => {
    onRequestParentAccess('lock-day');
  };

  const allActivitiesComplete = activities.every(activity => activity.completed);

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Card className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
        <Tabs value={viewType} onValueChange={setViewType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl">
            <TabsTrigger value="day" className="rounded-lg font-bold">📅 Day</TabsTrigger>
            <TabsTrigger value="week" className="rounded-lg font-bold">📆 Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-lg font-bold">🗓️ Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Current View Display */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            {viewType === 'day' && 'Today\'s Schedule'}
            {viewType === 'week' && 'This Week'}
            {viewType === 'month' && 'This Month'}
          </h2>
          {isLocked && (
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
              🔒 Locked
            </div>
          )}
        </div>

        {viewType === 'day' && (
          <div className="space-y-4">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onToggle={toggleActivity}
                isLocked={isLocked}
              />
            ))}
            
            {!isLocked && (
              <Button
                onClick={() => setShowAddActivity(true)}
                className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
              >
                ➕ Add New Activity
              </Button>
            )}

            {allActivitiesComplete && !isLocked && (
              <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-2 border-green-200">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-green-700">🎉 Great job!</h3>
                  <p className="text-green-600">You completed all your activities today!</p>
                  <Button
                    onClick={lockDay}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl"
                  >
                    🔒 Lock Day (Parent)
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {viewType === 'week' && (
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <Card key={day} className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                <div className="font-bold text-purple-700 mb-2">{day}</div>
                <div className="text-sm text-gray-600">{index + 1}</div>
                <div className="mt-2 space-y-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mx-auto"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto"></div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewType === 'month' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-purple-700 mb-2">Month View</h3>
            <p className="text-gray-600">Coming soon! This will show your monthly progress.</p>
          </div>
        )}
      </Card>

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onAdd={addActivity}
      />
    </div>
  );
};

export default PlannerTab;
