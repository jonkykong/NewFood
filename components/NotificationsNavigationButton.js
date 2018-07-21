import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import Style from '../styles/Style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NotificationFrequency } from '../actions/Actions';

class NotificationsNavigationButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Icon name={this.props.notifications == NotificationFrequency.NONE ? 'bell-outline' : 'bell-ring-outline'} style={Style.navigationButton} />
      </TouchableOpacity>
    );
  }
}

export const NavigationButton = (iconName, onPress) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={iconName} style={Style.navigationButton} />
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps)(NotificationsNavigationButton);