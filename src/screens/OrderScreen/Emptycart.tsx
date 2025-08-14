import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import Header from './Header';
import SimpleIcon from '../../components/SimpleIcon';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

type RootStackParamList = {
    List: { category?: string };
};

const EmptyCartScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.orderContainer}>
                    <SimpleIcon
                        source={imagePaths.shopping_bag_icon}
                        size={120}
                        color="#7CC467"
                        style={{ marginBottom: 20 }}
                    />

                    <Text style={styles.noOrdersText}>Your cart is empty!</Text>
                    <Text style={styles.subText}>No orders yet? Let's change that!</Text>

                    <TouchableOpacity style={styles.exploreButton}       
                     onPress={() => navigation.navigate('List', { category: 'All' })} 
>
                        <Text style={styles.buttonText}>Explore Products</Text>
                    </TouchableOpacity>

                    <Text style={styles.deliveryText}>Free Door Delivery, Always!</Text>
                </View>

                <TouchableOpacity style={styles.bannerContainer} activeOpacity={0.9}>
                    <Image
                        source={imagePaths.Banner}
                        style={styles.bannerImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </ScrollView>

        </>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  orderContainer: {
    alignItems: 'center',
    marginBottom: hp(5),
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: hp(20),
    borderRadius: wp(3),
    resizeMode: 'contain',
  },
  noOrdersText: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: sp(14),
    color: Colors.black,
    marginBottom: hp(3),
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
  deliveryText: {
    fontSize: sp(15),
    fontWeight: '500',
    color: Colors.black,
    textAlign: 'center',
  },
});



export default EmptyCartScreen;