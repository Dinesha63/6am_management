import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {Colors} from '../../../constants/colors';
import {imagePath} from '../../../constants/imagePath';
import {FontFamily} from '../../../constants/fontFamily';
import {fetchStoreRoutes} from '../../../redux/thunks/regionThunks';
import {useAppDispatch} from '../../../redux/hooks';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../../constants/ResponsiveScreen';


interface OptionType {
  label: string;
  value: string;
  regionId?: string;
}

interface DropdownProps {
  label: {
    region: string;
    route: string;
  };
  value: string;
  options: OptionType[];
  onSelect: (routeId: string, regionId?: string) => void;
  error?: string;
  touched?: boolean;
    selectedRouteId?: string; // new prop

}

const Dropdown = ({
  label,
  value,
  options,
  onSelect,
  error,
  touched,
  selectedRouteId
}: DropdownProps): React.JSX.Element => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<OptionType | null>(null);
  const [routes, setRoutes] = useState<OptionType[]>([]);
  const [isRouteListVisible, setIsRouteListVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const dispatch = useAppDispatch();

  // Reset state when modal is opened
  const openModal = () => {
    setIsRouteListVisible(false);
    setSelectedRegion(null);
    setRoutes([]);
    setModalVisible(true);
  };

  const fetchRoutes = async (storeId: string) => {
    try {
      const response = await dispatch(fetchStoreRoutes({storeId})).unwrap();
      console.log(response, 'respdddonces');
      const routeOptions = response?.data?.map(
        (route: {name: string; id: string}) => ({
          label: route.name,
          value: route.id,
        }),
      );
      setRoutes(routeOptions);
    } catch (error) {
      console.error('Failed to fetch routes', error);
    }
  };
  const selectedLabel = selectedRegion?.label || 'Select a region';

useEffect(() => {
  if (value && selectedRouteId) {
    const region = options.find(opt => opt.value === value);
    setSelectedRegion(region ?? null);
    fetchRoutes(region?.value || '').then(() => {
      setIsRouteListVisible(true);
    });
  }
}, [value, selectedRouteId]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          touched && error ? styles.errorBorder : null,
        ]}
        onPress={openModal}>
        <Text
        numberOfLines={1}
          style={[
            styles.selectedText,
            !selectedOption && styles.placeholderText,
          ]}>
          {selectedOption ? selectedOption.label : 'Select an region'}
        </Text>
        <Image source={imagePath.down_arrow_icon} style={styles.arrowIcon} />
      </TouchableOpacity>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isRouteListVisible ? label.route : label.region}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (isRouteListVisible) {
                    setIsRouteListVisible(false);
                    setRoutes([]);
                    setSelectedRegion(null);
                  } else {
                    setModalVisible(false);
                  }
                }}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {!isRouteListVisible && (
              <FlatList
                data={options}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedRegion(item);
                      fetchRoutes(item.value);
                      setIsRouteListVisible(true);
                    }}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {isRouteListVisible && (
              <FlatList
                data={routes}
                keyExtractor={item => item.value}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      onSelect(item.value, selectedRegion?.value);
                      setModalVisible(false);
                      setIsRouteListVisible(false);
                      setSelectedRegion(null);
                      setRoutes([]);
                    }}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    // marginBottom: rs(16),
  },
  label: {
    fontSize: sp(14),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
    color: Colors.dark,
    // marginBottom: rs(8),
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: rs(1),
    borderColor: Colors.greyBackground,
    borderRadius: rs(8),
    backgroundColor: Colors.white,
    paddingHorizontal: rs(12),
    height: rs(48),
  },
  errorBorder: {
    borderColor: Colors.danger,
  },
  selectedText: {
    fontSize: sp(16),
    color: Colors.dark,
    width: '85%',
  },
  placeholderText: {
    color: Colors.listSeconary,
  },
  arrowIcon: {
    width: rs(24),
    height: rs(24),
    tintColor: Colors.listSeconary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: sp(12),
    marginTop: rs(4),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp(90),
    maxHeight: hp(80),
    backgroundColor: Colors.white,
    borderRadius: rs(10),
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rs(15),
    backgroundColor: Colors.primary,
  },
  modalTitle: {
    fontSize: sp(18),
    color: Colors.white,
    fontFamily: FontFamily.REGULAR,
  },
  closeButton: {
    padding: rs(5),
  },
  closeButtonText: {
    fontSize: sp(20),
    color: Colors.white,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: rs(15),
    borderBottomWidth: rs(1),
    borderBottomColor: Colors.greyBackground,
  },
  optionText: {
    fontSize: sp(16),
    color: Colors.dark,
  },
  checkIcon: {
    width: rs(20),
    height: rs(20),
    tintColor: Colors.primary,
  },
});

export default Dropdown;
