import { User } from "firebase/auth";
import axios from "axios";
import { API_BASE_URL } from "../constants/constants";

const createUserWithEmail = async (
  user: User,
  name: string,
  surname: string
) => {
  const response = await axios.post(`${API_BASE_URL}/users`, {
    id: user.uid,
    name: `${name} ${surname}`,
    email: user.email,
  });
  return response;
};

const createUserWithGoogle = async (user: User) => {
  const response = await axios.post(`${API_BASE_URL}/users`, {
    id: user.uid,
    name: user.displayName,
    email: user.email,
  });
  return response;
};

export default { createUserWithEmail, createUserWithGoogle };
