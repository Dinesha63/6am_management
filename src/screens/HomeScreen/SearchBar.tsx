import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import { FontFamily} from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({searchQuery, setSearchQuery, placeholder}) => {
  return (
    <View style={styles.container}>
      <SimpleIcon
        source={imagePaths.search_icon}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search Customers"}
        placeholderTextColor={"grey"}
        value={searchQuery}
        onChangeText={(text) => {
          const sanitizedText = text.replace(/[^a-zA-Z0-9 ]/g, '');
          setSearchQuery(sanitizedText);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingVertical: hp(0.75),    
    paddingHorizontal: wp(3.7),   
    borderRadius: wp(2.6),        
    marginVertical: hp(0.6),      
    marginLeft: wp(4.2),          
    marginRight: wp(4.2),         
  },
  icon: {
    tintColor: Colors.lightGrey,
    width: wp(7),                 
    height: wp(7),
    marginRight: wp(2.6),        
  },
  input: {
    flex: 1,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
});

export default SearchBar;
