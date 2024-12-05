export const validateSignupForm = ({
  password,
  email,
}: {
  password: string;
  email: string;
}) => {
  const errors = [];

  // Email validation (basic regex pattern for email)
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  // Password validation
  if (!password || password.trim() === "") {
    errors.push("Password is required!");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return errors;
};

export const validateLoginForm = ({
  password,
  email,
}: {
  password: string;
  email: string;
}) => {
  const errors = [];

  // Email validation (basic regex pattern for email)
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Please enter a valid email address");
  }

  // Password validation
  if (!password || password.trim() === "") {
    errors.push("Password is required!");
  }

  return errors;
};


