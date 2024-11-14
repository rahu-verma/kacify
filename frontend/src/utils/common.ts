export const isStrongPassword = (password: string) => {
  // Password must be at least 8 characters long and contain at least one uppercase letter
  // one lowercase letter, one number, and one special character
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[~`!@#$%^&*\(\)_+-={\[\]|\\:;"'<,>\.?/}]/.test(password)
  );
};

export const isValidEmail = (email: string) => {
  return /^.+@.+\..+/.test(email);
};
