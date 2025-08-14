import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface InviteSectionProps {
  onInvitePress: () => void;
}

const InviteSection: React.FC<InviteSectionProps> = ({ onInvitePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textSection}>
          <Text style={styles.title}>Invite{'\n'}Friends to{'\n'}Earn Credits</Text>
          <TouchableOpacity style={styles.bonusButton}>
            <Text style={styles.bonusText}>First Purchase Bonus</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <View style={styles.phoneIcon} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: wp(4),
    marginHorizontal: wp(4),
    marginVertical: hp(0.5),
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: wp(5),
    alignItems: 'center',
  },
  textSection: {
    flex: 2,
  },
  title: {
    color: Colors.white,
    fontSize: sp(20),
    fontWeight: 'bold',
    lineHeight: sp(24),
    marginBottom: hp(1.5),
  },
  bonusButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
    alignSelf: 'flex-start',
  },
  bonusText: {
    color: Colors.primary,
    fontSize: sp(12),
    fontWeight: '600',
  },
  imageSection: {
    flex: 1,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: wp(20),
    height: hp(13),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    width: wp(10),
    height: hp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: wp(2),
  },
});

export default InviteSection;