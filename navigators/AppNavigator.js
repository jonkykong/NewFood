import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen'
import DetailScreen from '../screens/DetailScreen'
import OptionsScreen from '../screens/OptionsScreen';
import FilterView from '../components/FilterView';
import NotificationsView from '../components/NotificationsView';

export const Navigate = {
  MAIN: 'Main',
  FILTER: 'Filters',
  NOTIFICATIONS : 'Notifications',
  DETAIL: 'Detail'
};

export const MainStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailScreen }
});

export const FilterStack = createStackNavigator({
  Filters: { 
    screen: OptionsScreen,
    navigationOptions: {
      title: 'Filters'
    }
  }
},{
  initialRouteParams: {
    component: FilterView
  }
});

export const NotificationsStack = createStackNavigator({
  Notifications: { 
    screen: OptionsScreen,
    navigationOptions: {
      title: 'Notifications'
    }
  }
},{
  initialRouteParams: {
    component: NotificationsView
  }
});

export const RootStack = createStackNavigator({
  Main: { screen: MainStack },
  Filter: { screen: FilterStack },
  Notifications: { screen: NotificationsStack }
},{
  mode: 'modal',
  headerMode: 'none'
});