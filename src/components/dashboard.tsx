"use client"

import { useState } from "react"


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Header from "./header"
import TaskForm from "./task-form"
import TaskList from "./task-list"
import TaskStats from "./task-stats"
import TimeTrackingReport from "./time-tracking-report"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsCreatingTask(true)
    setActiveTab("create")
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsCreatingTask(true)
    setActiveTab("create")
  }

  const handleCancelCreate = () => {
    setIsCreatingTask(false)
    setEditingTask(null)
    setActiveTab("tasks")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onCreateTask={handleCreateTask} />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="create">
              {isCreatingTask ? (editingTask ? "Edit Task" : "Create Task") : "Create"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-4">
            <TaskList onEditTask={handleEditTask} />
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <div className="grid gap-6 md:grid-cols-2">
              <TaskStats />
              <TimeTrackingReport />
            </div>
          </TabsContent>
          <TabsContent value="create" className="mt-4">
            <TaskForm task={editingTask} onCancel={handleCancelCreate} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

