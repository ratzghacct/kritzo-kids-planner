
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
  { name: "Christmas", icon: "🎄" },
  { name: "Halloween", icon: "🎃" },
  { name: "Easter", icon: "🐰" },
  { name: "New Year", icon: "🎆" },
  { name: "Thanksgiving", icon: "🦃" },
  { name: "Valentine's Day", icon: "💝" },
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
  const [showAddForm, setShowAddForm] = useState(false);

  const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
  const dayHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.getDate() === selectedDay && 
           holidayDate.getMonth() === selectedMonth && 
           holidayDate.getFullYear() === selectedYear;
  });

  const handleSelectHoliday = (index: number) => {
    const holiday = holidayOptions[index];
    const formattedDate = `${selectedMonth + 1}/${selectedDay}/${selectedYear}`;
    
    onAddHoliday({
      name: holiday.name,
      date: formattedDate,
      icon: holiday.icon
    });
    
    // Reset state and close modal
    setSelectedHolidayIndex(null);
    handleClose();
  };

  const handleAddCustomHoliday = () => {
    if (customHoliday.trim()) {
      const formattedDate = `${selectedMonth + 1}/${selectedDay}/${selectedYear}`;
      
      onAddHoliday({
        name: customHoliday,
        date: formattedDate,
        icon: customIcon
      });
      
      // Reset form and close modal
      setCustomHoliday('');
      setCustomIcon('🎊');
      setShowAddForm(false);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedHolidayIndex(null);
    setCustomHoliday('');
    setCustomIcon('🎊');
    setShowAddForm(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl max-h-[90vh] overflow-y-auto">
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
                  <div key={holiday.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{holiday.icon}</span>
                      <span className="font-bold text-yellow-800">{holiday.name}</span>
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

          {/* Holiday Selection */}
          {isParentModeActive && (
            <div>
              <Label className="text-lg font-bold text-gray-700 mb-3 block">Select Holiday Type</Label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {holidayOptions.map((option, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() => handleSelectHoliday(index)}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center p-2 text-xs rounded-xl border-2 hover:border-purple-300 hover:bg-purple-50"
                  >
                    <span className="text-2xl mb-1">{option.icon}</span>
                    <span className="text-xs font-bold text-center leading-tight">{option.name}</span>
                  </Button>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Add Holiday Button */}
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                variant="outline"
                className="w-full h-12 bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 rounded-xl font-bold"
              >
                {showAddForm ? '❌ Cancel Custom' : '➕ Add Custom Holiday'}
              </Button>
              
              {/* Custom Holiday Form */}
              {showAddForm && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Label className="text-sm font-bold text-blue-700 mb-2 block">Custom Holiday</Label>
                  <div className="space-y-3">
                    <Input
                      value={customHoliday}
                      onChange={(e) => setCustomHoliday(e.target.value)}
                      placeholder="Holiday name"
                      className="rounded-xl border-blue-300"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={customIcon}
                        onChange={(e) => setCustomIcon(e.target.value)}
                        maxLength={2}
                        className="w-16 text-center text-2xl rounded-xl border-blue-300"
                      />
                      <Button
                        onClick={handleAddCustomHoliday}
                        disabled={!customHoliday.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                      >
                        Add Holiday
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
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
              className="flex-1 rounded-xl font-bold bg-gray-600 hover:bg-gray-700"
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
