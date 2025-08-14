import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((cat) => {
        // console.log(cat, "cat in CategoryFilter")
        return(
        <TouchableOpacity
          key={cat}
          style={[styles.button, selected === cat && styles.activeButton]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.text, selected === cat && styles.activeText]}>
            {cat}
          </Text>
        </TouchableOpacity>
      )})}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginVertical: hp(1.2),
    paddingHorizontal: wp(3),
    gap: wp(2.5),
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    borderRadius: wp(2),
    // marginRight: wp(1),
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  text: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: sp(14),
  },
  activeText: {
    color: Colors.white,
  },
});


export default CategoryFilter;
