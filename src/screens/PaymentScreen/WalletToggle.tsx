import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Image } from 'react-native';
import Colors from '../../utils/constants/colors';
import { wp, hp } from '../../utils/constants/responsive';
import SimpleIcon from '../../components/SimpleIcon';
import { imagePaths } from '../../utils/constants/imagePaths';


type WalletToggleProps = {
  amount: number;
  isEnabled?: boolean;
  onToggle?: (value: boolean) => void;
  disabled?: boolean;
  isToggleAllowed?: boolean;
};

const WalletToggle: React.FC<WalletToggleProps> = ({
  amount,
  isEnabled = false,
  onToggle,
  disabled = false,
  isToggleAllowed = false,
}) => {
  const [toggle, setToggle] = useState(isEnabled);
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = (value: boolean) => {
    setToggle(value);
    onToggle?.(value);
  };

  const handleCheckboxPress = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onToggle?.(newValue);
  };

  useEffect(() => {
    if (isToggleAllowed && !disabled) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [isToggleAllowed, disabled]);

  // Update checkbox state based on isEnabled prop
  useEffect(() => {
    setIsChecked(isEnabled);
  }, [isEnabled]);

  // Reset when disabled
  useEffect(() => {
    if (disabled && isChecked) {
      setIsChecked(false);
      onToggle?.(false);
    }
  }, [disabled]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: wp(4),
        borderRadius: wp(3),
        backgroundColor: isToggleAllowed ? Colors.SelectedCard : Colors.white, 
        borderWidth: 1,
        borderColor: isToggleAllowed ? Colors.SelectedBorderCard : '#E0E0F0',
       }}
    >
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={handleCheckboxPress}
        activeOpacity={0.7}
      >
        <View
          style={{
            height: wp(5.3),
            width: wp(5.3),
            borderRadius: wp(2.7),
            borderWidth: 1.5,
            borderColor: isChecked ? Colors.black : Colors.black,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: wp(2.7),
          }}
        >
          {isChecked && (
            <View
              style={{
                height: wp(2.7),
                width: wp(2.7),
                borderRadius: wp(1.3),
                backgroundColor: Colors.primary,
              }}
            />
          )}
        </View>

        <SimpleIcon source={imagePaths.Wallet_Icon} size={wp(5)} color={Colors.primary} />

        <View style={{ marginLeft: wp(2) }}>
          <Text
            style={{
              fontSize: wp(4),
              fontWeight: '600',
              color: Colors.blackText,
            }}
          >
            Use Wallet Balance Only
          </Text>

        </View>
      </TouchableOpacity>

    </View>
  );
};

export default WalletToggle;
