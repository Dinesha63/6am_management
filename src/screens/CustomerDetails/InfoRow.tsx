import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';

interface InfoRowProps {
  icon: any;
  text: string;
}

const InfoRow: React.FC<InfoRowProps> = ({icon, text}) => {
  return (
    <View style={styles.row}>
      <SimpleIcon source={icon} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.grey,
    marginRight: wp(2),
  },
  text: {
    flex: 1,
    fontSize: sp(13),
    color: Colors.black,
    fontFamily: FontFamily.REGULAR,
  },
});

export default InfoRow;


