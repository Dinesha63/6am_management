import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';

const AdminHeader: React.FC = () => {
  return (
    <View style={styles.MainContainer}>
      <View style={styles.Admincontainer}>
        <View>
          <Text style={styles.AdminType}>Hello Super Admin</Text>
          <View>
            <Text style={styles.StoreLocation}>Vedapatti</Text>
          </View>
        </View>
        <View>
          <SimpleIcon source={imagePaths.Explore_icon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
  },
  Admincontainer: {
    marginTop: 10,
    width: '90%',
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AdminType: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#000',
  },
  StoreLocation: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
});
export default AdminHeader;
