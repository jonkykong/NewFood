import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text 
} from 'react-native';
import ImageLoadingView from '../components/ImageLoadingView';
import Style from '../styles/Style';
import StarView from '../components/StarView';

export default class YelpItem extends React.PureComponent {
  render() {
    const { item } = this.props;

    if (!item) {
        return null;
    }

    return (
        <View style={Style.listImageItem}>
        <ImageLoadingView source={{uri: item.image_url}} style={styles.itemImage} />
        <View style={Style.containerCenterY}>
        <View style={styles.textSpacedContainer}>
            <Text style={[Style.textTitle, Style.container]} numberOfLines={1}>{item.name}</Text>
            {item.price ? 
            <Text style={[Style.textDetail, Style.paddingL]} numberOfLines={1} ellipsizeMode='clip'>{item.price}</Text> :
            <Text style={[Style.textDetail, Style.paddingL]} numberOfLines={1} ellipsizeMode='clip'>{(item.distance / 1609.34).toFixed(1) + ' mi'}</Text>
            }
        </View>
        {<View style={styles.textSpacedContainer}>
            <StarView value={item.rating} />
            <Text style={[Style.textBody, Style.container]} numberOfLines={1}>{' ' + item.review_count + ' Reviews'}</Text>
            {item.price ? 
            <Text style={[Style.textDetail, Style.paddingL]} numberOfLines={1} ellipsizeMode='clip'>{(item.distance / 1609.34).toFixed(1) + ' mi'}</Text> : 
            null
            }
        </View>}
        <Text style={Style.textBody} numberOfLines={1} >{
            item.categories.map((item, key) => (item.title)).reduce((prev, curr) => [prev, ', ' + curr])
            }</Text>
        <Text style={Style.textDetail} numberOfLines={1} >{item.location.address1 + (item.location.city ? ', ' + item.location.city : '')}</Text>
        </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textSpacedContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemImage: {
    aspectRatio: 1,
    height: Style.layout.height.listImageItem - Style.layout.padding.default * 2,
    marginRight: Style.layout.padding.default,
    borderRadius: Style.borderRadius,
    backgroundColor: Style.colors.clearBackgroundColor
  }
})