import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
  View,
  Text
} from 'react-native';
import Style from '../styles/Style';
import { 
  updateNotifications, 
  NotificationFrequency 
} from '../actions/Actions';
import { requestNotificationPermissions } from '../lib/Notifications';
import { 
  minimumBackgroundFetchInterval, 
  backgroundRefreshPermission, 
  BackgroundRefreshPermission 
} from '../lib/BackgroundManager';
import StyledSectionList from './StyledSectionList';

class NotificationsView extends React.Component {
  constructor(props) {
    super(props);

    const { notifications } = this.props;

    this.state = {
      notifications: notifications
    };
  }

  componentDidUpdate() {
    const { notifications } = this.state;

    if (notifications != NotificationFrequency.NONE) {
      requestNotificationPermissions().then((permissions) => {
        if (permissions.alert == 0) {
          this.setState({ notifications: NotificationFrequency.NONE });
        }

        backgroundRefreshPermission((status) => {
          if (status !== BackgroundRefreshPermission.AVAILABLE) {
            this.setState({ notifications: NotificationFrequency.NONE });
          }
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  onSave() {
    const { notifications } = this.state;

    const dayInterval = 60 * 60 * 24 * 0.5;
    const intervals = [
      0,
      dayInterval,
      dayInterval * 7,
      dayInterval * 30
    ];

    minimumBackgroundFetchInterval(intervals[notifications]);

    this.props.updateNotifications(notifications);

    AsyncStorage.setItem('notifications', JSON.stringify({ notifications })).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <StyledSectionList 
        sections={[
          {
            title: 'Frequency',
            data: [
              'None',
              'Daily at 11',
              'Fridays at 11',
              'Every 1st of the Month'
            ],
            footer: 'Notifications will show only when new restaurants appear that meet your filter settings.'
          }
        ]}
        renderItem={({ item, index, section }) => {
            const { notifications } = this.state;

            return (
              <TouchableHighlight 
                underlayColor={Style.colors.highlightColor}
                style={[Style.listItem]}
                onPress={() => this.setState({notifications: index})}
                >
                <View style={styles.textSpacedContainer}>
                  <Text style={Style.listItemText} key={index}>{item}</Text>{notifications == index ? <Text style={styles.textCheckmark}>✓</Text> : null}
                </View>
              </TouchableHighlight>
            );
          }
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notifications
});

const mapDispatchToProps = (dispatch) => ({
  updateNotifications: (frequency) => dispatch(updateNotifications(frequency))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(NotificationsView);

const styles = StyleSheet.create({
  textSpacedContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textCheckmark: {
    color: Style.colors.selectionColor,
    fontSize: Style.fontSizes.title,
    fontWeight: 'bold'
  }
})
