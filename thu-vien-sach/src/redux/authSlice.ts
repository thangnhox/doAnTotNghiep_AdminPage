import { createSlice } from "@reduxjs/toolkit";
import { AppConstants } from "../constants";
import { RootState } from "./store";

export interface AuthState {
  token: string;
}

const initialState: AuthState = {
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: initialState,
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
      syncAuthStateLocalStorage(state.data);
    },
    removeAuth: (state) => {
      state.data = initialState;
      syncAuthStateLocalStorage(state.data);
    },
  },
});

const syncAuthStateLocalStorage = (data: AuthState) => {
  localStorage.setItem(AppConstants.token, JSON.stringify(data));
};

export const { addAuth, removeAuth } = authSlice.actions;
export const authState = (state: RootState) => state.auth.data;
export default authSlice.reducer;
