import {StyleSheet, View} from 'react-native';
import ProductsCard from './ProductsCard';
import AdminHeader from './Header';

const Admin: React.FC = () => {
  return (
    <>
      <View>
        <View>
          <AdminHeader />
        </View>
        <View style={styles.Cards}>
          <ProductsCard />
          <ProductsCard />
        </View>
        <View style={styles.Cards}>
          <ProductsCard />
          <ProductsCard />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  Cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
});

export default Admin;
