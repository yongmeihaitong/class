"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface LearningGoal {
  id: string
  courseId: string
  title: string
  description: string | null
  targetDate: string
  completed: boolean
  course: {
    title: string
    slug: string
  }
}

interface LearningGoalsProps {
  courseId: string
}

export function LearningGoals({ courseId }: LearningGoalsProps) {
  const [goals, setGoals] = useState<LearningGoal[]>([])
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: new Date(),
  })
  const [isAddingGoal, setIsAddingGoal] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    const response = await fetch("/api/learning-goals")
    if (response.ok) {
      const data = await response.json()
      setGoals(data)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("/api/learning-goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newGoal, courseId }),
    })
    if (response.ok) {
      setIsAddingGoal(false)
      setNewGoal({ title: "", description: "", targetDate: new Date() })
      fetchGoals()
    }
  }

  const handleToggleGoal = async (id: string, completed: boolean) => {
    const response = await fetch("/api/learning-goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed }),
    })
    if (response.ok) {
      fetchGoals()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <p>No learning goals set yet.</p>
        ) : (
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.id}
                  checked={goal.completed}
                  onCheckedChange={(checked) => handleToggleGoal(goal.id, checked as boolean)}
                />
                <label
                  htmlFor={goal.id}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    goal.completed && "line-through",
                  )}
                >
                  {goal.title} - Due {format(parseISO(goal.targetDate), "PP")}
                </label>
              </li>
            ))}
          </ul>
        )}
        {isAddingGoal ? (
          <form onSubmit={handleAddGoal} className="mt-4 space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Goal description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newGoal.targetDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newGoal.targetDate ? format(newGoal.targetDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newGoal.targetDate}
                  onSelect={(date) => date && setNewGoal({ ...newGoal, targetDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button type="submit">Add Goal</Button>
            <Button type="button" variant="outline" onClick={() => setIsAddingGoal(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <Button onClick={() => setIsAddingGoal(true)} className="mt-4">
            Add New Goal
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

