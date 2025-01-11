const API_URI = "http://127.0.0.1:3001/signup";

document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    console.log(email);
    const password = document.getElementById("password").value;

    if (!name) {
      showError("Invalid name");
      return;
    }

    if (!email || !isValidEmail(email)) {
      showError("Invalid email");
      return;
    }

    if (!password || password.length < 8) {
      showError("Password must be atleast 8 characters long");
      return;
    }

    try {
      const response = await signup({ name, email, password });

      if (response.ok) {
        alert("Signup successfull");
      } else {
        const errorData = await response.json();
        showError(errorData.message || "Signup Failed");
      }
    } catch (error) {
      console.error("Error during signup", error);
      showError("An error occured, Please try again later");
    }
  });

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

async function signup(user) {
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
