import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { wp, hp } from '../../utils/constants/responsive'; // your responsive utility
import Colors from '../../utils/constants/colors'; // your color palette

const AddMoneyCard = ({
  isToggleAllowed, 
  walletAmount, 
  amount, 
  disabled,
  isSelected = false,
  onToggle
}: {
  isToggleAllowed: boolean, 
  walletAmount: number, 
  amount: number, 
  disabled: boolean,
  isSelected?: boolean,
  onToggle?: (enabled: boolean) => void
}) => {
  const [isEnabled, setIsEnabled] = useState(isSelected);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle?.(newValue);
  };

  // Update local state when prop changes
  React.useEffect(() => {
    setIsEnabled(isSelected);
  }, [isSelected]);

  // Reset selection when disabled
  React.useEffect(() => {
    if (disabled && isEnabled) {
      setIsEnabled(false);
      onToggle?.(false);
    }
  }, [disabled]);

  return (
    <TouchableOpacity 
      style={{
        ...styles.card, 
        backgroundColor: isEnabled ? Colors.SelectedCard : Colors.white, 
        borderColor: isEnabled ? Colors.SelectedBorderCard : '#E0E0F0'
      }}
      onPress={toggleSwitch}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {/* Left: Icon + Text */}
      <View style={styles.leftSection}>
        <Text style={styles.plus}>+</Text>
        <View>
          <Text style={styles.title}>Add Money to Wallet</Text>
          <Text style={styles.subtitle}>Top-up your wallet for future orders</Text>
        </View>
      </View>

      {/* Right: Switch */}
       <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        trackColor={{ false: '#ccc', true: Colors.primary }}
        thumbColor={isEnabled ? Colors.white : '#ffffff'}
        ios_backgroundColor="#ccc"
        disabled={disabled}
      />
    </TouchableOpacity>
  );
};

export default AddMoneyCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F7FF', // Light blue shade
    borderWidth: 1,
    borderColor: '#B0D9FF',
    borderRadius: wp(3),
    padding: wp(4),
    marginVertical: hp(2),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plus: {
    fontSize: wp(6),
    color: '#007BFF',
    marginRight: wp(3),
    fontWeight: '500',
  },
  title: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#001A72',
  },
  subtitle: {
    fontSize: wp(3.6),
    color: '#007BFF',
    marginTop: hp(0.5),
  },
});
