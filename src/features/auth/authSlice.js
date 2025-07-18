import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for generate-OTP
export const generateOtp = createAsyncThunk(
  'auth/generateOtp',
  async ({ phone }, { rejectWithValue }) => {
    try {
      // GET with body (non-standard, but API requires it)
      const resp = await axios({
        method: 'post',
        url: 'https://apis.allsoft.co/api/documentManagement//generateOTP',
        data: { mobile_number: phone },
        headers: { 'Content-Type': 'application/json' },
      });
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk for validate-OTP
export const validateOtp = createAsyncThunk(
  'auth/validateOtp',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        'https://apis.allsoft.co/api/documentManagement//validateOTP',
        { mobile_number: phone, otp },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Extract token and user info from resp.data.data
      const data = resp.data?.data || {};
      const token = data.token || resp.data?.token || resp.data?.jwt || resp.data?.access_token;
      const user_id = data.user_id;
      const user_name = data.user_name;
      const roles = data.roles;
      console.log('token', token);
      if (token) {
        await AsyncStorage.setItem('jwt', token);
      }
      // Return a consistent payload for the reducer
      return { token, user_id, user_name, roles };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Load token from AsyncStorage
export const loadToken = createAsyncThunk(
  'auth/loadToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      return token;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Upload/Search Document Entry
export const uploadDocumentEntry = createAsyncThunk(
  'auth/uploadDocumentEntry',
  async ({ payload }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      console.log("here ate upload Api ",token);
      const resp = await axios.post(
        'https://apis.allsoft.co/api/documentManagement//searchDocumentEntry',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return resp.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Upload File Document Entry (multipart/form-data)
export const uploadFileDocumentEntry = createAsyncThunk(
  'auth/uploadFileDocumentEntry',
  async ({ file, data }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || 'document',
        type: file.type || 'application/octet-stream',
      });
      formData.append('data', JSON.stringify(data));
      const resp = await axios.post(
        'https://apis.allsoft.co/api/documentManagement//saveDocumentEntry',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            token: token,
          },
        }
      );
      console.log("respone from upload ",resp);
      if (resp.data && resp.data.status === false) {
        return rejectWithValue(resp.data.message || 'Upload failed');
      }
      return resp.data;
    } catch (err) {
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
    token: null,
    user_id: null,
    user_name: null,
    roles: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user_id = null;
      state.user_name = null;
      state.roles = null;
      AsyncStorage.removeItem('jwt');
    },
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
      })
      .addCase(validateOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(validateOtp.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user_id = action.payload.user_id;
        state.user_name = action.payload.user_name;
        state.roles = action.payload.roles;
      })
      .addCase(validateOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(loadToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(uploadDocumentEntry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadDocumentEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(uploadDocumentEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(uploadFileDocumentEntry.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadFileDocumentEntry.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(uploadFileDocumentEntry.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
