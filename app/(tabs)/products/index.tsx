import {
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useAuthState } from "../../providers/AuthProvider";
import { useState } from "react";
import { Product } from "../../types/types";
import productsService from "../../api/productsService";
import { useFocusEffect } from "expo-router";
import React from "react";
import { categories } from "../../constants/constants";
import Button from "../../components/ui/Button";
import FilterButton from "../../components/products/FilterButton";
import ProductCard from "../../components/products/ProductCard";

const Products = () => {
  const { user } = useAuthState();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("TUTTI");
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      getProducts();
      return () => {
        isActive = false;
        setProducts([]);
        setFilteredProducts([]);
        setCurrentFilter("TUTTI");
      };
    }, [user])
  );

  const getProducts = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .getProducts(token)
          .then((res) => {
            setProducts(res.data.products);
            setFilteredProducts(res.data.products);
            setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
            Alert.alert(
              "Ooops! C'è stato un problema",
              e.message,
              [
                {
                  text: "Chiudi",
                  style: "cancel",
                },
              ],
              {
                cancelable: true,
              }
            );
          });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const filterProducts = (value: string) => {
    if (value === "TUTTI") {
      setFilteredProducts(products);
      setCurrentFilter(value);
      return;
    }
    const filter = products.filter((product) => product.category === value);
    setFilteredProducts(filter);
    setCurrentFilter(value);
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
      >
        <ActivityIndicator
          size="large"
          color="black"
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ flexGrow: 0, gap: 6 }}
      >
        {Object.keys(categories).map((cat) => (
          <FilterButton
            key={cat}
            label={categories[cat]}
            value={cat}
            currentFilter={currentFilter}
            onClick={filterProducts}
          />
        ))}
      </ScrollView>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, gap: 16 }}
      >
        {filteredProducts.length > 0 ? (
          <>
            {Object.keys(categories).map(
              (cat) =>
                filteredProducts.some((prod) => prod.category === cat) && (
                  <View key={cat}>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 20,
                        paddingBottom: 4,
                      }}
                    >
                      {categories[cat].toUpperCase()}
                    </Text>
                    <View style={{ gap: 6 }}>
                      {filteredProducts
                        .filter((prod) => prod.category === cat)
                        .map((fprod) => (
                          <ProductCard
                            key={fprod.id}
                            id={fprod.id}
                            name={fprod.name}
                            price={fprod.price}
                            category={fprod.category}
                            user={user!}
                            refreshProducts={getProducts}
                          />
                        ))}
                    </View>
                  </View>
                )
            )}
          </>
        ) : (
          <Text>Non hai ancora aggiunto nessun prodotto 😐</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    gap: 10,
    backgroundColor: "white",
  },
});

export default Products;
