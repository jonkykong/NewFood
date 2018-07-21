import React from 'react';
import { 
  StatusBar, 
  SafeAreaView
} from 'react-native';
import Style from '../styles/Style';
import HomeView from '../components/HomeView';
import { Navigate } from '../navigators/AppNavigator';
import NotificationsNavigationButton, { NavigationButton } from '../components/NotificationsNavigationButton';

export default class HomeScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'NewFood',
      ...Style.navigation,
      headerLeft: <NotificationsNavigationButton onPress={() => navigation.navigate(Navigate.NOTIFICATIONS) } />,
      headerRight: NavigationButton('filter-outline', () => navigation.navigate(Navigate.FILTER))
    }
  };

  render() {
    return (
      <SafeAreaView style={Style.container}>
        <StatusBar barStyle="light-content"/>
        <HomeView onPress={(item) => this.props.navigation.navigate('Detail', {url: item.url, title: item.name})} />
      </SafeAreaView>
    );
  }
}