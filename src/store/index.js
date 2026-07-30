import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import bookingReducer from './bookingSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    booking: bookingReducer,
    user: userReducer,
  },
});

export default store;
