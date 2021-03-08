import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  // Fetch user informations
  fetchAllInformation:['access_token'],
  // The operation has started and is loading
  fetchUserLoading: null,
  // User informations were successfully fetched
  fetchUserSuccess: ['user'],
  // An error occurred
  fetchUserFailure: ['errorMessage'],
  fetchIntroduction: ['todayMUsers'],
});

export const UserActionTypes = Types;
export default Creators
