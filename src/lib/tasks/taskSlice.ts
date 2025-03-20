import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: string;
  createdAt: string;
  dueDate?: string;
  timeSpent: number;
}

interface TasksState {
  tasks: Task[];
}

const generateSampleTasks = (): Task[] => {
  return [
    {
      id: "1",
      title: "Fix login page validation",
      description: "The login form doesn't validate email addresses correctly",
      priority: "high",
      status: "open",
      assignee: "user 1",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      timeSpent: 3600,
    },
    {
      id: "2",
      title: "Implement dark mode",
      description: "Add dark mode support to the application",
      priority: "medium",
      status: "in_progress",
      assignee: "user 2",
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      timeSpent: 7200,
    },
    {
      id: "3",
      title: "Optimize database queries",
      description: "The dashboard is loading slowly due to inefficient queries",
      priority: "high",
      status: "pending_approval",
      assignee: "john",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
      timeSpent: 10800,
    },
    {
      id: "4",
      title: "Update documentation",
      description: "Update the API documentation with the new endpoints",
      priority: "low",
      status: "closed",
      assignee: "jane",
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      timeSpent: 5400,
    },
    {
      id:"5",
      title: "Fix mobile responsiveness",
      description: "The application doesn't render correctly on mobile devices",
      priority: "medium",
      status: "reopened",
      assignee: "user 3",
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      timeSpent: 1800,
    },
  ];
};

const initialState: TasksState = {
  tasks: generateSampleTasks(),
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<Omit<Task,  | "createdAt" | "timeSpent">>
    ) => {
      const newTask: Task = {

        ...action.payload,
        createdAt: new Date().toISOString(),
        timeSpent: 0,
      };
      state.tasks.push(newTask);
    },
    updateTask: (
      state,
      action: PayloadAction<Partial<Task> & { id: string }>
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: string }>
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index].status = action.payload.status;
      }
    },
    updateTaskTimeSpent: (
      state,
      action: PayloadAction<{ id: string; increment: number }>
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index].timeSpent += action.payload.increment;
      }
    },
  },
});

export const {
  addTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
  updateTaskTimeSpent,
} = taskSlice.actions;

export default taskSlice.reducer;
