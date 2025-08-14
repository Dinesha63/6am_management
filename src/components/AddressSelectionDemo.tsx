// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
// } from 'react-native';
// import AddressSelectionBottomSheet from './AddressSelectionBottomSheet';
// import Colors from '../utils/constants/colors';
// import {
//   getResponsiveWidth as wp,
//   getResponsiveHeight as hp,
//   getResponsiveFontSize as sp,
// } from '../utils/constants/responsiveScreen';

// interface Address {
//   id: string;
//   type: 'Home' | 'Work' | 'Other';
//   distance: string;
//   address: string;
//   phoneNumber?: string;
//   deliversTo: boolean;
// }

// const AddressSelectionDemo: React.FC = () => {
//   const [showBottomSheet, setShowBottomSheet] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

//   // Mock data matching the image
//   const mockAddresses: Address[] = [
//     {
//       id: '1',
//       type: 'Work',
//       distance: '5.2 km',
//       address: '3, Mistral Networks, New Thillai Nagar, Madathur, Coimbatore.',
//       phoneNumber: '+91-9894007270',
//       deliversTo: true,
//     },
//     {
//       id: '2',
//       type: 'Home',
//       distance: '2.6 km',
//       address: 'Mohan pickup, P.M.Swamy Colony, Tamil Nadu Agricultural University...',
//       deliversTo: true,
//     },
//     {
//       id: '3',
//       type: 'Home',
//       distance: '2.8 km',
//       address: '8-1 13th Cross Street, Perumal Naidu Layout, Vedapatti.',
//       deliversTo: true,
//     },
//     {
//       id: '4',
//       type: 'Other',
//       distance: '2.5 km',
//       address: 'Vedapatti Panchayat office, Vedapatti.',
//       deliversTo: true,
//     },
//     {
//       id: '5',
//       type: 'Work',
//       distance: '72 km',
//       address: 'kayak vizhi complex, Lenskart.com at Gobichettipalayam, Erode Main Road...',
//       phoneNumber: '+91-9894007270',
//       deliversTo: false,
//     },
//   ];

//   const handleAddressSelect = (address: Address) => {
//     setSelectedAddress(address);
//     setShowBottomSheet(false);
//     console.log('Selected address:', address);
//   };

//   const handleAddAddress = () => {
//     setShowBottomSheet(false);
//     console.log('Add new address');
//   };

//   const handleCloseBottomSheet = () => {
//     setShowBottomSheet(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Address Selection Demo</Text>
        
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => setShowBottomSheet(true)}
//         >
//           <Text style={styles.buttonText}>Select Address</Text>
//         </TouchableOpacity>

//         {selectedAddress && (
//           <View style={styles.selectedAddress}>
//             <Text style={styles.selectedTitle}>Selected Address:</Text>
//             <Text style={styles.selectedText}>{selectedAddress.address}</Text>
//             <Text style={styles.selectedDetails}>
//               {selectedAddress.type} • {selectedAddress.distance}
//               {selectedAddress.deliversTo ? ' • Delivers' : ' • Does not deliver'}
//             </Text>
//           </View>
//         )}

//         <View style={styles.info}>
//           <Text style={styles.infoTitle}>Features:</Text>
//           <Text style={styles.infoText}>• Shows saved addresses with delivery status</Text>
//           <Text style={styles.infoText}>• Categorized as "DELIVERS TO" and "DOES NOT DELIVER TO"</Text>
//           <Text style={styles.infoText}>• Add new address functionality</Text>
//           <Text style={styles.infoText}>• Address actions (menu and share)</Text>
//           <Text style={styles.infoText}>• Distance and phone number display</Text>
//         </View>
//       </View>

//       <AddressSelectionBottomSheet
//         isVisible={showBottomSheet}
//         onClose={handleCloseBottomSheet}
//         onAddressSelect={handleAddressSelect}
//         onAddAddress={handleAddAddress}
//         addresses={mockAddresses}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.white,
//   },
//   content: {
//     flex: 1,
//     padding: wp(5),
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: sp(24),
//     fontWeight: 'bold',
//     color: Colors.black,
//     textAlign: 'center',
//     marginBottom: hp(4),
//   },
//   button: {
//     backgroundColor: Colors.primary,
//     paddingVertical: hp(2),
//     paddingHorizontal: wp(4),
//     borderRadius: wp(2),
//     alignItems: 'center',
//     marginBottom: hp(4),
//   },
//   buttonText: {
//     color: Colors.white,
//     fontSize: sp(16),
//     fontWeight: '600',
//   },
//   selectedAddress: {
//     backgroundColor: Colors.greyBackground,
//     padding: wp(4),
//     borderRadius: wp(2),
//     marginBottom: hp(4),
//   },
//   selectedTitle: {
//     fontSize: sp(14),
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: hp(1),
//   },
//   selectedText: {
//     fontSize: sp(14),
//     color: Colors.black,
//     marginBottom: hp(1),
//   },
//   selectedDetails: {
//     fontSize: sp(12),
//     color: Colors.grey,
//   },
//   info: {
//     backgroundColor: Colors.lightblue,
//     padding: wp(4),
//     borderRadius: wp(2),
//   },
//   infoTitle: {
//     fontSize: sp(16),
//     fontWeight: '600',
//     color: Colors.black,
//     marginBottom: hp(2),
//   },
//   infoText: {
//     fontSize: sp(14),
//     color: Colors.black,
//     marginBottom: hp(0.5),
//   },
// });

// export default AddressSelectionDemo; 