import React from 'react';
import { connect } from 'react-redux';
import { 
  AsyncStorage, 
  TouchableHighlight, 
  ActivityIndicator, 
  FlatList, 
  StyleSheet, 
  View, 
  Text,
  RefreshControl
} from 'react-native';
import Style from '../styles/Style';
import YelpItem from './YelpItem';
import { 
  DEFAULT_OPTIONS, 
  NotificationFrequency 
} from '../actions/Actions';
import BackgroundManager, { BackgroundRefreshComplete } from '../lib/BackgroundManager';
import { 
  scheduleNotification, 
  tomorrowAt11, 
  nextFridayAt11, 
  nextMonthAt11, 
  clearNotifications, 
  setApplicationIconBadgeNumber 
} from '../lib/Notifications';
import PropTypes from 'prop-types';

const URL = 'https://api.yelp.com/v3/businesses/search';
const APIKey = 'MnlK3hv6UqsUvUMlXIlTWrhcO97O7OhKdm8QllIFGQFIw6cJtEujVMYyDqdp5xiRYEZdQb53YCJvuDfhTw2i7_lXHROM-1EaD_IBdD6FyH_D1mHwXFH7YH3CyqEPW3Yx';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      refreshing: false
    };
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this._request(() => {
      this.setState({refreshing: false});
    });
  }

  componentDidMount() {
    clearNotifications();
    this._location();

    const { saveKey } = this.props;

    if (!saveKey) {
      return;
    }

    AsyncStorage.getItem(saveKey + ':businesses').then((json) => {
      if (json !== null) {
        this.setState({ 
          businesses: JSON.parse(json), 
          isLoading: false 
        });
      }
    })

    AsyncStorage.getItem(saveKey + ':location').then((json) => {
      if (json !== null) {
        const location = JSON.parse(json);
        this.setState({ 
          longitude: location.longitude, 
          latitude: location.latitude, 
          isLoading: false 
        });
      }
    })
  }

  _location = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
        this._request();
        const { saveKey } = this.props;
        if (saveKey) {
          const location = { 
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude 
          };
          AsyncStorage.setItem(saveKey + ':location', JSON.stringify(location));
        }
      },
      (error) => this.setState({ 
        error: error.message
      }),
      { 
        enableHighAccuracy: true, 
        timeout: 20000, 
        maximumAge: 1000 
      },
    );
  }

  _request(callback = () => {}) {
    const { filter, saveKey } = this.props;
    const { latitude, longitude } = this.state;

    if (!latitude || !longitude) {
      return;
    }

    const distance = filter ? filter.distance : 40000;
    const query = `attributes=hot_and_new&limit=50&radius=${distance}&categories=restaurants&latitude=${latitude}&longitude=${longitude}`

    fetch(URL + '?' + query, {
      method: 'get', 
      headers: {
        'Authorization': 'Bearer ' + APIKey, 
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      
      throw new Error(`Can't refresh restaurants (Error ${response.status}). Please try again.`);
    })
    .then(data => {
      this.setState({ 
        businesses: data.businesses, 
        isLoading: false 
      });
      callback();
      if (saveKey) {
        AsyncStorage.setItem(saveKey + ':businesses', JSON.stringify(data.businesses));
      }
    })
    .catch(error => {
      this.setState({ 
        error, 
        isLoading: false 
      });
      console.error(error);
      callback();
    });
  }

  // Returns a list of the new businesses from the previously fetched list of businesses
  _newBusinesses = (prevBusinesses) => {
    const filteredBusinesses = this._filterBusinesses();
    prevBusinesses = new Map(prevBusinesses.map(business => [business.id, business]));
    let newBusinesses = [];

    for (i in filteredBusinesses) {
      const newBusiness = filteredBusinesses[i];
      if (!prevBusinesses.get(newBusiness.id)) {
        console.log(newBusiness.id, prevBusinesses.get(newBusiness.id));
        newBusinesses.push(newBusiness);
      }
    }

    return newBusinesses;
  }

  _onBackgroundFetch = (completion) => {
    const prevBusinesses = this.state.businesses;
    this._request(() => {
      const { error } = this.state;

      if (error) {
        completion(BackgroundRefreshComplete.FAILED);
        return;
      }

      let newBusinesses = this._newBusinesses(prevBusinesses);

      if (newBusinesses.length == 0) {
        completion(BackgroundRefreshComplete.NODATA);
        return;
      }

      setApplicationIconBadgeNumber(newBusinesses.length);

      const lastBusiness = newBusinesses.pop();
      const title = 'New Food Near You!'
      let body = 'Check out ';
      if (newBusinesses.length > 0) {
        const names = newBusinesses.map(business => business.name).join(', ') + ' & ';
        body += names;
      }
      body += lastBusiness.name;

      clearNotifications();

      const { notifications } = this.props;
    
      switch (notifications) {
        case NotificationFrequency.DAILY:
          scheduleNotification(title, body, tomorrowAt11());
          break;

        case NotificationFrequency.WEEKLY:
          scheduleNotification(title, body, nextFridayAt11());
          break;

        case NotificationFrequency.MONTHLY:
          scheduleNotification(title, body, nextMonthAt11());
          break;
      }

      completion(BackgroundRefreshComplete.NEWDATA);
    });
  }

  // Returns a list of businesses after applying the current filter requirements.
  _filterBusinesses = () => {
    const { businesses } = this.state;
    const { filter } = this.props;

    if (!businesses || !filter) {
      return null;
    }
    
    const reviews = filter.reviews || DEFAULT_OPTIONS.filter.reviews;
    const stars = filter.stars || DEFAULT_OPTIONS.filter.stars;
    const price = filter.price || DEFAULT_OPTIONS.filter.price;

    return businesses.filter(business => {
      return business.review_count >= reviews && 
      business.rating >= stars &&
      (JSON.stringify(price) == JSON.stringify(Array(4).fill(false)) ? 
        true :
        (business.price ? price[business.price.length - 1] : false)
      )
    });
  }

  render() {
    const { isLoading, error, latitude, longitude, businesses } = this.state;
    const filteredBusinesses = this._filterBusinesses()

    if (filteredBusinesses && filteredBusinesses.length > 0) {
      const { onPress } = this.props;
      return (
        <BackgroundManager onBackgroundFetch={(completion) => this._onBackgroundFetch(completion)}>
          <FlatList refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            style={styles.list}
            data={filteredBusinesses}
            renderItem={({item}) => 
              <View style={Style.containerWhite}>
                <TouchableHighlight underlayColor={Style.colors.highlightColor} onPress={() => onPress(item)}>
                  <YelpItem item={item} />
                </TouchableHighlight>
              </View>
            }
            ItemSeparatorComponent={() => <View style={Style.listBorder} />}
            keyExtractor={(item, index) => item.id}
          />
        </BackgroundManager>
      );
    }

    if (isLoading) {
      return (
        <View style={Style.containerCenterXY}>
          <Text style={Style.textTitle}><ActivityIndicator />
            {!latitude || !longitude ? ' Fetching location...' : ' Fetching Hot & New...'}
          </Text>
        </View>
      );
    }

    let noResults = null;
    if (error) {
      noResults = error.message;
    } else {
      noResults = 'No Restaurants Found' + (businesses.length > 0 ? '\n(' + businesses.length + ' Filtered)' : '');
    }

    return (
      <View style={Style.containerCenterXY}>
        <Text style={[Style.textTitle, {textAlign: 'center'}]}>{noResults}</Text>;
        <View style={Style.button}>
          <TouchableHighlight underlayColor={Style.colors.highlightColor} onPress={() => this._location()}>
            <Text style={Style.textButton}>Refresh</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

HomeView.defaultProps = {
  saveKey: 'yelp'
};

HomeView.propTypes = {
  saveKey: PropTypes.string,
  onPress: PropTypes.func
};

const mapStateToProps = (state) => ({
  filter: state.filter,
  notifications: state.notifications
});

export default connect(mapStateToProps)(HomeView);

const styles = StyleSheet.create({
  list: {
    overflow: 'visible',
  }
});