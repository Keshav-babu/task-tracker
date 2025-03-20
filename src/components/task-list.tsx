"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Clock, Edit, MoreHorizontal, Pause, Play, Trash2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { deleteTask, updateTaskStatus, updateTaskTimeSpent } from "@/lib/tasks/taskSlice"

interface TaskListProps {
  onEditTask: (task: any) => void
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const dispatch = useDispatch()
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [timeDialogOpen, setTimeDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [manualTime, setManualTime] = useState("")



  useEffect(() => {
    let result = [...tasks]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter)
    }

    // For developers, only show tasks assigned to them
    if (user?.role === "developer") {
      result = result.filter((task) => task.assignee === user.username)
    }

    setFilteredTasks(result)
  }, [tasks, searchTerm, statusFilter, priorityFilter, user])

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(id))
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch(updateTaskStatus({ id, status: newStatus }))
  }

  const startTimer = (taskId: string) => {
    if (activeTimer) {
      stopTimer()
    }

    setActiveTimer(taskId)
    const interval = setInterval(() => {
      dispatch(updateTaskTimeSpent({ id: taskId, increment: 1 }))
    }, 1000)

    setTimerInterval(interval as unknown as NodeJS.Timeout)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
    setActiveTimer(null)
  }

  const openTimeDialog = (task: any) => {
    setSelectedTask(task)
    setManualTime("")
    setTimeDialogOpen(true)
  }

  const addManualTime = () => {
    if (selectedTask && manualTime) {
      const minutes = Number.parseInt(manualTime)
      if (!isNaN(minutes) && minutes > 0) {
        dispatch(
          updateTaskTimeSpent({
            id: selectedTask.id,
            increment: minutes * 60,
          }),
        )
        setTimeDialogOpen(false)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Open
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            In Progress
          </Badge>
        )
      case "pending_approval":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Pending Approval
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Closed
          </Badge>
        )
      case "reopened":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Reopened
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="reopened">Reopened</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Assignee</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No tasks found. Create a new task to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.createdAt}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{task.assignee}</TableCell>
                    <TableCell className="hidden md:table-cell">{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(task.timeSpent)}</span>
                        {user?.role === "developer" && (
                          <>
                            {activeTimer === task.id ? (
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={stopTimer}>
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => startTimer(task.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user?.role === "developer" && (
                            <>
                              <DropdownMenuItem onClick={() => onEditTask(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openTimeDialog(task)}>
                                <Clock className="h-4 w-4 mr-2" />
                                Add Time
                              </DropdownMenuItem>
                              {task.status === "open" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in_progress")}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Progress
                                </DropdownMenuItem>
                              )}
                              {task.status === "in_progress" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task.id, "pending_approval")}>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark as Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                          {user?.role === "manager" && (
                            <>
                              {task.status === "pending_approval" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "closed")}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Approve & Close
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "reopened")}>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject & Reopen
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => onEditTask(task)}>
                                <Edit className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Time Manually</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Time in minutes</Label>
              <Input
                id="time"
                type="number"
                min="1"
                placeholder="Enter time in minutes"
                value={manualTime}
                onChange={(e) => setManualTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTimeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addManualTime}>Add Time</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

