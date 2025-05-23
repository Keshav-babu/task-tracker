import { configureStore } from "@reduxjs/toolkit";



import authReducer from "./auth/authSlice"
import tasksReducer from "./tasks/taskSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    tasks:tasksReducer
  },
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch