import React from 'react';
import {
  SectionList,
  SafeAreaView,
  View,
  Text
} from 'react-native';
import Style from '../styles/Style';
import PropTypes from 'prop-types';

export default class StyledSectionList extends React.PureComponent {
  render() {
    return (
      <SafeAreaView style={Style.container}>
        <SectionList 
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: { title } }) => {
              if (!title) {
                return <View style={Style.listBlankSection} />;
              }
              return (
                <View style={Style.listSectionHeader}>
                  <Text style={Style.listSectionHeaderTitle}>{title}</Text>
                </View>
              );
            }
          }
          renderSectionFooter={({ section: { footer } }) => {
              if (!footer) {
                return;
              }
              return (
                <View style={Style.listSectionFooter}>
                  <Text style={Style.textDetail}>{footer}</Text>
                </View>
              );
            }
          }
          ItemSeparatorComponent={() => <View style={Style.listBorder} />}
          SectionSeparatorComponent={() => <View style={Style.listBorder} />}
          keyExtractor={(item, index) => item + index}
          {...this.props}
        />
      </SafeAreaView>
    );
  }
}

StyledSectionList.propTypes = {
  renderItem: PropTypes.func.isRequired,
  sections: PropTypes.array.isRequired
};