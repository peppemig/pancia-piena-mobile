import axios from "axios";
import { API_BASE_URL } from "../constants/constants";

const getProducts = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

const deleteProduct = async (token: string, productId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export default { getProducts, deleteProduct };
