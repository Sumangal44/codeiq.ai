import { getCurrentUser, isAuthenticated, signOut, initializeDemoUsers } from "./userUtils.js"

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initialize demo users for testing
  initializeDemoUsers()
  
  initializeAuth()
  setupEventListeners()
})

function initializeAuth() {
  const userInfo = document.getElementById("user-info")
  const authButtons = document.getElementById("auth-buttons")
  const authenticatedCTA = document.getElementById("authenticated-cta")
  const unauthenticatedCTA = document.getElementById("unauthenticated-cta")
  const welcomeText = document.getElementById("welcome-text")
  const userAvatar = document.getElementById("user-avatar")
  const userAvatarFallback = document.getElementById("user-avatar-fallback")
  const userName = document.getElementById("user-name")

  const currentUser = getCurrentUser()

  if (currentUser) {
    // User is signed in
    if (userInfo) {
      userInfo.classList.remove("hidden")
      userInfo.classList.add("flex")
    }
    if (authButtons) authButtons.classList.add("hidden")
    if (authenticatedCTA) authenticatedCTA.classList.remove("hidden")
    if (unauthenticatedCTA) unauthenticatedCTA.classList.add("hidden")

    const firstName = currentUser.name.split(' ')[0] || "User"
    if (welcomeText) welcomeText.textContent = `Welcome, ${firstName}!`
    if (userName) userName.textContent = firstName

    // Set avatar fallback
    if (userAvatar && userAvatarFallback) {
      userAvatar.style.display = "none"
      userAvatarFallback.style.display = "flex"
      // Show first letter of name in fallback
      const initials = firstName.charAt(0).toUpperCase()
      userAvatarFallback.innerHTML = `<span class="text-white font-semibold">${initials}</span>`
    }
  } else {
    // User is not signed in
    if (userInfo) {
      userInfo.classList.add("hidden")
      userInfo.classList.remove("flex")
    }
    if (authButtons) authButtons.classList.remove("hidden")
    if (authenticatedCTA) authenticatedCTA.classList.add("hidden")
    if (unauthenticatedCTA) unauthenticatedCTA.classList.remove("hidden")
  }
}

function setupEventListeners() {
  // Add event listeners
  const signInBtn = document.getElementById("sign-in-btn")
  const signUpBtn = document.getElementById("sign-up-btn")
  const getStartedBtn = document.getElementById("get-started-btn")
  const userButton = document.getElementById("user-button")
  const userDropdown = document.getElementById("user-dropdown")
  const profileBtn = document.getElementById("profile-btn")
  const logoutBtn = document.getElementById("logout-btn")

  if (signInBtn) {
    signInBtn.addEventListener("click", () => {
      window.location.href = "../../pages/sign-in.html"
    })
  }

  if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
      window.location.href = "../../pages/sign-up.html"
    })
  }

  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      if (isAuthenticated()) {
        window.location.href = "../../pages/quiz.html"
      } else {
        window.location.href = "../../pages/sign-in.html"
      }
    })
  }

  // User dropdown functionality
  if (userButton && userDropdown) {
    userButton.addEventListener("click", (e) => {
      e.stopPropagation()
      userDropdown.classList.toggle("hidden")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.add("hidden")
      }
    })
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      window.location.href = "../../pages/profile.html"
      if (userDropdown) userDropdown.classList.add("hidden")
    })
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut()
    })
  }
}
