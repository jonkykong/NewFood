import React from 'react';
import { 
  WebView, 
  Linking, 
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import Style from '../styles/Style';

export default class DetailScreen extends React.PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: `${navigation.state.params.title}`,
      ...Style.navigation
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      didLoadEnd: false,
    };
  }

  onShouldStartLoadWithRequest = (event) => {
    const { didLoadEnd } = this.state;

    if (didLoadEnd === false) {
      return true;
    }

    Linking.openURL(event.url);
    return false;
  }

  render() {
    const { navigation } = this.props;
    const url = navigation.getParam('url');

    return (
      <WebView 
        style={{backgroundColor: Style.colors.clearBackgroundColor}}
        ref={(ref) => this.webview = ref }
        source={{uri: url}} 
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        onLoadEnd={() => setTimeout(() => {this.setState({ didLoadEnd: true })}, 1)}
        startInLoadingState={true}
        renderLoading={ () => {
            return (
              <View style={Style.containerCenterXY}>
                <Text style={Style.textTitle}><ActivityIndicator />{' Hang on...'}</Text>
              </View>
            );
          }
        }
      />
    );
  }
}