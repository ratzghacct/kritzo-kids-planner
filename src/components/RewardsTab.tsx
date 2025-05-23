import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import BehaviorCard from './BehaviorCard';
import AddBehaviorModal from './AddBehaviorModal';
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

export interface RewardsTabProps {
  username: string;
  onRequestParentAccess: (action: string) => void;
  isParentModeActive?: boolean;
}

const RewardsTab: React.FC<RewardsTabProps> = ({ username, onRequestParentAccess, isParentModeActive = false }) => {
  const [behaviors, setBehaviors] = useState<Behavior[]>([
    { id: '1', name: 'Clean Room', points: 10, icon: '🧹', type: 'positive' },
    { id: '2', name: 'Read a Book', points: 15, icon: '📚', type: 'positive' },
    { id: '3', name: 'Did Homework', points: 20, icon: '📝', type: 'positive' },
    { id: '4', name: 'Late to Bed', points: -10, icon: '🌙', type: 'negative' },
    { id: '5', name: 'Bad Attitude', points: -15, icon: '😠', type: 'negative' },
  ]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '101', title: 'New Toy', reward: 'Lego Set', pointsRequired: 100, isCompleted: false, rewardGiven: false },
    { id: '102', title: 'Movie Night', reward: 'Watch a Movie', pointsRequired: 80, isCompleted: false, rewardGiven: false },
  ]);
  const [points, setPoints] = useState(0);
  const [isAddBehaviorModalOpen, setIsAddBehaviorModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isGoalCompletedModalOpen, setIsGoalCompletedModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load behaviors, goals, and points from local storage
    const savedBehaviors = localStorage.getItem('behaviors');
    const savedGoals = localStorage.getItem('goals');
    const savedPoints = localStorage.getItem('points');
    const savedHistory = localStorage.getItem('history');

    if (savedBehaviors) setBehaviors(JSON.parse(savedBehaviors));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPoints) setPoints(parseInt(savedPoints || '0'));
    if (savedHistory) setHistory(JSON.parse(savedHistory || '[]'));
  }, []);

  useEffect(() => {
    // Save behaviors, goals, and points to local storage
    localStorage.setItem('behaviors', JSON.stringify(behaviors));
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('points', points.toString());
    localStorage.setItem('history', JSON.stringify(history));
  }, [behaviors, goals, points, history]);

  const adjustPoints = (behaviorPoints: number) => {
    const newPoints = points + behaviorPoints;
    setPoints(newPoints);

    const behavior = behaviors.find((b) => b.points === behaviorPoints);
    if (behavior) {
      const action = behaviorPoints > 0 ? 'earned' : 'lost';
      const newHistoryEntry = `${username} ${action} ${Math.abs(behaviorPoints)} points for ${behavior.name}`;
      setHistory([newHistoryEntry, ...history]);
    }
  };

  const addBehavior = (newBehavior: Behavior) => {
    setBehaviors([...behaviors, newBehavior]);
    setIsAddBehaviorModalOpen(false);
  };

  const removeBehavior = (id: string) => {
    setBehaviors(behaviors.filter(behavior => behavior.id !== id));
  };

  const addGoal = (newGoal: Goal) => {
    setGoals([...goals, { ...newGoal, id: Date.now().toString(), isCompleted: false, rewardGiven: false }]);
    setIsGoalModalOpen(false);
  };

  const completeGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalCompletedModalOpen(true);
  };

  const giveReward = () => {
    if (selectedGoal) {
      const updatedGoals = goals.map(g =>
        g.id === selectedGoal.id ? { ...g, isCompleted: true, rewardGiven: true } : g
      );
      setGoals(updatedGoals);
      setPoints(points - selectedGoal.pointsRequired);

      const newHistoryEntry = `${username} claimed reward: ${selectedGoal.reward} for ${selectedGoal.pointsRequired} points`;
      setHistory([newHistoryEntry, ...history]);

      setIsGoalCompletedModalOpen(false);
      setSelectedGoal(null);
    }
  };

  const resetGoal = (goal: Goal) => {
    const updatedGoals = goals.map(g =>
      g.id === goal.id ? { ...g, isCompleted: false, rewardGiven: false } : g
    );
    setGoals(updatedGoals);
  };

  const calculateProgress = (goal: Goal) => {
    return Math.min((points / goal.pointsRequired) * 100, 100);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Points Display */}
      <Card className="bg-gradient-pastel shadow-kid-friendly">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <TrendingUp className="mr-2 inline-block h-5 w-5 text-primary" />
            Current Points: {points}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Behaviors Section */}
      <Card className="shadow-kid-friendly">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            <PlusCircle className="mr-2 inline-block h-5 w-5 text-primary" />
            Behaviors
          </CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Add Behavior
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add New Behavior</SheetTitle>
                <SheetDescription>
                  Create a new behavior and assign points.
                </SheetDescription>
              </SheetHeader>
              <AddBehaviorModal isOpen={isAddBehaviorModalOpen} onClose={() => setIsAddBehaviorModalOpen(false)} onAddBehavior={addBehavior} />
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {behaviors.map((behavior) => (
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

      {/* Goals Section */}
      <Card className="shadow-kid-friendly">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">
            <Award className="mr-2 inline-block h-5 w-5 text-primary" />
            Goals
          </CardTitle>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Add Goal
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add New Goal</SheetTitle>
                <SheetDescription>
                  Create a new goal and assign points required.
                </SheetDescription>
              </SheetHeader>
              <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onAddGoal={addGoal} />
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md">
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-md font-medium">{goal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Reward: {goal.reward}</p>
                    <p className="text-sm text-muted-foreground">Points Required: {goal.pointsRequired}</p>
                    <Progress value={calculateProgress(goal)} />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span>{points >= goal.pointsRequired ? 'Ready to Claim!' : `${goal.pointsRequired - points} points to go!`}</span>
                    {goal.isCompleted ? (
                      <Button variant="secondary" size="sm" onClick={() => resetGoal(goal)} disabled={isParentModeActive === false}>
                        Reset Goal
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => completeGoal(goal)} disabled={points < goal.pointsRequired || isParentModeActive === false}>
                        Claim Reward
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
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
          <ScrollArea className="h-[150px] w-full rounded-md">
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div key={index} className="text-sm">
                  {entry}
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Goal Completed Modal */}
      {selectedGoal && (
        <GoalCompletedModal
          isOpen={isGoalCompletedModalOpen}
          onClose={() => setIsGoalCompletedModalOpen(false)}
          goal={selectedGoal}
          onGiveReward={giveReward}
        />
      )}
    </div>
  );
};

export default RewardsTab;
