// ProductsTable.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface ProductItem {
  storeName?: string;
  productName?: string;
  quantity: string | number;
  productSkuName?: string;
}

interface ProductsTableProps {
  data: ProductItem[];
  role: "superAdmin" | "admin";
}

const ProductsTable: React.FC<ProductsTableProps> = ({ data, role }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No products available</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {role === "admin" ? (
              <>
                <Text style={styles.cell}>{item.storeName}</Text>
                <Text style={styles.cell}>{item.productName}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
              </>
            ) : (
              <>
                <Text style={styles.cell}>{item.productSkuName}</Text>
                <Text style={styles.cell}>{item.quantity}</Text>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: { flex: 1, fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
});

export default ProductsTable;
