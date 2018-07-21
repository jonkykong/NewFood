import React from 'react';
import Style from '../styles/Style';
import { NavigationButton } from '../components/NotificationsNavigationButton';
import { Navigate } from '../navigators/AppNavigator';

export default class OptionsScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      ...Style.navigation,
      headerLeft: NavigationButton('window-close', () => navigation.state.params.close()),
      headerRight: NavigationButton('check', () => navigation.state.params.save())
    }
  };

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({ 
      save: this._save,
      close: this._close
    });
  }

  _save = () => {
    this.component.wrappedInstance.onSave();
    this._close();
  }

  _close = () => {
    const { navigation } = this.props;
    navigation.navigate(Navigate.MAIN)
  }

  render() {
    const { navigation } = this.props;
    const Component = navigation.getParam('component')
    return (
      <Component ref={ref => this.component = ref} />
    );
  }
}
