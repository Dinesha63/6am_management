import React from 'react';
import {StyleSheet, View} from 'react-native';
import ProductCard from './ProductsCard';
import AdminHeader from './Header';
import {imagePaths} from '../../utils/constants/imagePaths';
import cardData from './Data.json';

const getCardColor = (id: string) => {
  switch (id) {
    case 'products-card':
      return '#EDE6FB';
    case 'customers-card':
      return '#E6F0FB';
    case 'wallet-card':
      return '#E6FBF0';
    case 'postpaid-card':
      return '#FBE6E6';
    case 'deliveries-card':
      return '#E6F0FB';
    default:
      return '#c7abceff';
  }
};

const Admin: React.FC = () => {
  const rows = [
    cardData.cards.slice(0, 2),
    cardData.cards.slice(2, 4),
    cardData.cards.slice(4),
  ];

  return (
    <View>
      <AdminHeader />
      <View style={{marginTop: 10}}>
        {rows.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={[styles.row, row.length === 1 && styles.fullRow]}>
            {row.map(card => (
              <ProductCard
                key={card.id}
                title={card.title}
                number={card.mainValue}
                subtitle={card.subText}
                icon={imagePaths.arrow_right_icon}
                backgroundColor={getCardColor(card.id)}
                containerStyle={row.length === 1 ? styles.fullCard : undefined}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 2,
  },
  fullRow: {
    justifyContent: 'center',
  },
  fullCard: {
    width: '98%',
    alignSelf: 'center',
  },
});

export default Admin;
