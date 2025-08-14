import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';

const ProductsCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PRODUCTS</Text>
      <Text style={styles.number}>500</Text>
      <Text style={styles.subtitle}>Today & Tomorrow</Text>
      <View>
        <SimpleIcon source={imagePaths.arrow_right_icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#c7abceff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b8b8bff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    width: '45%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProductsCard;
