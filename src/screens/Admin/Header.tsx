import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {Picker} from '@react-native-picker/picker';
import storeData from './StoreData.json';

const AdminHeader: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(
    storeData.stores[0].name,
  );

  return (
    <View style={styles.MainContainer}>
      <View style={styles.Admincontainer}>
        <View>
          <Text style={styles.AdminType}>Hello Super Admin</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedLocation}
              onValueChange={itemValue => setSelectedLocation(itemValue)}
              style={styles.picker}
              dropdownIconColor="#6f6e6eff">
              {storeData.stores.map(store => (
                <Picker.Item
                  label={store.name}
                  value={store.name}
                  key={store.id}
                />
              ))}
            </Picker>
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
  pickerContainer: {
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    color: '#181818',
  },
});
export default AdminHeader;
