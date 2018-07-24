import React from 'react';
import { 
  WebView, 
  SafeAreaView,
  Text,
  ActivityIndicator
} from 'react-native';
import Style from '../styles/Style';

export default class DetailView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      didLoadEnd: false,
    };
  }

  _onShouldStartLoadWithRequest = (event) => {
    const { didLoadEnd } = this.state;
    
    if (didLoadEnd) {
      this.props.onPress(event.url);
      return false;
    }

    return true;
  }

  render() {
    const { url } = this.props;

    return (
      <WebView 
        style={{backgroundColor: Style.colors.clearBackgroundColor}}
        source={{uri: url}} 
        onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
        onLoadEnd={() => setTimeout(() => this.setState({ didLoadEnd: true }), 250) } // Hack: webview seems to inconsistently post load events out of order to accurately know when to start opening urls externally.
        startInLoadingState={true}
        renderLoading={ () => {
            return (
              <SafeAreaView style={Style.containerCenterXY}>
                <Text style={Style.textTitle}><ActivityIndicator />{' Hang on...'}</Text>
              </SafeAreaView>
            );
          }
        }
      />
    );
  }
}