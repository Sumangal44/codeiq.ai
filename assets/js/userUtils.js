// Simple user authentication and management utilities

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

// Get current logged-in user
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser')
  return userStr ? JSON.parse(userStr) : null
}

// Check if user is authenticated
export function isAuthenticated() {
  return getCurrentUser() !== null
}

// Sign out user
export function signOut() {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('rememberUser')
  localStorage.removeItem('lastEmail')
  window.location.href = '../../pages/sign-in.html'
}

// Get user profile data
export function getUserProfile() {
  const currentUser = getCurrentUser()
  if (!currentUser) return null
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  return users.find(user => user.id === currentUser.id)
}

// Update user profile
export function updateUserProfile(updates) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(user => user.id === currentUser.id)
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem('users', JSON.stringify(users))
    
    // Update current user session if name or email changed
    if (updates.name || updates.email) {
      const updatedCurrentUser = {
        ...currentUser,
        ...(updates.name && { name: updates.name }),
        ...(updates.email && { email: updates.email })
      }
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser))
    }
    
    return true
  }
  
  return false
}

// Get all users (for leaderboard)
export function getAllUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

// Update user score
export function updateUserScore(newScore) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(user => user.id === currentUser.id)
  
  if (userIndex !== -1) {
    if (newScore > users[userIndex].score) {
      users[userIndex].score = newScore
      users[userIndex].quizzesCompleted = (users[userIndex].quizzesCompleted || 0) + 1
    }
    users[userIndex].lastQuizDate = new Date().toISOString()
    
    localStorage.setItem('users', JSON.stringify(users))
    return true
  }
  
  return false
}

// Add badge to user
export function addUserBadge(badge) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(user => user.id === currentUser.id)
  
  if (userIndex !== -1) {
    if (!users[userIndex].badges) {
      users[userIndex].badges = []
    }
    
    // Don't add duplicate badges
    if (!users[userIndex].badges.some(b => b.id === badge.id)) {
      users[userIndex].badges.push({
        ...badge,
        earnedAt: new Date().toISOString()
      })
      localStorage.setItem('users', JSON.stringify(users))
      return true
    }
  }
  
  return false
}

// Redirect to sign in if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '../../pages/sign-in.html'
    return false
  }
  return true
}

// Setup user UI elements
export function setupUserButton() {
  const userAccountBtn = document.getElementById("user-account-btn")
  const userAccountName = document.getElementById("user-account-name")
  const userAvatar = document.getElementById("user-avatar")
  const userAvatarFallback = document.getElementById("user-avatar-fallback")
  const userDropdown = document.getElementById("user-dropdown")
  const profileBtn = document.getElementById("profile-btn")
  const logoutBtn = document.getElementById("logout-btn")
  
  const currentUser = getCurrentUser()
  
  if (currentUser && userAccountBtn) {
    const firstName = currentUser.name?.split(' ')[0] || "User"
    userAccountBtn.classList.remove("hidden")
    userAccountBtn.classList.add("flex")
    
    if (userAccountName) {
      userAccountName.textContent = firstName
    }
    
    // Set avatar fallback
    if (userAvatar && userAvatarFallback) {
      userAvatar.style.display = "none"
      userAvatarFallback.style.display = "flex"
      // Show first letter of name in fallback
      const initials = firstName.charAt(0).toUpperCase()
      userAvatarFallback.textContent = initials
      userAvatarFallback.classList.add("text-white", "font-semibold")
    }
    
    // Setup dropdown functionality
    if (userDropdown) {
      userAccountBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        userDropdown.classList.toggle("hidden")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!userAccountBtn.contains(e.target) && !userDropdown.contains(e.target)) {
          userDropdown.classList.add("hidden")
        }
      })

      if (profileBtn) {
        profileBtn.addEventListener("click", () => {
          window.location.href = "../../pages/profile.html"
          userDropdown.classList.add("hidden")
        })
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          signOut()
        })
      }
    }
  }
}

export function getUserDisplayName() {
  const currentUser = getCurrentUser()
  return currentUser ? currentUser.name : "User"
}

export function getUserInitials() {
  const name = getUserDisplayName()
  return name.charAt(0).toUpperCase()
}

// Initialize demo users (for testing)
export function initializeDemoUsers() {
  const users = getAllUsers()
  
  // Only add demo users if no users exist
  if (users.length === 0) {
    const demoUsers = [
      {
        id: 'demo1',
        name: 'Alex Johnson',
        email: 'alex@demo.com',
        password: 'demo123',
        score: 850,
        quizzesCompleted: 12,
        badges: [
          { id: 'first-quiz', name: 'First Quiz', description: 'Completed first quiz' },
          { id: 'high-scorer', name: 'High Scorer', description: 'Scored above 800' }
        ],
        createdAt: THIRTY_DAYS_AGO
      },
      {
        id: 'demo2',
        name: 'Sarah Chen',
        email: 'sarah@demo.com',
        password: 'demo123',
        score: 920,
        quizzesCompleted: 18,
        badges: [
          { id: 'first-quiz', name: 'First Quiz', description: 'Completed first quiz' },
          { id: 'high-scorer', name: 'High Scorer', description: 'Scored above 800' },
          { id: 'expert', name: 'Expert', description: 'Scored above 900' }
        ],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo3',
        name: 'Mike Rodriguez',
        email: 'mike@demo.com',
        password: 'demo123',
        score: 760,
        quizzesCompleted: 8,
        badges: [
          { id: 'first-quiz', name: 'First Quiz', description: 'Completed first quiz' }
        ],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    localStorage.setItem('users', JSON.stringify(demoUsers))
  }
}
