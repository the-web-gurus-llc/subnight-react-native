import { put, select, all, call } from 'redux-saga/effects'

import UserActions from './../Stores/User/Actions'
import NavigationService from './../Services/NavigationService'
import { apiManager } from '../Network/ApiManager';

export function* fetchAllInformation(action) {
	const { access_token } = action;
	console.log("fetch all information access token -> ", access_token);
	yield put(UserActions.fetchUserLoading());

	try{
		const [profileRes, clubsRes] =
			yield all([
				call(apiManager.accountGetProfile, access_token),
				call(apiManager.accountGetClubs, access_token),
			]);

		const user = { 
			profile: profileRes.data.data,
			clubs: clubsRes.data.data,
		};

		console.log("fetch all information profile -> ", user.profile);

		yield put(UserActions.fetchUserSuccess(user));

		NavigationService.navigate('Home');
		return
	}catch(err){
		NavigationService.navigate('Auth');
	}
	yield put(UserActions.fetchUserFailure(''))
}
