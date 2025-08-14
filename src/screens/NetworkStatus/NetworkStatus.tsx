// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';  

// const NetworkStatus: React.FC = () => {
//   const isConnected = useSelector((state: RootState) => state.network.isConnected);

 
//   if (isConnected === null) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>Checking network status...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: isConnected ? '#34C759' : '#FF3B30' }]}>
//       <Text style={styles.text}>
//         {isConnected ? 'You are online' : 'You are offline'}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center', 
//     height: 50,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
// });

// export default NetworkStatus;
