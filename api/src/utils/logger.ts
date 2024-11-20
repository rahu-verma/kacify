export const logError = (message: Error) => {
  console.error(new Date().toISOString(), message);
};
