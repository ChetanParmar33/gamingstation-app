import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  phone: '',
  name: '',
  email: '',
  city: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLoggedIn = true;
      state.phone = action.payload.phone || '';
      state.name = action.payload.name || '';
      state.email = action.payload.email || '';
      state.city = action.payload.city || '';
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.phone = '';
      state.name = '';
      state.email = '';
      state.city = '';
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
