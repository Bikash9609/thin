import Axios from 'axios';
import {BASE_URL, PAGE_SIZE, DEFAULT_HEADERS} from '../constants/Constants';
const NAMESPACE = 'news';

const FETCH_NEWS_LOADING = 'FETCH_NEWS_LOADING';
const FETCH_NEWS_SUCCESS = 'FETCH_NEWS_SUCCESS';
const FETCH_NEWS_FAILED = 'FETCH_NEWS_FAILED';

const SET_CURRENT_SLIDE_INDEX = 'SET_CURRENT_SLIDE_INDEX';
const SET_WEBVIEW_VISIBILITY = 'SET_WEBVIEW_VISIBILITY';
const SET_QUERY = 'SET_QUERY';

const initialState = {
  query: 'india',
  isLoading: false,
  currentPage: 1,
  newsList: [],
  currentSlideIndex: 0,
  isWebViewVisible: false,
};

const reducer = (state = initialState, action) => {
  if (action.namespace !== NAMESPACE) {
    return {...state};
  }

  switch (action.type) {
    case FETCH_NEWS_LOADING: {
      return {...state, isLoading: true};
    }
    case FETCH_NEWS_SUCCESS: {
      const {result, page} = action;
      const {newsList} = state;
      const updatedNewsList =
        page === 1 ? [...result] : [...newsList, ...result];
      return {...state, isLoading: false, newsList: updatedNewsList, currentPage: page};
    }
    case SET_CURRENT_SLIDE_INDEX: {
      const {index} = action;
      return {...state, currentSlideIndex: index};
    }
    case SET_WEBVIEW_VISIBILITY: {
      const {isWebViewVisible} = action;
      return {...state, isWebViewVisible};
    }
    case SET_QUERY: {
      const {query} = action;
      return {...state, query};
    }
    default: {
      return {...state, isLoading: false};
    }
  }
};

export default reducer;

export const fetchNewsList = (query, page) => {
  return dispatch => {
    dispatch({type: FETCH_NEWS_LOADING, namespace: NAMESPACE});
    let URL = `${BASE_URL}?q=${query}&pageSize=${PAGE_SIZE}&page=${page}`;

    Axios.get(URL, DEFAULT_HEADERS)
      .then(res => {
        console.log("__res", query, page, res.data);
        dispatch({
          type: FETCH_NEWS_SUCCESS,
          namespace: NAMESPACE,
          result: res.data.articles,
          page,
        });
      })
      .catch(err => {
        console.log("__err", err);
        dispatch({
          type: FETCH_NEWS_FAILED,
          namespace: NAMESPACE,
        });
      });
  };
};

export const setCurrentSlideIndex = index => {
  return {
    type: SET_CURRENT_SLIDE_INDEX,
    namespace: NAMESPACE,
    index,
  };
};

export const setWebViewVisiblity = flag => {
  return {
    type: SET_WEBVIEW_VISIBILITY,
    namespace: NAMESPACE,
    isWebViewVisible: flag,
  };
};

export const setQuery = query => {
  return {
    type: SET_QUERY,
    namespace: NAMESPACE,
    query,
  };
};
