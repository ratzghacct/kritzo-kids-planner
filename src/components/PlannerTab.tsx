import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrashIcon } from 'lucide-react';
import ActivityCard from '@/components/ActivityCard';
import AddActivityModal from '@/components/AddActivityModal';
import AddHolidayModal from '@/components/AddHolidayModal';
import DayClickModal from '@/components/DayClickModal';

interface PlannerTabProps {
  username: string;
  onRequestParentAccess: (action: string) => void;
  isParentModeActive?: boolean;
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

const PlannerTab = ({ username, onRequestParentAccess, isParentModeActive = false }: PlannerTabProps) => {
  const [viewType, setViewType] = useState('day');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [showDayClickModal, setShowDayClickModal] = useState(false);
  const [clickedDay, setClickedDay] = useState<number>(1);
  const [isLocked, setIsLocked] = useState(false);
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Load holidays from localStorage or use defaults
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const savedHolidays = localStorage.getItem('holidays');
    return savedHolidays 
      ? JSON.parse(savedHolidays) 
      : [
          { id: '1', name: 'Christmas Day', date: '12/25/2024', icon: '🎄' },
          { id: '2', name: 'Halloween', date: '10/31/2024', icon: '🎃' }
        ];
  });
  
  // Separate activities for today and week views
  const [todayActivities, setTodayActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('todayActivities');
    return savedActivities 
      ? JSON.parse(savedActivities) 
      : [
          { id: '1', name: 'Morning Reading', icon: '📚', completed: false, time: '9:00 AM' },
          { id: '2', name: 'Snack Time', icon: '🍎', completed: false, time: '10:30 AM' },
          { id: '3', name: 'Drawing', icon: '🎨', completed: true, time: '2:00 PM' },
          { id: '4', name: 'Clean Up Room', icon: '🧹', completed: false, time: '4:00 PM' },
        ];
  });
  
  const [weekActivities, setWeekActivities] = useState<Activity[]>(() => {
    const savedActivities = localStorage.getItem('weekActivities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  // Save activities and holidays to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todayActivities', JSON.stringify(todayActivities));
  }, [todayActivities]);

  useEffect(() => {
    localStorage.setItem('weekActivities', JSON.stringify(weekActivities));
  }, [weekActivities]);

  useEffect(() => {
    localStorage.setItem('holidays', JSON.stringify(holidays));
  }, [holidays]);

  const toggleActivity = (id: string) => {
    if (!isLocked) {
      if (viewType === 'day') {
        setTodayActivities(prev => prev.map(activity => 
          activity.id === id ? { ...activity, completed: !activity.completed } : activity
        ));
      } else if (viewType === 'week') {
        setWeekActivities(prev => prev.map(activity => 
          activity.id === id ? { ...activity, completed: !activity.completed } : activity
        ));
      }
    }
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'day'> & { time?: string }) => {
    const newActivity = {
      ...activity,
      id: Date.now().toString(),
    };
    
    if (viewType === 'day') {
      setTodayActivities(prev => [...prev, newActivity]);
    } else if (viewType === 'week') {
      setWeekActivities(prev => [...prev, { ...newActivity, day: selectedDay }]);
    }
  };

  const removeActivity = (id: string) => {
    if (!isLocked) {
      if (viewType === 'day') {
        setTodayActivities(prev => prev.filter(activity => activity.id !== id));
      } else if (viewType === 'week') {
        setWeekActivities(prev => prev.filter(activity => activity.id !== id));
      }
    }
  };

  const lockDay = () => {
    onRequestParentAccess('lock-day');
    // For demo, we'll lock immediately if parent mode is active
    if (isParentModeActive) {
      setIsLocked(true);
    }
  };

  const copyTodayToWeek = () => {
    // Copy today's activities to each day of the week - but only for the weekly view
    const newWeekActivities = [...weekActivities];
    
    daysOfWeek.forEach((day) => {
      todayActivities.forEach(activity => {
        newWeekActivities.push({
          ...activity,
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          day,
          completed: false // Reset completion status for copied activities
        });
      });
    });
    
    setWeekActivities(newWeekActivities);
  };

  const addHoliday = (holiday: Omit<Holiday, 'id'>) => {
    const newHoliday = {
      ...holiday,
      id: Date.now().toString(),
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
  };

  const requestAddHoliday = () => {
    if (isParentModeActive) {
      setShowAddHoliday(true);
    } else {
      onRequestParentAccess('add-holiday');
      // After parent code verification, show holiday modal if parent mode is active
    }
  };

  const handleDayClick = (day: number) => {
    setClickedDay(day);
    setShowDayClickModal(true);
  };

  const handleResetParentCode = () => {
    onRequestParentAccess('change-code');
  };

  // Get activities for the current view
  const currentActivities = viewType === 'day' 
    ? todayActivities 
    : weekActivities.filter(activity => activity.day === selectedDay);

  const allActivitiesComplete = currentActivities.length > 0 && 
    currentActivities.every(activity => activity.completed);

  // Get days with activities for month view
  const getDaysWithActivities = () => {
    const days = new Map<number, { hasActivities: boolean, holidays: Holiday[] }>();
    
    // Initialize days in the month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.set(i, { hasActivities: false, holidays: [] });
    }
    
    // Add days from today's activities
    todayActivities.forEach(activity => {
      // For demo purposes, mark current day as having activities
      const currentDay = new Date().getDate();
      if (days.has(currentDay)) {
        const dayInfo = days.get(currentDay);
        if (dayInfo) {
          days.set(currentDay, { ...dayInfo, hasActivities: true });
        }
      }
    });
    
    // Add days from week activities
    weekActivities.forEach(activity => {
      // For demo purposes, mark days 1-7 as having activities for week view
      for (let i = 1; i <= 7; i++) {
        if (days.has(i)) {
          const dayInfo = days.get(i);
          if (dayInfo) {
            days.set(i, { ...dayInfo, hasActivities: true });
          }
        }
      }
    });
    
    // Add holidays
    holidays.forEach(holiday => {
      const date = new Date(holiday.date);
      if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
        const day = date.getDate();
        if (days.has(day)) {
          const dayInfo = days.get(day);
          if (dayInfo) {
            days.set(day, { 
              ...dayInfo, 
              holidays: [...dayInfo.holidays, holiday]
            });
          }
        }
      }
    });
    
    return days;
  };

  const daysWithActivitiesMap = getDaysWithActivities();

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
          <h2 className="text-2xl font-bold text-purple-700 font-playfair">
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
            {todayActivities.map(activity => (
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
                  className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
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
                    🔒 Lock Day {isParentModeActive ? '' : '(Parent)'}
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
              
              {weekActivities
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
              
              {!isLocked && weekActivities.filter(activity => activity.day === selectedDay).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No activities yet for {selectedDay}. Add some below!
                </div>
              )}
              
              {!isLocked && (
                <Button
                  onClick={() => setShowAddActivity(true)}
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
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
              <h3 className="text-xl font-bold text-purple-700 font-playfair">
                {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
              </h3>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center font-bold text-purple-700">{day}</div>
              ))}
              
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const dayInfo = daysWithActivitiesMap.get(day);
                
                if (!dayInfo || day > new Date(selectedYear, selectedMonth + 1, 0).getDate()) {
                  return (
                    <div key={i} className="p-2 min-h-20"></div>
                  );
                }
                
                const hasActivities = dayInfo.hasActivities;
                const dayHolidays = dayInfo.holidays;
                
                return (
                  <Card 
                    key={i} 
                    className={`p-2 min-h-20 cursor-pointer hover:bg-blue-50 ${
                      hasActivities ? 'bg-blue-50 border-2 border-blue-200' : 
                      dayHolidays.length > 0 ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'
                    }`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="text-sm font-bold">{day}</div>
                    {dayHolidays.length > 0 && dayHolidays.map(holiday => (
                      <div key={holiday.id} className="mt-1">
                        <div className="text-lg">{holiday.icon}</div>
                        <div className="text-xs font-medium text-yellow-700">{holiday.name}</div>
                      </div>
                    ))}
                    {hasActivities && (
                      <div className="flex justify-center mt-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                          !
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <AddActivityModal
        isOpen={showAddActivity}
        onClose={() => setShowAddActivity(false)}
        onAdd={addActivity}
        showTimeSelector={true}
      />
      
      <AddHolidayModal
        isOpen={showAddHoliday}
        onClose={() => setShowAddHoliday(false)}
        onAdd={addHoliday}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      <DayClickModal
        isOpen={showDayClickModal}
        onClose={() => setShowDayClickModal(false)}
        selectedDay={clickedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        holidays={holidays}
        onAddHoliday={addHoliday}
        onRemoveHoliday={removeHoliday}
        onResetParentCode={handleResetParentCode}
        isParentModeActive={isParentModeActive}
      />
    </div>
  );
};

export default PlannerTab;
