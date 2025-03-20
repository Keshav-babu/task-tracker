"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function TimeTrackingReport() {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)

  // Filter tasks for developers to only show their tasks
  const filteredTasks = user?.role === "developer" ? tasks.filter((task) => task.assignee === user.username) : tasks

  // Group tasks by date for the trend line
  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(today.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  // Create data for the trend line chart
  const trendData = dates.map((date) => {
    const tasksOnDate = filteredTasks.filter((task) => {
      const taskDate = new Date(task.createdAt).toISOString().split("T")[0]
      return taskDate === date
    })

    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count: tasksOnDate.length,
    }
  })

  // Create data for time spent by task
  const timeData = filteredTasks
    .filter((task) => task.timeSpent > 0)
    .sort((a, b) => b.timeSpent - a.timeSpent)
    .slice(0, 5)
    .map((task) => ({
      name: task.title.length > 20 ? task.title.substring(0, 20) + "..." : task.title,
      hours: Math.round((task.timeSpent / 3600) * 10) / 10,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
        <CardDescription>Task trend and time spent on tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trend">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trend">Task Trend</TabsTrigger>
            <TabsTrigger value="time">Time Spent</TabsTrigger>
          </TabsList>
          <TabsContent value="trend" className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                <Bar dataKey="count" fill="#3b82f6" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="time" className="h-[300px] mt-4">
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Time Spent"]} />
                  <Bar dataKey="hours" fill="#8b5cf6" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No time tracking data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Import Tabs components at the top
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

