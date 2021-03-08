

import { put, select, call, all } from 'redux-saga/effects'
import NavigationService from './../Services/NavigationService'

import StartupActions from './../Stores/Startup/Actions'
import Geolocation from "react-native-geolocation-service";
import firebase from "react-native-firebase";

const getStartup = (state) => state.startup;

export function* startup() {
  //yield put(ExampleActions.fetchUser())
  let fcmtoken="",latitude=1.33055, longitude=103.8427;
  try{

    fcmtoken = yield firebase.messaging().getToken();

    const location = yield getPosition();
  	latitude = location.coords.latitude;
    longitude = location.coords.longitude;

  }catch(err){
    console.log("startup error -> ", err);
  }

    console.log("startup sagas -> ");
    console.log("fcm token -> ", fcmtoken);
    console.log("latitude -> ", latitude);
    console.log("longitude -> ", longitude);

  	const data = { fcmtoken, latitude, longitude };
    yield put(StartupActions.startSuccess(data) );

  	let startup = yield select(getStartup);
    const userToken = startup.userToken;

    console.log("user token -> ", userToken);
    NavigationService.navigate('Auth')

  	if (userToken !== null) {
      console.log("move to home.")
  		NavigationService.navigate('WelcomeFirst')
  	}else{
      console.log("move to auth and reset all.")
      // NavigationService.navigateAndReset('Auth')
      NavigationService.navigate('Auth')
    }

}


var getPosition = function (options) {
  return new Promise(function (resolve, reject) {
  	Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
  });
};


// export const setPermissions = function*() {
//   try {
//     const custom = yield call(requestPermission, [
//       PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//     ]);
//     yield all(
//       custom.map(item => {
//         if (Object.values(item)[0] === PermissionsAndroid.RESULTS.GRANTED) {
//           return put({ type: types.PERMISSIONS_SUCCESS, payload: item });
//         }
//         return put({ type: types.PERMISSIONS_REJECTED, payload: item });
//       })
//     );
//   } catch (err) {
//     return err;
//   }
//   return true;
// };

// const requestPermission = async requestedType => {
//   try {
//     const granted = await PermissionsAndroid.requestMultiple(requestedType);
//     const access = Object.keys(granted).map(item => {
//       const name = item.split('.').slice(-1)[0];
//       const revObj = {};
//       revObj[name] = granted[item];
//       AsyncStorage.mergeItem('permissions', JSON.stringify(revObj));
//       return revObj;
//     });
//     return access;
//   } catch (e) {
//     return e;
//   }
// };
