
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Activity {
  name: string;
  icon: string;
  completed: boolean;
  time?: string;
}

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: Activity) => void;
  showTimeSelector?: boolean;
}

const predefinedActivities = [
  // Learning / Study
  { name: 'Reading', icon: '📚', category: 'Learning' },
  { name: 'Writing practice', icon: '✏️', category: 'Learning' },
  { name: 'Math homework', icon: '🔢', category: 'Learning' },
  { name: 'Science activity', icon: '🔬', category: 'Learning' },
  { name: 'Language learning', icon: '🗣️', category: 'Learning' },
  { name: 'Spelling practice', icon: '🔤', category: 'Learning' },
  { name: 'Drawing and coloring', icon: '🖍️', category: 'Learning' },
  { name: 'Educational games', icon: '🧩', category: 'Learning' },
  { name: 'School project time', icon: '📋', category: 'Learning' },
  { name: 'Online class', icon: '💻', category: 'Learning' },
  { name: 'Book review', icon: '📖', category: 'Learning' },
  { name: 'Quiz or flashcards', icon: '🃏', category: 'Learning' },
  
  // Creative Time
  { name: 'Art & craft', icon: '🎨', category: 'Creative' },
  { name: 'Drawing / sketching', icon: '✏️', category: 'Creative' },
  { name: 'Origami', icon: '📄', category: 'Creative' },
  { name: 'Painting', icon: '🎨', category: 'Creative' },
  { name: 'DIY project', icon: '🔨', category: 'Creative' },
  { name: 'Building with LEGO', icon: '🧱', category: 'Creative' },
  { name: 'Clay modeling', icon: '🏺', category: 'Creative' },
  { name: 'Puzzle-solving', icon: '🧩', category: 'Creative' },
  { name: 'Making a comic strip', icon: '💭', category: 'Creative' },
  { name: 'Music practice', icon: '🎵', category: 'Creative' },
  { name: 'Singing time', icon: '🎤', category: 'Creative' },
  
  // Physical Activity
  { name: 'Outdoor play', icon: '🌳', category: 'Physical' },
  { name: 'Indoor exercise', icon: '🏃‍♂️', category: 'Physical' },
  { name: 'Stretching / yoga', icon: '🧘‍♀️', category: 'Physical' },
  { name: 'Dance session', icon: '💃', category: 'Physical' },
  { name: 'Cycling', icon: '🚴‍♂️', category: 'Physical' },
  { name: 'Skating', icon: '⛸️', category: 'Physical' },
  { name: 'Sports practice', icon: '⚽', category: 'Physical' },
  { name: 'Jump rope', icon: '🪢', category: 'Physical' },
  { name: 'Running or jogging', icon: '🏃‍♀️', category: 'Physical' },
  
  // Chores / Life Skills
  { name: 'Cleaning room', icon: '🧹', category: 'Chores' },
  { name: 'Organizing books/toys', icon: '📚', category: 'Chores' },
  { name: 'Helping in kitchen', icon: '👨‍🍳', category: 'Chores' },
  { name: 'Folding clothes', icon: '👕', category: 'Chores' },
  { name: 'Setting the table', icon: '🍽️', category: 'Chores' },
  { name: 'Watering plants', icon: '🪴', category: 'Chores' },
  { name: 'Feeding pets', icon: '🐕', category: 'Chores' },
  { name: 'Packing school bag', icon: '🎒', category: 'Chores' },
  { name: 'Laundry help', icon: '👔', category: 'Chores' },
  
  // Meals & Snacks
  { name: 'Breakfast', icon: '🥞', category: 'Meals' },
  { name: 'Snack', icon: '🍎', category: 'Meals' },
  { name: 'Lunch', icon: '🥪', category: 'Meals' },
  { name: 'Juice break', icon: '🧃', category: 'Meals' },
  { name: 'Dinner', icon: '🍽️', category: 'Meals' },
  
  // Rest & Wellness
  { name: 'Nap time', icon: '😴', category: 'Wellness' },
  { name: 'Meditation', icon: '🧘‍♀️', category: 'Wellness' },
  { name: 'Free time', icon: '😌', category: 'Wellness' },
  { name: 'Relaxation', icon: '🛋️', category: 'Wellness' },
  { name: 'Talking with family', icon: '👨‍👩‍👧‍👦', category: 'Wellness' },
  { name: 'Listening to music', icon: '🎧', category: 'Wellness' },
  { name: 'Quiet time', icon: '🤫', category: 'Wellness' },
  
  // Digital / Screen Activities
  { name: 'Screen time', icon: '📱', category: 'Digital' },
  { name: 'Educational YouTube', icon: '📺', category: 'Digital' },
  { name: 'Watching cartoon/movie', icon: '🎬', category: 'Digital' },
  { name: 'Playing games', icon: '🎮', category: 'Digital' },
  { name: 'Video call with friends', icon: '📞', category: 'Digital' },
  
  // Social / Emotional Activities
  { name: 'Family talk time', icon: '💬', category: 'Social' },
  { name: 'Story sharing', icon: '📖', category: 'Social' },
  { name: 'Gratitude practice', icon: '🙏', category: 'Social' },
  { name: 'Mood check-in', icon: '😊', category: 'Social' },
  { name: 'Journaling', icon: '📝', category: 'Social' },
  { name: 'Helping a friend', icon: '🤝', category: 'Social' },
];

const timeOptions = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM'
];

const AddActivityModal = ({ isOpen, onClose, onAdd, showTimeSelector = false }: AddActivityModalProps) => {
  const [selectedActivity, setSelectedActivity] = useState<typeof predefinedActivities[0] | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleAdd = () => {
    if (selectedActivity) {
      onAdd({
        name: selectedActivity.name,
        icon: selectedActivity.icon,
        completed: false,
        time: showTimeSelector ? selectedTime : undefined
      });
      setSelectedActivity(null);
      setSelectedTime('');
      onClose();
    }
  };

  // Group activities by category
  const categories = ['Learning', 'Creative', 'Physical', 'Chores', 'Meals', 'Wellness', 'Digital', 'Social'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            🎯 Choose an Activity
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Select an activity from the categories below to add to your schedule
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4">
              {categories.map(category => {
                const categoryActivities = predefinedActivities.filter(activity => activity.category === category);
                return (
                  <div key={category} className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-700 sticky top-0 bg-white py-2 border-b">
                      {category === 'Learning' && '📚'} 
                      {category === 'Creative' && '🎨'} 
                      {category === 'Physical' && '🏃'} 
                      {category === 'Chores' && '🧹'} 
                      {category === 'Meals' && '🍽️'} 
                      {category === 'Wellness' && '😌'} 
                      {category === 'Digital' && '💻'} 
                      {category === 'Social' && '💬'} 
                      {' '}{category}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryActivities.map((activity, index) => (
                        <Card
                          key={`${category}-${index}`}
                          className={`p-3 cursor-pointer transition-all rounded-xl ${
                            selectedActivity?.name === activity.name
                              ? 'bg-blue-100 border-2 border-blue-400 scale-105'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <div className="text-center">
                            <div className="text-xl mb-1">{activity.icon}</div>
                            <div className="text-xs font-bold text-gray-700">{activity.name}</div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          {showTimeSelector && (
            <div className="space-y-2 flex-shrink-0">
              <Label htmlFor="time" className="text-sm font-bold text-gray-700">
                Select Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time" className="w-full rounded-xl border-2 border-gray-200">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex space-x-3 flex-shrink-0">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedActivity || (showTimeSelector && !selectedTime)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold"
            >
              Add Activity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddActivityModal;
