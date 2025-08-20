// DeliveriesTable.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface DeliveryDetail {
  productSkuCode: string;
  productSkuName: string;
  quantity: number;
}

interface DeliveryItem {
  customerId: string;
  customerName: string;
  phoneNumber: string;
  orderId: string;
  orderNo: string;
  orderStatus: string;
  orderDate: string;
  deliveredDate: string | null;
  cancelledDate: string | null;
  deliveryDetail: DeliveryDetail[]; 
}

interface DeliveriesTableProps {
  data: DeliveryItem[];
  role: "admin" | "superAdmin";
  onUpdateStatus?: (orderId: string, status: string) => void;
}

const DeliveriesTable: React.FC<DeliveriesTableProps> = ({ data, role, onUpdateStatus }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No deliveries found</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.orderId} 
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.customerName} ({item.phoneNumber})
            </Text>
            <Text>Order No: {item.orderNo}</Text>
            <Text>Status: {item.orderStatus}</Text>
            <Text>Date: {new Date(item.orderDate).toLocaleString()}</Text>

            {item.deliveredDate && (
              <Text style={styles.deliveredText}>
                ✅ Delivered: {new Date(item.deliveredDate).toLocaleString()}
              </Text>
            )}

            {item.cancelledDate && (
              <Text style={styles.cancelledText}>
                ❌ Cancelled: {new Date(item.cancelledDate).toLocaleString()}
              </Text>
            )}

            <View style={styles.productsBox}>
              {item.deliveryDetail.map((prod, i) => (
                <Text key={i} style={styles.productText}>
                  {prod.productSkuName} - {prod.quantity}
                </Text>
              ))}
            </View>

            {role === "admin" && item.orderStatus === "Inprogress" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "green" }]}
                  onPress={() => onUpdateStatus?.(item.orderId, "Completed")}
                >
                  <Text style={styles.btnText}>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "red" }]}
                  onPress={() => onUpdateStatus?.(item.orderId, "Skipped")}
                >
                  <Text style={styles.btnText}>Skip</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  productsBox: { marginTop: 8 },
  productText: { fontSize: 14, color: "#555" },
  actions: { flexDirection: "row", marginTop: 10 },
  btn: {
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
  deliveredText: { marginTop: 4, color: "green", fontWeight: "bold" },
  cancelledText: { marginTop: 4, color: "red", fontWeight: "bold" },
});

export default DeliveriesTable;
