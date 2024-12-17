export const storeAuthToken = (authToken: string) => {
  localStorage.setItem("kacifyAuthToken", authToken);
};

export const getAuthToken = () => {
  return localStorage.getItem("kacifyAuthToken");
};

export const clearAuthToken = () => {
  localStorage.removeItem("kacifyAuthToken");
};
