import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {ImageSourcePropType} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';

interface ProductCardProps {
  title: string;
  number: number | string;
  subtitle?: string;
  icon?: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  onPressIcon?: () => void;
  onPress?: () => void;
  backgroundColor?: string;
  fullWidth?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  number,
  subtitle,
  icon,
  containerStyle,
  onPress,
  backgroundColor = '#c7abceff',
  fullWidth = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        {backgroundColor},
        fullWidth ? styles.fullWidth : null,
        containerStyle,
      ]}>
      <View style={styles.text_Icon}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          {icon && <SimpleIcon source={icon} />}
        </TouchableOpacity>
      </View>
      <Text style={styles.number}>{number}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={{marginTop: 5}}>{icon && <SimpleIcon source={icon} />}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    margin: 8,
    width: '45%',
  },
  fullWidth: {
    width: '94%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#808D9E',
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D1E25',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#808D9E',
  },
  text_Icon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProductCard;
