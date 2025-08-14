import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Linking } from 'react-native';
import SimpleIcon from '../../../../components/SimpleIcon';
import { imagePaths } from '../../../../utils/constants/imagePaths';

interface FeedbackCardProps {
  isFeedbackExpanded: boolean;
  setIsFeedbackExpanded: (v: boolean) => void;
  selectedRating: number;
  setSelectedRating: (v: number) => void;
  hoverRating: number;
  setHoverRating: (v: number) => void;
  feedbackText: string;
  setFeedbackText: (v: string) => void;
  handleSubmitFeedback: () => void;
  handleSkipFeedback: () => void;
  handleCloseFeedback: () => void;
  renderStars: (interactive: boolean) => React.ReactNode;
  styles: any;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  isFeedbackExpanded,
  selectedRating,
  feedbackText,
  setFeedbackText,
  handleSubmitFeedback,
  handleSkipFeedback,
  handleCloseFeedback,
  renderStars,
  styles,
}) => {
  return (
    <View style={styles.feedbackCard}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleCloseFeedback}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      {!isFeedbackExpanded ? (
        <View style={styles.feedbackInitial}>
          <Text style={styles.feedbackTitle}>
            Thank You for Your Order!
          </Text>
          <Text style={styles.feedbackSubtitle}>
            We hope you enjoyed your Products
          </Text>

          <Text style={styles.ratingPrompt}>
            How would you rate your experience?
          </Text>
          {renderStars(true)}

          <Text style={styles.feedbackFooter}>
            Your feedback helps us serve you better!
          </Text>
        </View>
      ) : (
        <View style={styles.feedbackExpanded}>
          <View style={styles.feedbackHeader}>
            <View style={styles.feedbackHeaderLeft}>
              <Text style={styles.feedbackExpandedTitle}>
                Thank you so much!
              </Text>
              <Text style={styles.feedbackExpandedSubtitle}>
                We're thrilled you had a great experience!
              </Text>
            </View>
          </View>

          <View style={styles.selectedRatingContainer}>
            {renderStars(false)}
          </View>

          <View style={styles.feedbackInputSection}>
            <Text style={styles.feedbackInputLabel}>Submit feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Share your thoughts or suggestions here..."
              multiline={true}
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.feedbackActions}>
            <TouchableOpacity
              style={styles.contactButtonFeedback}
              onPress={() => Linking.openURL('tel:8111 075 075')}>
              <SimpleIcon
                source={imagePaths.Phone_icon}
                style={styles.contactIconFeedback}
              />
              <Text style={styles.contactTextFeedback}>Contact</Text>
            </TouchableOpacity>

            <View style={styles.feedbackButtonsRight}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipFeedback}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  selectedRating === 0 && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitFeedback}>
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FeedbackCard; 