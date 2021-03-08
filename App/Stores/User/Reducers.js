import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { UserActionTypes } from './Actions'

export const fetchUserLoading = (state) => ({
  ...state,
  isLoading: true,
  errorMessage: null,
});

export const fetchUserSuccess = (state, { user }) => ({
  ...state,
  ...user,
  isLoading: false,
  errorMessage: null,
});

export const fetchUserFailure = (state, { errorMessage }) => ({
  ...state,
  user: {},
  isLoading: false,
  errorMessage: errorMessage,
});

export const fetchIntroduction = (state, { todayMUsers }) => ({
  ...state,
  todayMUsers,
});

export const reducer = createReducer(INITIAL_STATE, {
  [UserActionTypes.FETCH_USER_LOADING]: fetchUserLoading,
  [UserActionTypes.FETCH_USER_SUCCESS]: fetchUserSuccess,
  [UserActionTypes.FETCH_USER_FAILURE]: fetchUserFailure,
  [UserActionTypes.FETCH_INTRODUCTION]: fetchIntroduction,
});
