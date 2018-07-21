import React from 'react';
import { 
  View,
  Alert,
  Linking, 
  Platform
} from 'react-native';
import { 
  NativeEventEmitter, 
  NativeModules 
} from 'react-native';
import PropTypes from 'prop-types';

const { NativeBackgroundManager } = NativeModules;
const EnteredBackground = 'EnteredBackground';
const BackgroundRefreshStatusChanged = 'BackgroundRefreshStatusChanged';
const PerformFetch = 'PerformFetch';

export const BackgroundRefreshPermission = {
  AVAILABLE: 'available',
  DENIED: 'denied',
  RESTRICTED: 'restricted',
}

export const BackgroundRefreshComplete = {
  NEWDATA: 'newdata',
  NODATA: 'nodata',
  FAILED: 'failed',
}

export const backgroundRefreshPermission = (callback) => {
  NativeBackgroundManager.backgroundRefreshStatus((status) => {
    if (status === BackgroundRefreshPermission.AVAILABLE) {
      callback(status);
      return;
    }

    Alert.alert(
      'Background Permission',
      'Background refresh has not been allowed. Please enable it in Settings.',
      [
        { text: 'Cancel', onPress: () => callback(status) },
        { text: 'Settings', onPress: () => {
            callback(status);
            Platform.select({
              ios: () => Linking.openURL('app-settings:')
            })();
          }, style: 'cancel' }
      ],
      { cancelable: false }
    );
  });
};

export const minimumBackgroundFetchInterval = (refreshInterval) => {
  NativeBackgroundManager.setMinimumBackgroundFetchInterval(refreshInterval)
};

export default class BackgroundManager extends React.PureComponent {
  componentWillMount() {
    const { onEnterBackground, onBackgroundRefreshStatusChange, onBackgroundFetch, subscriptions, emitter } = this.props;
  
    if (onEnterBackground) {
      subscriptions.EnteredBackground = emitter.addListener(
        EnteredBackground,
        () => onEnterBackground()
      )
    }
    
    if (onBackgroundRefreshStatusChange) {
      subscriptions.BackgroundRefreshStatusChanged = emitter.addListener(
        BackgroundRefreshStatusChanged,
        (status) => onBackgroundRefreshStatusChange(status)
      )
    }

    if (onBackgroundFetch) {
      subscriptions.PerformFetch = emitter.addListener(
        PerformFetch,
        () => onBackgroundFetch((result) => NativeBackgroundManager.backgroundRefreshComplete(result))
      )
    }
  }

  componentWillUnmount() {
    const { subscriptions } = this.props;

    for (subscription in subscriptions) {
      subscription.remove();
    }
  }

  render() {
    return <View {...this.props} />;
  }
}

BackgroundManager.defaultProps = {
  emitter: new NativeEventEmitter(NativeBackgroundManager),
  subscriptions: {}
};

BackgroundManager.propTypes = {
  onEnterBackground: PropTypes.func,
  onBackgroundRefreshStatusChange: PropTypes.func,
  onBackgroundFetch: PropTypes.func
};