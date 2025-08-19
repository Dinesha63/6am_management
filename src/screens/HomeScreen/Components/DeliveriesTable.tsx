// DeliveriesTable.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface OrderDetails {
  productSkuCode: string;
  productSkuName: string;
  quantity: number;
}

interface DeliveryItem {
  customerName: string;
  phoneNumber: string;
  orderNo: string;
  orderStatus: string;
  orderDate: string;
  orderDetails: OrderDetails[];
}

interface DeliveriesTableProps {
  data: DeliveryItem[];
  role: "admin" | "superAdmin";
  onUpdateStatus?: (orderId: string, status: string) => void; // store role only
}

const DeliveriesTable: React.FC<DeliveriesTableProps> = ({ data, role, onUpdateStatus }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No deliveries found</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.orderNo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.customerName} ({item.phoneNumber})</Text>
            <Text>Order No: {item.orderNo}</Text>
            <Text>Status: {item.orderStatus}</Text>
            <Text>Date: {new Date(item.orderDate).toLocaleString()}</Text>

            <View style={styles.productsBox}>
              {item.orderDetails.map((prod, i) => (
                <Text key={i} style={styles.productText}>
                  {prod.productSkuName} - {prod.quantity}
                </Text>
              ))}
            </View>

            {role === "store" && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "green" }]}
                  onPress={() => onUpdateStatus?.(item.orderNo, "Completed")}
                >
                  <Text style={styles.btnText}>Complete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "red" }]}
                  onPress={() => onUpdateStatus?.(item.orderNo, "Skipped")}
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
});

export default DeliveriesTable;
