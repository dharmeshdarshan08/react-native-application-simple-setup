import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for generate-OTP
export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        'https://abvv.ac.in/api/api/website/whats-new',
        { mobile_number: phone }
      );
      console.log(resp.data);
      
      return resp.data;  // whatever the API returns
    } catch (err) {
      // You can inspect err.response.data for API errors
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const validateOtp = createAsyncThunk(
  'auth/generateOtp',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const resp = await axios.get(
        'https://abvv.ac.in/api/api/website/whats-new',
        { mobile_number: phone }
      );
      console.log(resp.data);
      
      return resp.data;  // whatever the API returns
    } catch (err) {
      // You can inspect err.response.data for API errors
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    phone: null,
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // if you need other sync reducers
  },
  extraReducers: builder => {
    builder
      .addCase(generateOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(generateOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.phone = action.meta.arg.phone;
      })
      .addCase(generateOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export default authSlice.reducer;
