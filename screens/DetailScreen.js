import React from 'react';
import { Linking } from 'react-native';
import Style from '../styles/Style';
import DetailView from './DetailView';

export default class DetailScreen extends React.PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: `${navigation.state.params.title}`,
      ...Style.navigation
    };
  };

  render() {
    const { navigation } = this.props;
    const url = navigation.getParam('url');

    return (
      <DetailView 
        url={url}
        onPress={(url) => Linking.openURL(url)} 
      />
    );
  }
}