
// Simple user authentication utility functions
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]')
}

function authenticateUser(email, password) {
  const users = getUsers()
  return users.find(user => user.email === email && user.password === password)
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
      <span id="message-text"></span>
    </div>
  `
  document.getElementById('message-text').textContent = message;
  messageDiv.classList.remove('hidden')
  
  if (type === 'success') {
    setTimeout(() => {
      messageDiv.classList.add('hidden')
    }, 3000)
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already signed in
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    // Redirect to homepage if already signed in
    window.location.href = "../../index.html"
    return
  }

  const form = document.getElementById('signin-form')
  
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const formData = new FormData(form)
    const email = formData.get('email').trim().toLowerCase()
    const password = formData.get('password')
    const rememberMe = formData.get('remember-me')
    
    // Validation
    if (!email || !password) {
      showMessage('Please fill in all fields.')
      return
    }
    
    // Authenticate user
    const user = authenticateUser(email, password)
    
    if (!user) {
      showMessage('Invalid email or password. Please try again.')
      return
    }
    
    try {
      // Set current user
      const currentUserData = {
        id: user.id,
        name: user.name,
        email: user.email
      }
      
      sessionStorage.setItem('currentUser', JSON.stringify(currentUserData))
      
      // Set remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberUser', 'true')
        localStorage.setItem('lastEmail', email)
      } else {
        localStorage.removeItem('rememberUser')
        localStorage.removeItem('lastEmail')
      }
      
      showMessage('Signed in successfully! Redirecting...', 'success')
      
      // Redirect to homepage after 1.5 seconds
      setTimeout(() => {
        window.location.href = '../../index.html'
      }, 1500)
      
    } catch (error) {
      console.error('Error signing in:', error)
      showMessage('Failed to sign in. Please try again.')
    }
  })
  
  // Auto-fill email if remember me was checked
  const rememberUser = localStorage.getItem('rememberUser')
  if (rememberUser && localStorage.getItem('lastEmail')) {
    document.getElementById('email').value = localStorage.getItem('lastEmail')
    document.getElementById('remember-me').checked = true
  }
})
