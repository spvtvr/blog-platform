import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async ({ username, password, email }, { rejectWithValue }) =>
    await axios
      .post('https://blog.kata.academy/api/users', {
        user: { username, email, password },
      })
      .then((response) => response.data.user)
      .catch((error) => rejectWithValue(error))
);

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }, { rejectWithValue }) =>
    await axios
      .post('https://blog.kata.academy/api/users/login', {
        user: { email, password },
      })
      .then((response) => response.data.user)
      .catch((error) => rejectWithValue(error))
);

export const getCurrentUser = createAsyncThunk(
  'users/getCurrentUser',
  async ({ tokenID }, { rejectWithValue }) =>
    await axios
      .get('https://blog.kata.academy/api/user', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenID}`,
        },
      })
      .then((response) => response.data.user)
      .catch((error) => rejectWithValue(error))
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ username, email, password, image, token }, { rejectWithValue }) =>
    await axios
      .put(
        'https://blog.kata.academy/api/user',
        { user: { username, email, password, image, token } },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => response.data.user)
      .catch((error) => rejectWithValue(error))
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    username: null,
    email: null,
    password: null,
    image: null,
    token: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setLogOut: (state) => {
      localStorage.clear();
      state.token = false;
      state.image = null;
      state.password = null;
      state.email = null;
      state.username = null;
    },
  },
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.token = true;
    },
    [loginUser.fulfilled]: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.token = true;
    },
    [getCurrentUser.fulfilled]: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.image = action.payload.image;
    },
    [updateUser.fulfilled]: (state, action) => {
      localStorage.setItem('token', action.payload.token);
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.image = action.payload.image;
    },
    [registerUser.rejected]: (state, action) => {
      alert(JSON.stringify(action.payload.response.data.errors));
    },
    [loginUser.rejected]: (state, action) => {
      alert(JSON.stringify(action.payload.response.data.errors));
    },
    [getCurrentUser.rejected]: (state, action) => {
      alert(JSON.stringify(action.payload.response.data.errors));
    },
  },
});

export const { setUserData, setLogOut } = usersSlice.actions;
export default usersSlice.reducer;
