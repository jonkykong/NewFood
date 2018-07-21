// TEMPORARY UNTIL REACT 0.56
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', 
  'Class RCTCxxModule',
  'Module RCTImageLoader requires',
  'Module NativeBackgroundManager requires'
]);

import React from 'react';
import { createStore } from 'redux';
import { 
  AsyncStorage, 
  AppState 
} from 'react-native';
import { Provider } from 'react-redux';
import { appReducer } from '../reducers/Reducers'
import { RootStack } from '../navigators/AppNavigator'
import { 
  updateFilter, 
  updateNotifications, 
  DEFAULT_OPTIONS 
} from '../actions/Actions';
import { setApplicationIconBadgeNumber } from '../lib/Notifications';

const store = createStore(
  appReducer,
  // applyMiddleware(middleware),
);

AsyncStorage.multiGet(['filter', 'notifications'], (err, stores) => {
  let filter = DEFAULT_OPTIONS.filter;
  let notifications = DEFAULT_OPTIONS.notifications;

  stores.map((result, i, store) => {
    const key = store[i][0];
    const value = store[i][1];
    const saveState = JSON.parse(value);

    if (saveState) {
      switch (key) {
        case 'filter':
          filter = saveState.filter || filter;
          break;

        case 'notifications':
          notifications = saveState.notifications || notifications;
          break;
      }
    }
  });

  store.dispatch(updateFilter(filter.price, filter.stars, filter.reviews, filter.distance));
  store.dispatch(updateNotifications(notifications));
}).catch((error) => {
  console.error(error);
});

export default class Root extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      setApplicationIconBadgeNumber(0);
    }
    this.setState({ appState: nextAppState });
  }

  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}