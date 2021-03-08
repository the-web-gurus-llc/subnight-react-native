import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistReducer, persistStore } from 'redux-persist'
import logger from 'redux-logger'
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  /**
   * TODO blacklist clean.
   */
  blacklist: [
    'user',
    'example'
  ],
  timeout: null
};

const persistStoreConfig = {
  blacklist: ['user', 'example'],
};

export default (rootReducer, rootSaga) => {
  const middleware = [];
  const enhancers = [];

  // Connect the sagas to the redux store
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  enhancers.push(applyMiddleware(...middleware, logger));

  // Redux persist
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, compose(...enhancers));
  const persistor = persistStore(store, null, ()=>{
  });

  // Kick off the root saga
  sagaMiddleware.run(rootSaga);

  return { store, persistor }
}
