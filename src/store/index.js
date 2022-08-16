import { configureStore } from '@reduxjs/toolkit';

import articlesSlice from './articlesSlice';
import usersSlice from './usersSlice';

export default configureStore({
  reducer: {
    articles: articlesSlice,
    users: usersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
