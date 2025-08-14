import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface Category {
  name: string;
  imageUrl?: string;
}

interface CategorySidebarProps {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({categories, selected, onSelect}) => {
  console.log("CategorySidebar :", categories, selected)
  return (
    <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
      {categories.map(cat => {
        const isSelected = selected === cat.name;
        console.log(cat ,": cat.imageUrl")

        return (
          <TouchableOpacity
            key={cat.name}
            onPress={() => onSelect(cat.name)}
            style={styles.itemWrapper}
          >
            <View style={styles.row}>
              <View
                style={[
                  styles.item,
                  isSelected && styles.activeItem,
                ]}>
                <View
                  style={[
                    styles.imageWrapper,
                    isSelected ? styles.roundedSquare : styles.circle,
                  ]}>
                  <Image source={{uri : cat.imageUrl}} style={styles.image} />
                </View>
                <Text style={[styles.text, isSelected && styles.activeText]}>
                  {cat.name}
                </Text>
              </View>
              {isSelected && <View style={styles.indicator} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: Colors.white,
  },
  itemWrapper: {
    paddingVertical: hp(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: wp(1.2),
    height: '100%',
      backgroundColor: Colors.primary,
    borderTopLeftRadius: wp(1.5),
    borderBottomLeftRadius: wp(1.5),
    marginLeft: wp(1),
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(1),
  },
  activeItem: {
    borderTopRightRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  imageWrapper: {
    position: 'relative',
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    overflow: 'hidden',
    backgroundColor: Colors.greyBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedSquare: {
    borderRadius: wp(4),
  },
  circle: {
    borderRadius: wp(6.5),
  },
  image: {
    width: wp(9.6),
    height: wp(9.6),
    resizeMode: 'contain',
  },
  text: {
    fontSize: sp(13),
    marginTop: hp(0.8),
    textAlign: 'center',
    color: Colors.black,
  },
  activeText: {
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default CategorySidebar;
