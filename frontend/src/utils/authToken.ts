export const storeAuthToken = (authToken: string) => {
  localStorage.setItem("kacifyAuthToken", authToken);
};

export const getAuthToken = () => {
  return localStorage.getItem("kacifyAuthToken");
};

export const getAccountPage = () => {
  return getAuthToken() ? "profile" : "login";
};

export const removeAuthToken = () => {
  localStorage.removeItem("kacifyAuthToken");
};
