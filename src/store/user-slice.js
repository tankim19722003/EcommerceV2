import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { user: null},
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      localStorage.removeItem("user");
      state.user = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;
