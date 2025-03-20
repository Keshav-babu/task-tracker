"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function TaskStats() {
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)

  // Filter tasks for developers to only show their tasks
  const filteredTasks = user?.role === "developer" ? tasks.filter((task) => task.assignee === user.username) : tasks

  // Status data for pie chart
  const statusData = [
    { name: "Open", value: filteredTasks.filter((task) => task.status === "open").length, color: "#3b82f6" },
    {
      name: "In Progress",
      value: filteredTasks.filter((task) => task.status === "in_progress").length,
      color: "#eab308",
    },
    {
      name: "Pending Approval",
      value: filteredTasks.filter((task) => task.status === "pending_approval").length,
      color: "#8b5cf6",
    },
    { name: "Closed", value: filteredTasks.filter((task) => task.status === "closed").length, color: "#22c55e" },
    { name: "Reopened", value: filteredTasks.filter((task) => task.status === "reopened").length, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  // Priority data for pie chart
  const priorityData = [
    { name: "High", value: filteredTasks.filter((task) => task.priority === "high").length, color: "#ef4444" },
    { name: "Medium", value: filteredTasks.filter((task) => task.priority === "medium").length, color: "#eab308" },
    { name: "Low", value: filteredTasks.filter((task) => task.priority === "low").length, color: "#22c55e" },
  ].filter((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Statistics</CardTitle>
        <CardDescription>Overview of your tasks by status and priority</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">By Status</TabsTrigger>
            <TabsTrigger value="priority">By Priority</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="h-[300px] mt-4">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No task data available
              </div>
            )}
          </TabsContent>
          <TabsContent value="priority" className="h-[300px] mt-4">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tasks`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No task data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

