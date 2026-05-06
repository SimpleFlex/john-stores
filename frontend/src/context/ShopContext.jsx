import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchProducts } from "../services/product.service.js";

export const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

const ShopContextProvider = (props) => {
  const currency = "₦";
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [swiftProducts, setSwiftProducts] = useState([]);
  const [johnStoresProducts, setJohnStoresProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();

        const swift = allProducts.filter((p) => p.brand === "Swift Logistics");
        const johns = allProducts.filter((p) => p.brand === "John's Stores");

        setSwiftProducts(swift);
        setJohnStoresProducts(johns);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (itemId, size = null, color = null, quantity = 1) => {
    const allProducts = [...swiftProducts, ...johnStoresProducts];
    const product = allProducts.find((item) => item._id === itemId);

    if (product?.sizes?.length > 0 && !size) {
      toast.error("Select Product Size");
      return;
    }

    if (product?.color?.length > 0 && !color) {
      toast.error("Select Product Color");
      return;
    }

    let cartData = structuredClone(cartItems);

    let variantKey = "default";
    if (size && color) {
      variantKey = `${size}-${color}`;
    } else if (size) {
      variantKey = size;
    } else if (color) {
      variantKey = color;
    }

    if (cartData[itemId]) {
      if (cartData[itemId][variantKey]) {
        cartData[itemId][variantKey] += quantity;
      } else {
        cartData[itemId][variantKey] = quantity;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][variantKey] = quantity;
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      const productVariants = cartItems[productId];
      for (const variantKey in productVariants) {
        const quantity = productVariants[variantKey];
        if (quantity > 0) totalCount += quantity;
      }
    }
    return totalCount;
  };

  const value = {
    swiftProducts,
    currency,
    navigate,
    johnStoresProducts,
    cartItems,
    addToCart,
    getCartCount,
    loading,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
