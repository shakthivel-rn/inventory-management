const API_URI = "http://127.0.0.1:3001/login";

document
  .getElementById("signin-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showError("Enter complete details");
    }

    try {
      const response = await signin({ email, password });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
      } else {
        showError(data.message || "Sign In Failed");
      }
    } catch (error) {
      console.error("Error during signin", error);
      showError("An error occured, Please try again later");
    }
  });

async function signin(user) {
  return fetch(API_URI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

function showError(message) {
  const errorContainer = document.getElementById("error-message");
  errorContainer.textContent = message;
  errorContainer.style.color = "red";
}

function clearError() {
  const errorContainer = document.getElementById("error-message");
  errorContainer.textContent = "";
}
