import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BehaviorCard from './BehaviorCard';
import GoalModal from './GoalModal';
import GoalCompletedModal from './GoalCompletedModal';
import { PlusCircle, TrendingUp, Award, History } from 'lucide-react';

export interface Behavior {
  id: string;
  name: string;
  points: number;
  icon: string;
  type: 'positive' | 'negative';
}
export interface Goal {
  id: string;
  title: string;
  reward: string;
  pointsRequired: number;
  isCompleted: boolean;
  rewardGiven: boolean;
}
export interface CompletedGoal extends Goal {
  completedDate: string;
  claimStatus: 'pending' | 'done';
}
export interface RewardsTabProps {
  username: string;
  onRequestParentAccess: (action: string) => void;
  isParentModeActive?: boolean;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  username,
  onRequestParentAccess,
  isParentModeActive = false
}) => {
  // ... keep existing code (state declarations for behaviors)
  const [behaviors, setBehaviors] = useState<Behavior[]>([{
    id: '1',
    name: 'Clean Room',
    points: 10,
    icon: '🧹',
    type: 'positive'
  }, {
    id: '2',
    name: 'Read a Book',
    points: 15,
    icon: '📚',
    type: 'positive'
  }, {
    id: '3',
    name: 'Did Homework',
    points: 20,
    icon: '📝',
    type: 'positive'
  }, {
    id: '4',
    name: 'Late to Bed',
    points: -10,
    icon: '🌙',
    type: 'negative'
  }, {
    id: '5',
    name: 'Bad Attitude',
    points: -15,
    icon: '😠',
    type: 'negative'
  }]);

  // Only keep one active goal
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(() => {
    const saved = localStorage.getItem('currentGoal');
    return saved ? JSON.parse(saved) : {
      id: '101',
      title: 'New Toy',
      reward: 'Lego Set',
      pointsRequired: 100,
      isCompleted: false,
      rewardGiven: false
    };
  });
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>(() => {
    const saved = localStorage.getItem('completedGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [points, setPoints] = useState(0);
  const [isAddBehaviorModalOpen, setIsAddBehaviorModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isGoalCompletedModalOpen, setIsGoalCompletedModalOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Add Behavior Form State
  const [newBehaviorName, setNewBehaviorName] = useState('');
  const [newBehaviorPoints, setNewBehaviorPoints] = useState('10');
  const [newBehaviorIcon, setNewBehaviorIcon] = useState('😊');
  const [newBehaviorType, setNewBehaviorType] = useState<'positive' | 'negative'>('positive');
  
  // ... keep existing code (useEffect hooks)
  useEffect(() => {
    // Load behaviors, current goal, completed goals, and points from local storage
    const savedBehaviors = localStorage.getItem('behaviors');
    const savedPoints = localStorage.getItem('points');
    const savedHistory = localStorage.getItem('history');
    if (savedBehaviors) setBehaviors(JSON.parse(savedBehaviors));
    if (savedPoints) setPoints(parseInt(savedPoints || '0'));
    if (savedHistory) setHistory(JSON.parse(savedHistory || '[]'));
  }, []);
  useEffect(() => {
    // Save to local storage
    localStorage.setItem('behaviors', JSON.stringify(behaviors));
    localStorage.setItem('currentGoal', JSON.stringify(currentGoal));
    localStorage.setItem('completedGoals', JSON.stringify(completedGoals));
    localStorage.setItem('points', points.toString());
    localStorage.setItem('history', JSON.stringify(history));
  }, [behaviors, currentGoal, completedGoals, points, history]);

  // ... keep existing code (adjustPoints, addBehavior, removeBehavior, addGoal functions)
  const adjustPoints = (behaviorPoints: number) => {
    const newPoints = points + behaviorPoints;
    setPoints(newPoints);
    const behavior = behaviors.find(b => b.points === behaviorPoints);
    if (behavior) {
      const action = behaviorPoints > 0 ? 'earned' : 'lost';
      const newHistoryEntry = `${username} ${action} ${Math.abs(behaviorPoints)} points for ${behavior.name}`;
      setHistory([newHistoryEntry, ...history]);
    }

    // Check if current goal is completed
    if (currentGoal && newPoints >= currentGoal.pointsRequired && !currentGoal.isCompleted) {
      setIsGoalCompletedModalOpen(true);
    }
  };
  const addBehavior = () => {
    if (!newBehaviorName.trim()) return;
    
    const newBehavior: Behavior = {
      id: Date.now().toString(),
      name: newBehaviorName.trim(),
      points: parseInt(newBehaviorPoints) * (newBehaviorType === 'negative' ? -1 : 1),
      icon: newBehaviorIcon,
      type: newBehaviorType
    };
    setBehaviors([...behaviors, newBehavior]);

    // Reset form
    setNewBehaviorName('');
    setNewBehaviorPoints('10');
    setNewBehaviorIcon('😊');
    setNewBehaviorType('positive');
    setIsAddBehaviorModalOpen(false);
  };
  const removeBehavior = (id: string) => {
    setBehaviors(behaviors.filter(behavior => behavior.id !== id));
  };
  const addGoal = (newGoal: Goal) => {
    // Replace current goal with new goal
    setCurrentGoal(newGoal);
    setIsGoalModalOpen(false);
  };
  const completeCurrentGoal = () => {
    if (currentGoal) {
      // Move current goal to completed goals
      const completedGoal: CompletedGoal = {
        ...currentGoal,
        isCompleted: true,
        rewardGiven: true,
        completedDate: new Date().toLocaleDateString(),
        claimStatus: 'pending'
      };
      setCompletedGoals([completedGoal, ...completedGoals]);
      setPoints(points - currentGoal.pointsRequired);
      const newHistoryEntry = `${username} completed goal: ${currentGoal.title} for ${currentGoal.pointsRequired} points`;
      setHistory([newHistoryEntry, ...history]);

      // Clear current goal
      setCurrentGoal(null);
      setIsGoalCompletedModalOpen(false);
    }
  };
  const markCompletedGoalAsDone = (goalId: string) => {
    setCompletedGoals(prev => prev.map(goal => goal.id === goalId ? {
      ...goal,
      claimStatus: 'done'
    } : goal));
  };
  const calculateProgress = () => {
    if (!currentGoal) return 0;
    return Math.min(points / currentGoal.pointsRequired * 100, 100);
  };
  return <div className="flex flex-col space-y-4 p-4">
      {/* Points Display */}
      <Card className="bg-gradient-pastel shadow-kid-friendly">
        <CardHeader className="">
          <CardTitle className="text-xl font-semibold">
            <TrendingUp className="mr-2 inline-block h-5 w-5 text-primary" />
            Current Points: {points}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Goals Section - Moved to first position */}
      <Card className="shadow-kid-friendly">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            <Award className="mr-2 inline-block h-5 w-5 text-primary" />
            Current Goal
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsGoalModalOpen(true)}>
            {currentGoal ? 'Change Goal' : 'Add Goal'}
          </Button>
        </CardHeader>
        <CardContent>
          {currentGoal ? <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-md font-medium">{currentGoal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sky-400 text-base font-extrabold text-right my-[5px]">Reward: {currentGoal.reward}</p>
                <p className="text-sm text-muted-foreground">Points Required: {currentGoal.pointsRequired}</p>
                <div className="mt-2">
                  <Progress value={calculateProgress()} />
                  <p className="text-xs text-center mt-1">
                    {points}/{currentGoal.pointsRequired} points ({Math.round(calculateProgress())}%)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm font-semibold text-red-500">
                  {points >= currentGoal.pointsRequired ? 'Ready to Claim!' : `${currentGoal.pointsRequired - points} points to go!`}
                </span>
                <Button size="sm" onClick={() => setIsGoalCompletedModalOpen(true)} disabled={points < currentGoal.pointsRequired || isParentModeActive === false} className="bg-sky-400 hover:bg-sky-300 text-zinc-950">
                  Claim Reward
                </Button>
              </CardFooter>
            </Card> : <div className="text-center py-6 text-gray-500">
              No current goal set. Add a goal to get started!
            </div>}
        </CardContent>
      </Card>

      {/* Behaviors Section - Moved to second position */}
      <Card className="shadow-kid-friendly">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            <PlusCircle className="mr-2 inline-block h-5 w-5 text-primary" />
            Behaviors
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddBehaviorModalOpen(true)}
          >
            Add Behavior
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {behaviors.map(behavior => (
                <BehaviorCard 
                  key={behavior.id} 
                  behavior={behavior} 
                  onAdjustPoints={adjustPoints} 
                  onRequestParentAccess={onRequestParentAccess} 
                  onRemove={removeBehavior} 
                  isParentModeActive={isParentModeActive} 
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* History Section - Redesigned */}
      <Card className="shadow-kid-friendly">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <History className="mr-2 inline-block h-5 w-5 text-primary" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md">
            <div className="space-y-4">
              {/* Completed Goals */}
              {completedGoals.map(goal => (
                <Card key={goal.id} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🏆</span>
                          <h3 className="text-lg font-bold text-green-800">{goal.title}</h3>
                        </div>
                        <div className="space-y-1 ml-8">
                          <p className="text-sm">
                            <span className="font-bold text-green-700">Reward:</span>{" "}
                            <span className="font-bold text-blue-600">{goal.reward}</span>
                          </p>
                          <p className="text-xs text-green-600">
                            Completed: {goal.completedDate} • Points: {goal.pointsRequired}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge 
                          variant={goal.claimStatus === 'done' ? 'default' : 'secondary'}
                          className={goal.claimStatus === 'done' ? 'bg-green-600' : 'bg-orange-500'}
                        >
                          {goal.claimStatus === 'done' ? 'Claimed' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm font-medium text-green-700">
                        <span className="font-bold">Claim Status:</span>{" "}
                        {goal.claimStatus === 'done' ? (
                          <span className="text-green-600 font-bold">✓ Reward Given</span>
                        ) : (
                          <span className="text-orange-600 font-bold">⏳ Waiting for Reward</span>
                        )}
                      </p>
                      {goal.claimStatus === 'pending' && isParentModeActive && (
                        <Button 
                          size="sm" 
                          onClick={() => markCompletedGoalAsDone(goal.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold"
                        >
                          Mark as Given
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Regular History */}
              {history.map((entry, index) => (
                <Card key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">{entry}</p>
                </Card>
              ))}
              
              {/* Empty state */}
              {completedGoals.length === 0 && history.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <History className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p>No history yet. Start completing behaviors and goals!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Behavior Modal */}
      <Dialog open={isAddBehaviorModalOpen} onOpenChange={setIsAddBehaviorModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Add New Behavior</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="behaviorName">Behavior Name</Label>
              <Input 
                id="behaviorName" 
                value={newBehaviorName} 
                onChange={(e) => setNewBehaviorName(e.target.value)} 
                placeholder="e.g., Clean Room" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="behaviorPoints">Points</Label>
              <Input 
                id="behaviorPoints" 
                type="number" 
                value={newBehaviorPoints} 
                onChange={(e) => setNewBehaviorPoints(e.target.value)} 
                placeholder="10" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="behaviorIcon">Icon</Label>
              <Input 
                id="behaviorIcon" 
                value={newBehaviorIcon} 
                onChange={(e) => setNewBehaviorIcon(e.target.value)} 
                placeholder="😊" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex space-x-2">
                <Button 
                  variant={newBehaviorType === 'positive' ? 'default' : 'outline'} 
                  onClick={() => setNewBehaviorType('positive')} 
                  className="flex-1"
                  type="button"
                >
                  Positive
                </Button>
                <Button 
                  variant={newBehaviorType === 'negative' ? 'default' : 'outline'} 
                  onClick={() => setNewBehaviorType('negative')} 
                  className="flex-1"
                  type="button"
                >
                  Negative
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddBehaviorModalOpen(false)} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={addBehavior} 
                disabled={!newBehaviorName.trim()} 
                className="flex-1"
              >
                Add Behavior
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Goal Modal */}
      <GoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        onAddGoal={addGoal} 
      />

      {/* Goal Completed Modal */}
      {currentGoal && (
        <GoalCompletedModal 
          isOpen={isGoalCompletedModalOpen} 
          onClose={() => setIsGoalCompletedModalOpen(false)} 
          goal={currentGoal} 
          onGiveReward={completeCurrentGoal} 
        />
      )}
    </div>;
};
export default RewardsTab;
