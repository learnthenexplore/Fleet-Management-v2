import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    forms: [],
    loading: false,
    error: null,
  },
  reducers: {
    setForms: (state, action) => {
      state.forms = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setForms, setLoading, setError } = formSlice.actions;
export default formSlice.reducer;
