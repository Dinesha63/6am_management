import React from 'react';
import { View, Image, StyleSheet, ImageStyle } from 'react-native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

interface StarRatingProps {
  rating: number;
}
// const fullStars = Math.floor(rating);
// const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.85;
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const totalStars = 5;

  return (
    <View style={styles.starContainer}>
      {[...Array(totalStars)].map((_, index) => {
          // const fullStars = Math.floor(rating);
          // const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.85;
          //       if (index < fullStars) {
          //         return (
          //           <Image
          //             key={index}
          //             source={imagePaths.start_icon}
          //             style={[styles.starIcon, { tintColor: '#FFBD00' } as ImageStyle]}
          //           />
          //         );
          //       } else if (index === fullStars && hasHalfStar) {
          //         return (
          //           <Image
          //             key={index}
          //             // source={imagePaths.half_star_icon}
        
          //             style={[styles.starIcon, { tintColor: '#FFBD00' } as ImageStyle]}
          //           />
          //         );
          //       } else {
          //         // Gray star
          //         return (
          //           <Image
          //             key={index}
          //             source={imagePaths.start_icon}
          //             style={[styles.starIcon, { tintColor: '#ccc' } as ImageStyle]}
          //           />
          //         );
          //       }
        return (
          <Image
            key={index}
            source={imagePaths.start_icon}
            style={[styles.starIcon, { tintColor: '#FFBD00' } as ImageStyle]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: wp(3.2),       
    height: wp(3.2),
    marginRight: wp(0.5),  
  },
});

export default StarRating;
