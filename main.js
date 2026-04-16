function loadNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let user = sessionStorage.getItem("loggedInUser");

  // Check cookie if not in session
  if (!user) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
      const [name, value] = c.split("=");
      if (name === "rememberUser") {
        user = value;
        sessionStorage.setItem("loggedInUser", user);
      }
    }
  }

  // LOGGED IN NAVBAR
  if (user) {
    navbar.innerHTML = `
    <div class="logo-and-welcome">
        <div class="logo">
          <a href="home.html">
            <img src="images/logo.png" alt="Logo"/>
          </a>
        </div>
        <span id="welcomeUser" class="welcome-message"></span>
      </div>

      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="cards.html">Cards</a></li>
        <li><a href="favourite.html">Favourite</a></li>
        <li><a href="beginner.html">For Beginner</a></li>
        <li><a href="decks.html">Deck Guide</a></li>
        <li><a href="javascript:void(0)" onclick="logout()">Logout</a></li>
      </ul>
    `;
  } 
  // NOT LOGGED IN NAVBAR
  else {
    navbar.innerHTML = `
      <div class="logo-and-welcome">
        <div class="logo">
          <a href="index.html">
            <img src="images/logo.png" alt="Logo"/>
          </a>
        </div>
      </div>

      <ul>
        <li><a href="about.html">About</a></li>
        <li><a href="beginner.html">For Beginner</a></li>
        <li><a href="decks.html">Deck Guide</a></li>
        <li><a href="login.html">Log In</a></li>
      </ul>
    `;
  }
}

// RUN NAVBAR ON PAGE LOAD
window.addEventListener("load", loadNavbar);

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = existingUsers.find(user => 
      user.username === username && user.password === password
    );

    if (!validUser) {
      alert("Invalid username or password!");
      return;
    }

    sessionStorage.setItem("loggedInUser", username);

    // Set welcome message flag (only once)
    sessionStorage.setItem("showWelcome", "true");

    // REMEMBER ME COOKIE
    if (rememberMe) {
      document.cookie = `rememberUser=${username}; max-age=${7*24*60*60}`;
    }

    // Redirect to home.html
    window.location.href = "home.html";
  });
}

// NAVIGATION
function goToSignup() {
  window.location.href = "signup.html";
}

// SIGN UP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // USERNAME VALIDATION
    const usernameRegex = /^[A-Za-z0-9]{3,15}$/;
    if (!usernameRegex.test(username)) {
      alert("Username must be 3-15 characters and contain only letters and numbers.");
      return;
    }

    // CHECK DUPLICATE USERNAME
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.find(user => user.username === username)) {
      alert("Username already exists!");
      return;
    }

    // EMAIL VALIDATION
    if (!email.endsWith("@gmail.com")) {
      alert("Email must end with @gmail.com");
      return;
    }

    // PASSWORD VALIDATION
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters and include uppercase, lowercase, and a symbol.");
      return;
    }

    // SAVE USER
    existingUsers.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  });
}

function forgotPassword() {
  const email = prompt("Enter your registered email:");

  if (!email) {
    alert("Email is required!");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email);

  if (user) {
    alert(`Your credentials:\nUsername: ${user.username}\nPassword: ${user.password}`);
  } else {
    alert("Email not found. Please check and try again.");
  }
}

// CHECK LOGIN & WELCOME ONCE
window.addEventListener("load", function() {
  let user = sessionStorage.getItem("loggedInUser");

  // Check cookie if sessionStorage is empty
  if (!user) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
      const [name, value] = c.split("=");
      if (name === "rememberUser") {
        user = value;
        sessionStorage.setItem("loggedInUser", user);
      }
    }
  }

  if (!user) return;

  const welcomeEl = document.getElementById("welcomeUser");
  if (!welcomeEl) return;

  // Show welcome message only once
  const showWelcome = sessionStorage.getItem("showWelcome");
  if (showWelcome === "true") {
    welcomeEl.innerText = "Welcome, Trainer " + user + "!";
    sessionStorage.removeItem("showWelcome");
  }
});

const currentUser = sessionStorage.getItem("loggedInUser");
let cardCache = JSON.parse(localStorage.getItem("pkCardCache_" + currentUser) || "{}");

function saveCache() {
  const currentUser = sessionStorage.getItem("loggedInUser");
  localStorage.setItem("pkCardCache_" + currentUser, JSON.stringify(cardCache));
}

function logout() {
  sessionStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("showWelcome");
  document.cookie = "rememberUser=; max-age=0";
  window.location.href = "index.html";
}