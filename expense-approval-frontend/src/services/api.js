const API_URL = "http://localhost:4000";

// Function to register a user
export const registerUser = async (formData) => {
  try {
    console.log("Registering user with data:", formData); // Debug log

    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json(); // Parse JSON response

    if (!response.ok) {
      console.error("Registration failed:", responseData);
      throw new Error(responseData.message || "Registration failed");
    }

    console.log("Registration successful:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error;
  }
};

// Function to log a user in
export const loginUser = async (formData) => {
  try {
    console.log("Logging in user with data:", formData); // Debug log

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json(); // Parse JSON response

    if (!response.ok) {
      console.error("Login failed:", responseData);
      throw new Error(responseData.message || "Login failed");
    }

    console.log("Login successful:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw error;
  }
};

// Function to handle both register and login sequentially
export const handleRegisterAndLogin = async (registerData, loginData) => {
  try {
    console.log("Starting Register and Login process...");

    // First, register the user
    const registrationResponse = await registerUser(registerData);
    console.log("✅ Registration successful:", registrationResponse);

    // Then, log the user in after successful registration
    const loginResponse = await loginUser(loginData);
    console.log("✅ Login successful:", loginResponse);

    return { registrationResponse, loginResponse };
  } catch (error) {
    console.error("❌ Error in register and login process:", error.message);
    throw error;
  }
};
