
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Holiday {
  name: string;
  date: string;
  icon: string;
}

interface AddHolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (holiday: Holiday) => void;
  selectedMonth: number;
  selectedYear: number;
}

const holidayOptions = [
  { name: "New Year's Day", icon: "🎉" },
  { name: "Valentine's Day", icon: "❤️" },
  { name: "Easter", icon: "🐰" },
  { name: "Independence Day", icon: "🎆" },
  { name: "Halloween", icon: "🎃" },
  { name: "Thanksgiving", icon: "🦃" },
  { name: "Christmas", icon: "🎄" },
  { name: "Birthday", icon: "🎂" },
  { name: "Family Day", icon: "👨‍👩‍👧‍👦" },
  { name: "School Break", icon: "🏫" },
  { name: "Vacation", icon: "🏝️" },
  { name: "Doctor's Visit", icon: "👩‍⚕️" },
];

const AddHolidayModal = ({ isOpen, onClose, onAdd, selectedMonth, selectedYear }: AddHolidayModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(selectedYear, selectedMonth, 15)
  );
  const [selectedHolidayIndex, setSelectedHolidayIndex] = useState<number | null>(null);
  const [customHoliday, setCustomHoliday] = useState('');
  const [customIcon, setCustomIcon] = useState('🎊');

  const handleAdd = () => {
    if (!selectedDate) return;
    
    let holidayName: string;
    let holidayIcon: string;
    
    if (selectedHolidayIndex !== null) {
      holidayName = holidayOptions[selectedHolidayIndex].name;
      holidayIcon = holidayOptions[selectedHolidayIndex].icon;
    } else if (customHoliday) {
      holidayName = customHoliday;
      holidayIcon = customIcon;
    } else {
      return; // No holiday selected
    }
    
    onAdd({
      name: holidayName,
      date: selectedDate.toLocaleDateString(),
      icon: holidayIcon
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedDate(new Date(selectedYear, selectedMonth, 15));
    setSelectedHolidayIndex(null);
    setCustomHoliday('');
    setCustomIcon('🎊');
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
            🎊 Add Holiday
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-bold text-gray-700">Select Date</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-bold text-gray-700">Choose Holiday</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {holidayOptions.map((option, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedHolidayIndex(index);
                    setCustomHoliday('');
                  }}
                  variant={selectedHolidayIndex === index ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center p-1 text-xs rounded-xl"
                >
                  <span className="text-xl mb-1">{option.icon}</span>
                  <span className="text-xs font-medium text-center line-clamp-1">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <Label className="text-sm font-bold text-gray-700">Or Custom Holiday</Label>
            <div className="flex mt-2 gap-2">
              <div className="flex-grow">
                <Input
                  value={customHoliday}
                  onChange={(e) => {
                    setCustomHoliday(e.target.value);
                    setSelectedHolidayIndex(null);
                  }}
                  placeholder="Custom holiday name"
                  className="rounded-xl"
                />
              </div>
              <div className="w-16">
                <Input
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  maxLength={2}
                  className="w-16 text-center text-2xl rounded-xl"
                />
              </div>
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
              disabled={!selectedDate || (selectedHolidayIndex === null && !customHoliday)}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold"
            >
              Add Holiday
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHolidayModal;
