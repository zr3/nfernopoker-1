import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from './core/store/configureStore';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import * as firebase from "firebase";

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState;
const store = configureStore(history, initialState);

const rootElement = document.getElementById('root');


// react-redux-firebase options
const rrfConfig = {
  userProfile: 'users', // firebase root where user profiles are stored
  presence: 'presence', // where list of online users is stored in database
  sessions: 'sessions', // where list of user sessions is stored in database (presence must be enabled)
  attachAuthIsReady: true, // attaches auth is ready promise to store
  enableLogging: true, // enable/disable Firebase's database logging
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
}


ReactDOM.render(
  <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
      </ReactReduxFirebaseProvider>
  </Provider>,
  rootElement);

registerServiceWorker();
