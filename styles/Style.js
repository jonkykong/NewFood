import { StyleSheet } from 'react-native';

const borderRadius = 8;

export const padding = {
  default: 8,
  horizontal: 15
}

export const height = {
  listImageItem: 84,
  listItem: 44,
  listBlankSection: 15,
  listSection: 55,
}

export const colors = {
  themeColor: '#d32323',
  themeTextColor: 'white',
  textColor: 'black',
  detailTextColor: 'gray',
  backgroundColor: 'white',
  clearBackgroundColor: 'lightgray',
  highlightColor: 'lightgray',
  selectionColor: '#007aff',
  selectionTextColor: 'white',
  borderColor: 'lightgray'
};

export const fontSizes = {
  body: 14,
  title: 17
}; 

export const navigation = {
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: colors.themeColor
  },
  headerBackTitle: ' '
};

const Style = StyleSheet.create({

  // CONTAINERS
  container: {
    flex: 1,
  },
  containerWhite: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  containerCenterXY: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  containerCenterY: {
    flex: 1,
    justifyContent: 'center' 
  },

  // TEXT
  textTitle: {
    fontSize: fontSizes.title,
  },
  textBody: {
    fontSize: fontSizes.body,
  },
  textDetail: {
    fontSize: fontSizes.body,
    color: colors.detailTextColor,
  },

  // SPACING
  paddingXY: {
    padding: padding.default
  },
  paddingX: {
    paddingHorizontal: padding.default
  },
  paddingL: {
    paddingLeft: padding.default,
  },

  // LISTS
  listImageItem: {
    flex: 1,
    flexDirection: 'row',
    height: height.listImageItem,
    padding: padding.default
  },
  listItem: {
    flex: 1,
    justifyContent: 'center',
    height: height.listItem,
    paddingHorizontal: padding.horizontal,
    paddingVertical: padding.default,
    backgroundColor: colors.backgroundColor
  },
  listSectionHeader: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: height.listSection,
    padding: padding.default
  },
  listSectionFooter: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: padding.default
  },
  listBlankSection: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: height.listBlankSection,
    padding: padding.default
  },
  listBorder: {
    backgroundColor: colors.borderColor,
    height: 0.5
  },
  listSectionHeaderTitle: {
    fontSize: fontSizes.title,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: fontSizes.title,
  },

  // BUTTONS
  button: {
    alignItems: 'center', 
    margin: padding.default,
    borderRadius: borderRadius,
    backgroundColor: colors.themeColor,
    overflow: 'hidden'
  },
  navigationButton: {
    color: colors.themeTextColor,
    fontSize: 22,
    margin: padding.default
  },
  textButton: {
    fontSize: fontSizes.title,
    color: colors.themeTextColor,
    padding: padding.default
  },
  textNavigationButton: {
    color: colors.themeTextColor,
    fontSize: fontSizes.title,
    paddingHorizontal: padding.horizontal
  },
  textDefaultNavigationButton: {
    fontWeight: 'bold',
    color: colors.themeTextColor,
    fontSize: fontSizes.title,
    paddingHorizontal: padding.horizontal
  },
});

Style.colors = colors;
Style.navigation = navigation;
Style.fontSizes = fontSizes;
Style.layout = {
  padding,
  height
}
Style.borderRadius = borderRadius;

export default Style;