import { takeLatest, all } from 'redux-saga/effects'
import { StartupTypes } from './../Stores/Startup/Actions'
import { UserActionTypes } from './../Stores/User/Actions'

import { startup } from './StartupSaga'
import { fetchAllInformation } from './UserSaga'

export default function* root() {
  yield all([    
    takeLatest(StartupTypes.STARTUP, startup),    
    takeLatest(UserActionTypes.FETCH_ALL_INFORMATION, fetchAllInformation), 
  ])
}
