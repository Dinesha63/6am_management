import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {  FontFamily } from '../../utils/constant';
import { useNavigation } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import HeaderText from '../../components/HeaderText';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

const FILTER_OPTIONS = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last Month', value: 'month' },
];

const Header: React.FC = () => {
  const navigation = useNavigation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[0].value);

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    setFilterVisible(false);
    // You can call a prop or context here to actually filter your orders
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={styles.backIcon}
      >
        <SimpleIcon source={imagePaths.back_icon} style={{width: wp(6), height: wp(6), resizeMode: 'contain'}}  />  
      </TouchableOpacity>
      {/* <Text style={styles.headerTitle}>My Order</Text> */}

      <HeaderText text="My Order" style={styles.headerTitle} />
      
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        
        <SimpleIcon source={imagePaths.filter_icon} style={styles.filterIcon} />
        {/* <Text style={styles.filterButtonText}>Filter</Text> */}

      </TouchableOpacity>

      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.dropdown}>
            {FILTER_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  selectedFilter === option.value && styles.selectedDropdownItem,
                ]}
                onPress={() => handleFilterSelect(option.value)}
              >
                <Text style={styles.dropdownText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
  },
  filterButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.75),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    marginLeft: 'auto',
  },
  filterButtonText: {
    fontSize: sp(14),
    color: Colors.primary,
    fontFamily: FontFamily.REGULAR,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: Colors.black,
  },
  dropdown: {
    marginTop: hp(7.5),
    marginRight: wp(5),
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    elevation: 4,
    paddingVertical: hp(1),
    minWidth: wp(35),
  },
  dropdownItem: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(4.5),
  },
  selectedDropdownItem: {
    backgroundColor: Colors.greyBackground,
  },
  dropdownText: {
    fontSize: sp(16),
    color: Colors.black,
    fontFamily: FontFamily.REGULAR,
  },
  filterIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1),
  },
});

export default Header;

// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import { FontFamily} from '../../utils/constant';
// import { imagePaths } from '../../utils/constants/imagePaths';
// import HeaderText from '../../components/HeaderText';

// const Header: React.FC = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButton}>
//         <Image source={imagePaths.back_icon} style={styles.backIcon} />
//       </TouchableOpacity>
//       <HeaderText text="My Order" style={styles.headerTitle} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     backgroundColor: '#fff',
//     position: 'relative',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 12,
//     padding: 6,
//   },
//   backIcon: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   headerTitle: {
//     textAlign: 'center',
//   },
// });

// export default Header;
