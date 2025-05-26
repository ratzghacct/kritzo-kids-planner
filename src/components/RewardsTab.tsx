import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    const newBehavior: Behavior = {
      id: Date.now().toString(),
      name: newBehaviorName,
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
        claimStatus: 'done'
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
        <CardHeader>
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
                <span className="text-sm">
                  {points >= currentGoal.pointsRequired ? 'Ready to Claim!' : `${currentGoal.pointsRequired - points} points to go!`}
                </span>
                <Button size="sm" onClick={() => setIsGoalCompletedModalOpen(true)} disabled={points < currentGoal.pointsRequired || isParentModeActive === false} className="bg-green-500 hover:bg-green-600">
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
          <Button variant="outline" size="sm" onClick={() => setIsAddBehaviorModalOpen(true)}>
            Add Behavior
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {behaviors.map(behavior => <BehaviorCard key={behavior.id} behavior={behavior} onAdjustPoints={adjustPoints} onRequestParentAccess={onRequestParentAccess} onRemove={removeBehavior} isParentModeActive={isParentModeActive} />)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* History Section */}
      <Card className="shadow-kid-friendly">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            <History className="mr-2 inline-block h-5 w-5 text-primary" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md">
            <div className="space-y-2">
              {/* Completed Goals */}
              {completedGoals.map(goal => <Card key={goal.id} className="p-3 bg-green-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-green-800">🏆 Goal: {goal.title}</p>
                      <p className="text-sm text-green-600">Reward: {goal.reward}</p>
                      <p className="text-xs text-green-500">Completed: {goal.completedDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-700">Status: Done</div>
                      <div className="text-xs">
                        Claim: {goal.claimStatus === 'done' ? <span className="text-green-600 font-medium">✓ Done</span> : <Button size="sm" variant="outline" onClick={() => markCompletedGoalAsDone(goal.id)} className="h-6 text-xs" disabled={!isParentModeActive}>
                            Mark Done
                          </Button>}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </Card>)}
              
              {/* Regular History */}
              {history.map((entry, index) => <div key={index} className="text-sm">
                  {entry}
                  <Separator className="my-2" />
                </div>)}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Behavior Modal */}
      {isAddBehaviorModalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">Add New Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="behaviorName">Behavior Name</Label>
                <Input id="behaviorName" value={newBehaviorName} onChange={e => setNewBehaviorName(e.target.value)} placeholder="e.g., Clean Room" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="behaviorPoints">Points</Label>
                <Input id="behaviorPoints" type="number" value={newBehaviorPoints} onChange={e => setNewBehaviorPoints(e.target.value)} placeholder="10" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="behaviorIcon">Icon</Label>
                <Input id="behaviorIcon" value={newBehaviorIcon} onChange={e => setNewBehaviorIcon(e.target.value)} placeholder="😊" />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex space-x-2">
                  <Button variant={newBehaviorType === 'positive' ? 'default' : 'outline'} onClick={() => setNewBehaviorType('positive')} className="flex-1">
                    Positive
                  </Button>
                  <Button variant={newBehaviorType === 'negative' ? 'default' : 'outline'} onClick={() => setNewBehaviorType('negative')} className="flex-1">
                    Negative
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsAddBehaviorModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addBehavior} disabled={!newBehaviorName.trim()} className="flex-1">
                Add Behavior
              </Button>
            </CardFooter>
          </Card>
        </div>}

      {/* Goal Modal */}
      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onAddGoal={addGoal} />

      {/* Goal Completed Modal */}
      {currentGoal && <GoalCompletedModal isOpen={isGoalCompletedModalOpen} onClose={() => setIsGoalCompletedModalOpen(false)} goal={currentGoal} onGiveReward={completeCurrentGoal} />}
    </div>;
};
export default RewardsTab;