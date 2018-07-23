import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  ActivityIndicator 
} from 'react-native';

export default class ImageLoadingView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      opacity: new Animated.Value(0)
    };
  }

  onLoad = () => {
    const { opacity } = this.state;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000
    }).start(event => {
      this.setState({ isLoading: false })
    });
  }

  render() {
    const { opacity, isLoading } = this.state;
    const { source, style } = this.props;

    return (
      <View style={[style, {overflow: 'hidden'}]}>
        <ActivityIndicator animating={isLoading} style={styles.indicator}/>
        <Animated.Image
          resizeMode={'cover'}
          style={{flex: 1, opacity: opacity}}
          source={source} // TODO: Queue image loading to prevent possible thread starvation?
          onLoad={this.onLoad}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    indicator: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0
    }
})