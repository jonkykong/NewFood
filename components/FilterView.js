import React from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
  Slider,
  View,
  Text
} from 'react-native';
import Style from '../styles/Style';
import StarView from './StarView';
import { updateFilter } from '../actions/Actions';
import StyledSectionList from './StyledSectionList';

class FilterView extends React.Component {
  constructor(props) {
    super(props);

    const { filter } = this.props;

    this.state = {
      price: filter.price,
      stars: filter.stars,
      reviews: filter.reviews,
      distance: filter.distance
    };
  }

  onSave() {
    const { price, stars, reviews, distance } = this.state;

    this.props.updateFilter(price, stars, reviews, distance);

    const filter = { price, stars, reviews, distance };

    AsyncStorage.setItem('filter', JSON.stringify({ filter })).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <StyledSectionList
        sections={[
          {
            data: [
              'Price',
              'Stars',
              'Reviews',
              'Distance'
            ]
          }
        ]}
        renderItem={({ item, index, section }) => {
            const { stars, reviews, distance, price } = this.state;

            switch (item) {
              case 'Price':
                return (
                  <View style={[Style.listItem, styles.customListItem]}>
                    {
                      ['$', '$$', '$$$', '$$$$'].map((item, key) =>
                        <TouchableHighlight 
                          underlayColor={'#007aff'} 
                          key={key} 
                          style={[
                            styles.buttonOption, 
                            (key < 3 ? styles.buttonOptionBorder : null),
                            {backgroundColor: (price[key] ? '#007aff' : null)}
                          ]} 
                          onPress={() => this.setState({price: price.map((item, index) => (index == key ? !price[index] : price[index]))})}
                          >
                          <View style={Style.containerCenterXY}>
                            <Text style={[Style.listItemText, {color: (price[key] ? Style.colors.selectionTextColor : Style.colors.textColor)}]}>{item}</Text>
                          </View>
                        </TouchableHighlight>
                      )
                    }
                  </View>
                );
              case 'Stars':
                return slider(() => (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={Style.listItemText}>Stars: </Text>
                      <StarView value={stars}/>
                    <Text style={Style.listItemText}> or more</Text>
                  </View>
                ), stars, 1, 5, 0.5, (stars) => this.setState({stars}));
              case 'Reviews':
                return slider(() => (<Text style={Style.listItemText}>Reviews: {reviews} or more</Text>), reviews, 0, 200, 5, (reviews) => this.setState({reviews}));
              case 'Distance':
                return slider(() => (<Text style={Style.listItemText}>Distance: {distance / 1600} {distance / 1600 == 1 ? 'mile' : 'miles'} or less</Text>), distance, 800, 40000, 800, (distance) => this.setState({distance}));
              default:
                return null;
            }
          }
        }
      />
    );
  }
}

const slider = (title, value, minimumValue, maximumValue, step, onValueChange) => {
  return (
    <View style={[Style.listItem, styles.sliderItem]}>
      <View style={{ flexDirection: 'row' }}>
        {title()}
      </View>
      <Slider value={value} minimumValue={minimumValue} maximumValue={maximumValue} step={step} onValueChange={(value) => onValueChange(value)}/>
    </View>
  );
}

const mapStateToProps = (state, ownProps) => ({
  filter: state.filter
});

const mapDispatchToProps = (dispatch) => ({
  updateFilter: (price, stars, reviews, distance) => dispatch(updateFilter(price, stars, reviews, distance))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(FilterView);

const styles = StyleSheet.create({
  buttonOption: {
    flex: 1,
    alignItems: 'center',
  },
  buttonOptionBorder: {
    borderRightWidth: 0.5,
    borderRightColor: Style.colors.borderColor,
  },
  sliderItem: {
    height: 80
  },
  customListItem: {
    flexDirection: 'row',
    paddingHorizontal: 0,
    paddingVertical: 0,
  }
})
