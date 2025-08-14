import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

interface BodyTextProps extends TextProps {
  text: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

const BodyText: React.FC<BodyTextProps> = ({ text, style, numberOfLines, ...rest }) => {
  return (
    <Text
      style={[
        {
        //   fontSize: fontSizes.fontSize_14,
        //   fontFamily: fontFamily.Poppins_Regular,
        //   color: colors.primary_Text_color,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {text}
    </Text>
  );
};

export default BodyText;



{/* <BodyText text="This is a sample body text" />

<BodyText
  text="Styled text with limited lines"
  numberOfLines={2}
  style={{ color: colors.grayish_blue, fontSize: fontSizes.fontSize_12 }}
/> */}
