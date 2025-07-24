
// Constants for validation
const MIN_PASSWORD_LENGTH = 8
const SUCCESS_MESSAGE_TIMEOUT = 3000 // 3 seconds
const HOMEPAGE_PATH = '../../index.html'


// Simple user storage utility functions
function saveUser(userData) {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  users.push(userData)
  localStorage.setItem('users', JSON.stringify(users))
}

function userExists(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  return users.some(user => user.email === email)
}

function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('message')
  messageDiv.className = `mt-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`
  messageDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'error' 
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `
  messageDiv.classList.remove('hidden')
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.classList.add('hidden')
    }, SUCCESS_MESSAGE_TIMEOUT)
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already signed in
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    // Redirect to homepage if already signed in
    window.location.href = HOMEPAGE_PATH
    return
  }

  const form = document.getElementById('signup-form')
  
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const formData = new FormData(form)
    const name = formData.get('name').trim()
    const email = formData.get('email').trim().toLowerCase()
    const password = formData.get('password')
    const confirmPassword = formData.get('confirm-password')
    const termsAccepted = formData.get('terms')
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      showMessage('Please fill in all fields.')
      return
    }
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      showMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
      return
    }
    
    if (password !== confirmPassword) {
      showMessage('Passwords do not match.')
      return
    }
    
    if (!termsAccepted) {
      showMessage('Please accept the Terms of Service and Privacy Policy.')
      return
    }
    
    // Check if user already exists
    if (userExists(email)) {
      showMessage('An account with this email already exists. Please sign in instead.')
      return
    }
    
    // Create user with some demo data for better experience
    const userData = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
      score: 75, // Give them a starter score
      quizzesCompleted: 2, // Say they completed 2 starter quizzes
      badges: [
        { 
          id: 'welcome', 
          name: 'Welcome Badge', 
          level: 'Bronze',
          category: 'JavaScript',
          description: 'Welcome to CodeIQ!',
          percentage: 75
        }
      ],
      quizHistory: [
        {
          category: "JavaScript",
          score: 15,
          total: 20,
          percentage: 75,
          badge: "Bronze",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
        },
        {
          category: "HTML/CSS",
          score: 16,
          total: 20,
          percentage: 80,
          badge: "Silver",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ]
    }
    
    try {
      saveUser(userData)
      
      // Set current user
      localStorage.setItem('currentUser', JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: userData.email
      }))
      
      showMessage('Account created successfully! Redirecting...', 'success')
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        window.location.href = '../../index.html'
      }, 2000)
      
    } catch (error) {
      console.error('Error creating account:', error)
      showMessage('Failed to create account. Please try again.')
    }
  })
})
