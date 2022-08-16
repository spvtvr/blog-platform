import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getArticles = createAsyncThunk(
  'articlesSlice/getArticles',
  async ({ pageNumber }, { rejectWithValue }) => {
    return await axios
      .get(`https://blog.kata.academy/api/articles?limit=5&offset=${pageNumber}`)
      .then(({ data }) => data)
      .catch((error) => rejectWithValue(error));
  }
);

export const getArticleItem = createAsyncThunk(
  'articlesSlice/getArticleItem',
  async ({ slug }, { rejectWithValue, dispatch }) => {
    dispatch(setIsLoading());
    return await axios
      .get(`https://blog.kata.academy/api/articles/${slug}`)
      .then((response) => dispatch(setArticleItem(response.data.article)))
      .catch((error) => rejectWithValue(error));
  }
);

export const createArticleItem = createAsyncThunk(
  'articles/createArticleItem',
  async ({ title, description, body, tagList, tokenID }, { rejectWithValue }) =>
    await axios
      .post(
        'https://blog.kata.academy/api/articles',
        {
          article: { title, description, body, tagList },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenID}`,
          },
        }
      )
      .catch((error) => rejectWithValue(error))
);

export const removeArticleItem = createAsyncThunk(
  'articles/removeArticleItem',
  async ({ slug, tokenID }, { rejectWithValue }) =>
    await axios
      .delete(`https://blog.kata.academy/api/articles/${slug}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenID}`,
        },
      })
      .then((response) => response)
      .catch((error) => rejectWithValue(error))
);

export const updateArticleItem = createAsyncThunk(
  'articles/updateArticleItem',
  async ({ slug, title, description, body, tagList, tokenID }, { rejectWithValue }) =>
    await axios
      .put(
        `https://blog.kata.academy/api/articles/${slug}`,
        {
          article: { title, description, body, tagList },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenID}`,
          },
        }
      )
      .catch((error) => rejectWithValue(error))
);

export const favoriteArticle = createAsyncThunk(
  'articles/favoriteArticle',
  async ({ slug, tokenID }, { rejectWithValue }) =>
    await axios
      .post(
        `https://blog.kata.academy/api/articles/${slug}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenID}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .catch((error) => rejectWithValue(error))
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    articlesCount: 0,
    articleItem: [],
    pageNumber: 1,
    isLoading: true,
    tagList: [],
  },
  reducers: {
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setArticleItem: (state, action) => {
      state.articleItem = action.payload;
      state.isLoading = !state.isLoading;
    },
    setIsLoading: (state) => {
      state.isLoading = !state.isLoading;
    },
    setTagList: (state, action) => {
      state.tagList = Array.from(new Set([...state.tagList, action.payload]));
    },
    removeTagList: (state, action) => {
      state.tagList = state.tagList.filter((tag) => tag !== action.payload);
    },
    clearTagList: (state) => {
      state.tagList = [];
    },
    setIsEditTagList: (state) => {
      state.tagList = [...state.articleItem.tagList];
    },
  },
  extraReducers: {
    [getArticles.fulfilled]: (state, action) => {
      state.articles = [...action.payload.articles];
      state.isLoading = false;
      state.articlesCount = action.payload.articlesCount;
    },
    [createArticleItem.rejected]: (state, action) => {
      alert(JSON.stringify(action.payload));
    },
  },
});

export const {
  setPageNumber,
  setArticleItem,
  setIsLoading,
  setTagList,
  removeTagList,
  clearTagList,
  setIsEditTagList,
} = articlesSlice.actions;
export default articlesSlice.reducer;
