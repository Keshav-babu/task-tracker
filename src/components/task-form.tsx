"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addTask, updateTask } from "@/lib/tasks/taskSlice"

interface TaskFormProps {
  task?: any
  onCancel: () => void
}

export default function TaskForm({ task, onCancel }: TaskFormProps) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const isManager = user?.role === "manager"

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("open")
  const [assignee, setAssignee] = useState(user?.username || "")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock list of users for assignee dropdown
  const users = ["user", "john", "jane", "alex", "sam"]

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setStatus(task.status)
      setAssignee(task.assignee)
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
    }
  }, [task])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!assignee) {
      newErrors.assignee = "Assignee is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Here")
    e.preventDefault()

    if (!validate()) {
    console.log("Here1")

      return
    }

    const taskData = {
      title,
      description,
      priority,
      status,
      assignee,
      dueDate: dueDate?.toISOString(),
      id:title+assignee
    }

    if (task) {
    console.log("Here2")

      dispatch(updateTask({  ...taskData }))
    } else {
    console.log("Here3")

      dispatch(addTask(taskData))
    }

    onCancel()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task ? "Edit Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isManager && task}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task in detail"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isManager && task}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={isManager && task}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={isManager && !["pending_approval", "reopened"].includes(task?.status)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  {task && (
                    <>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="reopened">Reopened</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee} disabled={isManager && task}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignee && <p className="text-sm text-destructive">{errors.assignee}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    disabled={isManager && task}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isManager && task && !["pending_approval", "reopened"].includes(task.status)}>
            {task ? "Update Task" : "Create Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

