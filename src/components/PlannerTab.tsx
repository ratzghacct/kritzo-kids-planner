
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import { TrashIcon } from 'lucide-react';

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
  day?: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  icon: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PlannerTab = ({ username, onRequestParentAccess }: PlannerTabProps) => {
  const [viewType, setViewType] = useState('day');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: '1', name: 'Christmas Day', date: '12/25/2024', icon: '🎄' },
    { id: '2', name: 'Halloween', date: '10/31/2024', icon: '🎃' }
  ]);
  
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', name: 'Morning Reading', icon: '📚', completed: false, time: '9:00 AM', day: 'Monday' },
    { id: '2', name: 'Snack Time', icon: '🍎', completed: false, time: '10:30 AM', day: 'Monday' },
    { id: '3', name: 'Drawing', icon: '🎨', completed: true, time: '2:00 PM', day: 'Monday' },
    { id: '4', name: 'Clean Up Room', icon: '🧹', completed: false, time: '4:00 PM', day: 'Monday' },
  ]);

  const toggleActivity = (id: string) => {
    if (!isLocked) {
      setActivities(prev => prev.map(activity => 
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      ));
    }
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'day'> & { time?: string }) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
      day: viewType === 'week' ? selectedDay : 'Monday'
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const removeActivity = (id: string) => {
    if (!isLocked) {
      setActivities(prev => prev.filter(activity => activity.id !== id));
    }
  };

  const lockDay = () => {
    onRequestParentAccess('lock-day');
    // For demo, we'll lock immediately
    setIsLocked(true);
  };

  const copyTodayToWeek = () => {
    // Get today's activities (day view)
    const todayActivities = activities.filter(activity => !activity.day || activity.day === 'Monday');
    
    // Create a copy for each day of the week
    const allWeekActivities = [...activities];
    
    daysOfWeek.forEach((day, index) => {
      if (index > 0) { // Skip Monday since we already have those activities
        todayActivities.forEach(activity => {
          allWeekActivities.push({
            ...activity,
            id: Date.now().toString() + index + activity.id,
            day,
            completed: false // Reset completion status for copied activities
          });
        });
      }
    });
    
    setActivities(allWeekActivities);
  };

  const addHoliday = () => {
    onRequestParentAccess('add-holiday');
    // This would normally open a holiday modal, but for demo we'll just add a mock holiday
    const newHoliday = {
      id: Date.now().toString(),
      name: 'New Year\'s Day',
      date: '1/1/2025',
      icon: '🎉'
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const filteredActivities = activities.filter(activity => 
    viewType === 'day' || (viewType === 'week' && activity.day === selectedDay)
  );

  const allActivitiesComplete = filteredActivities.length > 0 && 
    filteredActivities.every(activity => activity.completed);

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
            {filteredActivities.map(activity => (
              <div key={activity.id} className="flex items-center">
                <div className="flex-grow">
                  <ActivityCard
                    activity={activity}
                    onToggle={toggleActivity}
                    isLocked={isLocked}
                  />
                </div>
                {!isLocked && (
                  <Button 
                    onClick={() => removeActivity(activity.id)}
                    variant="ghost"
                    className="ml-2 text-red-500 hover:bg-red-100 h-12 w-12 rounded-full"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
            
            {!isLocked && (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowAddActivity(true)}
                  className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
                >
                  ➕ Add New Activity
                </Button>
                
                <Button
                  onClick={copyTodayToWeek}
                  className="w-full h-12 text-md font-bold rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                >
                  📋 Copy Today to Full Week
                </Button>
              </div>
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
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {daysOfWeek.map((day) => (
                <Card 
                  key={day} 
                  className={`p-3 cursor-pointer ${
                    selectedDay === day 
                      ? 'bg-gradient-to-br from-blue-200 to-purple-200 border-2 border-purple-300' 
                      : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="font-bold text-purple-700">{day.substring(0, 3)}</div>
                </Card>
              ))}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-purple-700">{selectedDay}'s Activities</h3>
              
              {activities
                .filter(activity => activity.day === selectedDay)
                .map(activity => (
                  <div key={activity.id} className="flex items-center">
                    <div className="flex-grow">
                      <ActivityCard
                        activity={activity}
                        onToggle={toggleActivity}
                        isLocked={isLocked}
                      />
                    </div>
                    {!isLocked && (
                      <Button 
                        onClick={() => removeActivity(activity.id)}
                        variant="ghost"
                        className="ml-2 text-red-500 hover:bg-red-100 h-12 w-12 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              
              {!isLocked && activities.filter(activity => activity.day === selectedDay).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No activities yet for {selectedDay}. Add some below!
                </div>
              )}
              
              {!isLocked && (
                <Button
                  onClick={() => setShowAddActivity(true)}
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg"
                >
                  ➕ Add Activity for {selectedDay}
                </Button>
              )}
            </div>
          </div>
        )}

        {viewType === 'month' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-700">
                {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
              </h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center font-bold text-purple-700">{day}</div>
              ))}
              
              {Array.from({ length: 35 }, (_, i) => {
                const day = i + 1;
                const hasActivities = activities.some(a => {
                  if (!a.time) return false;
                  const date = new Date(a.time);
                  return date.getDate() === day && date.getMonth() === selectedMonth;
                });
                
                const holiday = holidays.find(h => {
                  const date = new Date(h.date);
                  return date.getDate() === day && date.getMonth() === selectedMonth;
                });
                
                return (
                  <Card 
                    key={i} 
                    className={`p-2 min-h-20 ${
                      hasActivities ? 'bg-blue-50 border-2 border-blue-200' : 
                      holiday ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-bold">{day <= 31 ? day : ''}</div>
                    {holiday && (
                      <div className="mt-1">
                        <div className="text-lg">{holiday.icon}</div>
                        <div className="text-xs font-medium text-yellow-700">{holiday.name}</div>
                      </div>
                    )}
                    {hasActivities && <div className="text-xs mt-1 text-blue-700">Activities</div>}
                  </Card>
                );
              })}
            </div>
            
            <Button
              onClick={addHoliday}
              className="w-full h-12 text-md font-bold rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
            >
              🎊 Add Holiday (Parent)
            </Button>
          </div>
        )}
      </Card>

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onAdd={addActivity}
        showTimeSelector={true}
      />
    </div>
  );
};

export default PlannerTab;
