import React from 'react';
import { 
  StyleSheet,
  View, 
  Image 
} from 'react-native';
import Style from '../styles/Style';
import PropTypes from 'prop-types';

export default class StarView extends React.PureComponent {
  render() {
    const { value, style } = this.props;

    if (!value) {
      return null;
    }

    let stars = [];
    for (let i = 0; i < value - 0.5; i++) {
      stars.push(<Image key={i} source={require('../images/star-full.png')} style={styles.starImage} />)
    }
    if (value % 1 == 0.5) {
      stars.push(<Image key={0.5} source={require('../images/star-half.png')} style={styles.starImage} />)
    }
    for (let i = value; i < 4.5; i++) {
      stars.push(<Image key={i} source={require('../images/star-empty.png')} style={styles.starImage} />)
    }

    return (
      <View style={[style, { flexDirection: 'row' }]}>
        {stars}
      </View>
    );
  }
}

StarView.defaultProps = {
  value: 5
};

StarView.propTypes = {
  value: PropTypes.number
};

const styles = StyleSheet.create({
  starImage: {
    tintColor: Style.colors.themeColor,
    aspectRatio: 1,
    resizeMode: 'contain',
    width: null,
    height: null
  }
})