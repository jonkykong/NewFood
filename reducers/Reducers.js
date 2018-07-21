import {
  combineReducers
} from 'redux';
// import { RootStack, MainStack, OptionsStack } from './AppNavigator'
import { Update } from '../actions/Actions';

// const rootStackReducer = createNavigationReducer(RootStack);
// const mainStackReducer = createNavigationReducer(MainStack);
// const optionsStackReducer = createNavigationReducer(OptionsStack);

export function filter(state = null, action) {  
  switch (action.type) {
    case Update.FILTER: 
      return action.filter;
    default:
      return state;
  }
}

export function notifications(state = null, action) {
  switch (action.type) {
    case Update.NOTIFICATIONS:
      return action.notifications;
    default:
      return state;
  }
}

export const appReducer = combineReducers({
  filter, 
  notifications
});