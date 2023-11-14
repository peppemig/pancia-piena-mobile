import axios from "axios";
import { API_BASE_URL } from "../constants/constants";
import { ProductRequest } from "../types/types";

const getProducts = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export default { getProducts };
