import React from 'react';
import { 
  WebView, 
  View,
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

  _onLoadStart = (event) => {
    const { didLoadEnd } = this.state;
    const { url } = this.props;

    if (didLoadEnd) {
      this.webview.stopLoading();
      this.props.onPress(url);
    }
  }

  _onShouldStartLoadWithRequest = (event) => {
    const { didLoadEnd } = this.props;

    this.props.url = event.url;
    return !didLoadEnd;
  }

  render() {
    const { url } = this.props;

    return (
      <WebView 
        style={{backgroundColor: Style.colors.clearBackgroundColor}}
        ref={(ref) => this.webview = ref }
        source={{uri: url}} 
        onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
        onLoadEnd={() => this.setState({ didLoadEnd: true }) }
        onLoadStart={(event) => this._onLoadStart(event) }
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