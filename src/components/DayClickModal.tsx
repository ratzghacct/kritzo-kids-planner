import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Holiday {
  id: string;
  name: string;
  date: string;
  icon: string;
}

interface DayClickModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: number;
  selectedMonth: number;
  selectedYear: number;
  holidays: Holiday[];
  onAddHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  onRemoveHoliday: (id: string) => void;
  onResetParentCode: () => void;
  isParentModeActive: boolean;
}

const holidayOptions = [
  { name: "Birthday", icon: "🎂" },
  { name: "Family Day", icon: "👨‍👩‍👧‍👦" },
  { name: "School Break", icon: "🏫" },
  { name: "Vacation", icon: "🏝️" },
  { name: "Doctor's Visit", icon: "👩‍⚕️" },
  { name: "Special Event", icon: "🎊" },
];

const DayClickModal = ({ 
  isOpen, 
  onClose, 
  selectedDay, 
  selectedMonth, 
  selectedYear, 
  holidays, 
  onAddHoliday, 
  onRemoveHoliday,
  onResetParentCode,
  isParentModeActive 
}: DayClickModalProps) => {
  const [selectedHolidayIndex, setSelectedHolidayIndex] = useState<number | null>(null);
  const [customHoliday, setCustomHoliday] = useState('');
  const [customIcon, setCustomIcon] = useState('🎊');

  const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
  const dayHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getDate() === selectedDay && 
           holidayDate.getMonth() === selectedMonth && 
           holidayDate.getFullYear() === selectedYear;
  });

  const handleAddHoliday = () => {
    let holidayName: string;
    let holidayIcon: string;
    
    if (selectedHolidayIndex !== null) {
      holidayName = holidayOptions[selectedHolidayIndex].name;
      holidayIcon = holidayOptions[selectedHolidayIndex].icon;
    } else if (customHoliday) {
      holidayName = customHoliday;
      holidayIcon = customIcon;
    } else {
      return;
    }
    
    onAddHoliday({
      name: holidayName,
      date: selectedDate.toLocaleDateString(),
      icon: holidayIcon
    });
    
    // Reset form
    setSelectedHolidayIndex(null);
    setCustomHoliday('');
    setCustomIcon('🎊');
  };

  const handleClose = () => {
    setSelectedHolidayIndex(null);
    setCustomHoliday('');
    setCustomIcon('🎊');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">
            📅 {selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing Holidays */}
          {dayHolidays.length > 0 && (
            <div>
              <Label className="text-sm font-bold text-gray-700">Holidays on this day:</Label>
              <div className="space-y-2 mt-2">
                {dayHolidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{holiday.icon}</span>
                      <span className="font-medium">{holiday.name}</span>
                    </div>
                    {isParentModeActive && (
                      <Button 
                        onClick={() => onRemoveHoliday(holiday.id)}
                        variant="ghost"
                        className="text-red-500 hover:bg-red-100 h-8 w-8 rounded-full p-0"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Add Holiday Section */}
          {isParentModeActive && (
            <div>
              <Label className="text-sm font-bold text-gray-700">Mark as Holiday</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
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
                    <span className="text-xs font-medium text-center">{option.name}</span>
                  </Button>
                ))}
              </div>
              
              <div className="pt-3">
                <Label className="text-sm font-bold text-gray-700">Or Custom Holiday</Label>
                <div className="flex mt-2 gap-2">
                  <Input
                    value={customHoliday}
                    onChange={(e) => {
                      setCustomHoliday(e.target.value);
                      setSelectedHolidayIndex(null);
                    }}
                    placeholder="Custom holiday name"
                    className="rounded-xl"
                  />
                  <Input
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    maxLength={2}
                    className="w-16 text-center text-2xl rounded-xl"
                  />
                </div>
              </div>
              
              <Button
                onClick={handleAddHoliday}
                disabled={selectedHolidayIndex === null && !customHoliday}
                className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold"
              >
                Add Holiday
              </Button>
              
              <Separator className="my-4" />
            </div>
          )}

          {/* Reset Parent Code Section */}
          {isParentModeActive && (
            <div>
              <Label className="text-sm font-bold text-gray-700">Parent Settings</Label>
              <Button
                onClick={onResetParentCode}
                variant="outline"
                className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-bold"
              >
                🔄 Reset Parent Code
              </Button>
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleClose}
              className="flex-1 rounded-xl font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayClickModal;
