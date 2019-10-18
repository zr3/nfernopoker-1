import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { firebaseReducer, getFirebase } from 'react-redux-firebase';
import { } from 'react-redux-firebase'
import * as firebase from "firebase";
import * as SnackMessage from "../actions/SnackMessage";

export default function configureStore(history: any, initialState: any) {

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBGLY2OiLI-vcmE5Y8N0pLG5_b2Tn9nlyE",
    authDomain: "nfernopoker.firebaseapp.com",
    databaseURL: "https://nfernopoker.firebaseio.com",
    messagingSenderId: "1013092913351",
    projectId: "nfernopoker",
    storageBucket: ""
  };

  // Initialize firebase instance
  firebase.initializeApp(firebaseConfig)

  const reducers = {
    snacks: SnackMessage.reducer
  };

  const middleware = [
    thunk.withExtraArgument(getFirebase),
    routerMiddleware(history)
  ];

  // In development, use the browser's Redux dev tools extension if installed
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment && typeof window !== 'undefined' && (window as any).devToolsExtension) {
    enhancers.push((window as any).devToolsExtension());
  }

  const rootReducer = combineReducers({
    ...reducers,
    firebase: firebaseReducer,
    routing: routerReducer
  });

  // Create store with reducers and initial state

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );

  return store;
}
