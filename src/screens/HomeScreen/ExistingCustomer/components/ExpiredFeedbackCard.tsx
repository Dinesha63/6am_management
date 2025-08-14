import React from 'react';
import { View, Text } from 'react-native';

interface ExpiredFeedbackCardProps {
  styles: any;
}

const ExpiredFeedbackCard: React.FC<ExpiredFeedbackCardProps> = ({ styles }) => (
  <View style={styles.expiredCard}>
    <Text style={styles.expiredText}>
      Feedback period has expired. Thank you for your order!
    </Text>
  </View>
);

export default ExpiredFeedbackCard; 