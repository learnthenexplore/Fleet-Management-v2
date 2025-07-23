// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import  formReducer from './slices/formSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    form: formReducer,
  },
});

export default store;
