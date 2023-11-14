import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

const Products = () => {
  return (
    <View>
      <Link href={"/products/create"} asChild>
        <Button title="Aggiungi un prodotto" />
      </Link>
    </View>
  );
};

export default Products;
