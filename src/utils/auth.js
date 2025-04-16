import { jwtDecode } from "jwt-decode";

export const getStoredToken = () => localStorage.getItem("token");
export const getStoredUserInfo = () => {
  const info = localStorage.getItem("userInfo");
  return info ? JSON.parse(info) : null;
};

export const storeAuthData = (token, userInfo) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
};

export const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}; 