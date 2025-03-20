import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  role: "developer" | "manager";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; role: string }>
    ) => {
      (state.isAuthenticated = true),
        (state.user = {
          username: action.payload.username,
          role: action.payload.role as "developer" | "manager",
        });
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});


export const {login,logout} = authSlice.actions

export default  authSlice.reducer
