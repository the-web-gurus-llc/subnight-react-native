import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas'

import { reducer as ExampleReducer } from './Example/Reducers'
import { reducer as StartupReducer } from './Startup/Reducers'
import { reducer as UserReducer } from './User/Reducers'

export default () => {
  const rootReducer = combineReducers({
    
    example: ExampleReducer,
    startup: StartupReducer,
    user:UserReducer

  });

  return configureStore(rootReducer, rootSaga) 
}
