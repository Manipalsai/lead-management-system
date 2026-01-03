import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/axios';

/**
 * Types
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Initial State
 */
const tokenFromStorage = localStorage.getItem('token');

const initialState: AuthState = {
  isAuthenticated: !!tokenFromStorage, // ✅ FIX
  token: tokenFromStorage,
  user: null,
  loading: false,
  error: null,
};

/**
 * Login Thunk
 */
export const login = createAsyncThunk<
  { token: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Login failed'
    );
  }
});

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    setAuthFromStorage(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Pending
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login Success
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      })
      // Login Failure
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login error';
      });
  },
});

export const { logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
