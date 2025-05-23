
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BehaviorCard from '@/components/BehaviorCard';
import GoalModal from '@/components/GoalModal';

interface RewardsTabProps {
  username: string;
  onRequestParentAccess: (action: string) => void;
}

interface Goal {
  id: string;
  title: string;
  reward: string;
  targetPoints: number;
  completed: boolean;
  dateCompleted?: string;
  rewardPassed?: boolean;
}

const RewardsTab = ({ username, onRequestParentAccess }: RewardsTabProps) => {
  const [points, setPoints] = useState(15);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal>({
    id: '1',
    title: 'Be Super Helpful',
    reward: 'Trip to the Park',
    targetPoints: 30,
    completed: false,
  });
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);

  const behaviors = [
    { name: 'Helped Clean', points: 3, icon: '🧹', type: 'positive' as const },
    { name: 'Shared Toys', points: 2, icon: '🤝', type: 'positive' as const },
    { name: 'Finished Homework', points: 5, icon: '📚', type: 'positive' as const },
    { name: 'Was Kind', points: 2, icon: '💝', type: 'positive' as const },
    { name: 'Fought with Sibling', points: -3, icon: '😤', type: 'negative' as const },
    { name: 'Didn\'t Listen', points: -2, icon: '🙉', type: 'negative' as const },
    { name: 'Made a Mess', points: -2, icon: '🗂️', type: 'negative' as const },
  ];

  const adjustPoints = (behaviorPoints: number) => {
    const newPoints = Math.max(0, points + behaviorPoints);
    setPoints(newPoints);
    
    // Check if goal is completed
    if (newPoints >= currentGoal.targetPoints && !currentGoal.completed) {
      const completedGoal = {
        ...currentGoal,
        completed: true,
        dateCompleted: new Date().toLocaleDateString(),
      };
      setCompletedGoals(prev => [...prev, completedGoal]);
      setCurrentGoal(prev => ({ ...prev, completed: true, dateCompleted: new Date().toLocaleDateString() }));
    }
  };

  const progress = currentGoal.targetPoints > 0 ? (points / currentGoal.targetPoints) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Points Display */}
      <Card className="p-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl shadow-lg border-0">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-700 mb-2">Your Points</h2>
          <div className="text-6xl font-bold text-orange-600 mb-2">{points}</div>
          <div className="text-orange-600 font-bold">🌟 Keep it up!</div>
        </div>
      </Card>

      {/* Current Goal */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-700">Current Goal</h3>
          <Button
            onClick={() => setShowGoalModal(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-4 py-2 text-sm font-bold"
          >
            🎯 Manage Goals
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-800">{currentGoal.title}</h4>
            <p className="text-purple-600 font-medium">Reward: {currentGoal.reward}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>{points} points</span>
              <span>{currentGoal.targetPoints} points</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-4 rounded-full" />
          </div>
          
          {currentGoal.completed ? (
            <div className="bg-green-100 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold text-green-700">Goal Complete!</div>
              <div className="text-green-600">You earned your reward!</div>
              <Button
                onClick={() => onRequestParentAccess('confirm-reward')}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl"
              >
                Mark Reward As Given
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              {currentGoal.targetPoints - points} more points to go!
            </div>
          )}
        </div>
      </Card>

      {/* Behavior Tracking */}
      <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-purple-700">Track Behavior</h3>
          <div className="text-sm text-gray-600 font-medium">Parent controls</div>
        </div>
        
        <div className="space-y-3">
          {behaviors.map((behavior, index) => (
            <BehaviorCard
              key={index}
              behavior={behavior}
              onAdjustPoints={adjustPoints}
              onRequestParentAccess={onRequestParentAccess}
            />
          ))}
        </div>
      </Card>

      {/* Completed Goals Log */}
      {completedGoals.length > 0 && (
        <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-0">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Completed Goals 🏆</h3>
          <div className="space-y-3">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-green-700">{goal.title}</div>
                    <div className="text-sm text-green-600">Reward: {goal.reward}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600">
                      {goal.rewardPassed ? "Reward Given ✓" : "Completed"}
                    </div>
                    <div className="text-xs text-gray-500">{goal.dateCompleted}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <GoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        currentGoal={currentGoal}
        onSaveGoal={setCurrentGoal}
      />
    </div>
  );
};

export default RewardsTab;
