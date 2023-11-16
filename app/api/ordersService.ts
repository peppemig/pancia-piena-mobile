import { API_BASE_URL } from "../constants/constants";
import { OrderRequest } from "../types/types";
import axios from "axios";

const createOrder = async (token: string, orderRequest: OrderRequest) => {
  const response = await axios.post(`${API_BASE_URL}/orders`, orderRequest, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export default { createOrder };
