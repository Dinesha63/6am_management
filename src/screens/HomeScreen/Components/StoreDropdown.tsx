import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";

export interface StoreItem {
  storeName: string;
}

interface StoreDropdownProps {
  selectedStore?: string;
  onStoreChange: (storeName: string) => void;
  locationData: StoreItem[];
}

const StoreDropdown: React.FC<StoreDropdownProps> = ({
  selectedStore,
  onStoreChange,
  locationData,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View>
      {/* Dropdown Trigger */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.text}>{selectedStore || "Select Store"}</Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Store</Text>
            <ScrollView>
              {locationData?.map((store, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.item,
                    selectedStore === store.storeName && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onStoreChange(store.storeName);
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.itemText,
                      selectedStore === store.storeName && styles.selectedText,
                    ]}
                  >
                    {store.storeName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancel}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 5,
  },
  icon: { marginRight: 5 },
  text: { flex: 1, fontSize: 16 },
  dropdownIcon: { fontSize: 14, marginLeft: 5 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  selectedItem: { backgroundColor: "#f0f0f0" },
  itemText: { fontSize: 16 },
  selectedText: { color: "blue", fontWeight: "bold" },
  cancel: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  cancelText: { textAlign: "center", fontSize: 16, fontWeight: "500" },
});

export default StoreDropdown;
