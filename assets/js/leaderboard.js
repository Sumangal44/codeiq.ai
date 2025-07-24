import { getCurrentUser, setupUserButton, getAllUsers, initializeDemoUsers } from "./userUtils.js"

document.addEventListener("DOMContentLoaded", () => {
  // Initialize demo users
  initializeDemoUsers()
  
  // Setup user button
  setupUserButton()
  
  initializeLeaderboard()
})

function initializeLeaderboard() {
  document.getElementById("loading").classList.add("hidden")
  document.getElementById("leaderboard-container").classList.remove("hidden")

  // Load initial leaderboard
  loadLeaderboard()

  // Setup event listeners
  document.getElementById("leaderboard-type").addEventListener("change", loadLeaderboard)
  document.getElementById("category-filter").addEventListener("change", loadLeaderboard)
}

function loadLeaderboard() {
  const type = document.getElementById("leaderboard-type").value
  const categoryFilter = document.getElementById("category-filter").value

  // Get all users and sort by score
  const users = getAllUsers()
  let leaderboardData = users
    .filter(user => user.score > 0) // Only show users with scores
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      score: user.score || 0,
      totalQuizzes: user.quizzesCompleted || 0,
      badges: user.badges || [],
      favoriteCategory: getFavoriteCategory(user.badges),
      averagePercentage: Math.round(user.score),
      profileImage: null
    }))
    .sort((a, b) => b.score - a.score)

  // Filter by category if selected
  if (categoryFilter) {
    leaderboardData = leaderboardData.filter(user => 
      user.badges.some(badge => badge.category === categoryFilter)
    )
  }

  // Apply weekly filter if selected (for demo, just use the same data)
  if (type === "weekly") {
    // In a real app, you'd filter by date
    leaderboardData = leaderboardData.slice(0, Math.min(leaderboardData.length, 5))
  }

  displayLeaderboard(leaderboardData)
}

function getFavoriteCategory(badges) {
  if (!badges || badges.length === 0) return "None"
  
  // Count categories
  const categoryCount = {}
  badges.forEach(badge => {
    const category = badge.category || badge.name?.split(' ').slice(1).join(' ') || "General"
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })
  
  // Find most common category
  let favoriteCategory = "None"
  let maxCount = 0
  for (const [category, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count
      favoriteCategory = category
    }
  }
  
  return favoriteCategory
}

function displayLeaderboard(data) {
  const tbody = document.getElementById("leaderboard-body")
  const emptyState = document.getElementById("empty-state")
  
  if (data.length === 0) {
    tbody.innerHTML = ""
    emptyState.classList.remove("hidden")
    return
  }
  
  emptyState.classList.add("hidden")
  
  tbody.innerHTML = data.map((user, index) => {
    const rank = index + 1
    const rankDisplay = getRankDisplay(rank)
    const badgesHtml = getBadgesHtml(user.badges)
    
    return `
      <tr class="hover:bg-zinc-50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            ${rankDisplay}
            <span class="ml-2 text-sm font-medium text-gray-900">#${rank}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-zinc-600 flex items-center justify-center">
              <span class="text-white font-semibold">${user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${user.name}</div>
              <div class="text-sm text-gray-500">${user.email}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${user.averagePercentage}%</div>
          <div class="text-sm text-gray-500">Score: ${user.score}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-gray-900">${user.totalQuizzes}</div>
          <div class="text-sm text-gray-500">Completed</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex flex-wrap gap-1">
            ${badgesHtml}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${user.favoriteCategory}
          </span>
        </td>
      </tr>
    `
  }).join('')
}

function getRankDisplay(rank) {
  const trophyColors = {
    1: "text-yellow-500", // Gold
    2: "text-gray-400",   // Silver
    3: "text-orange-600"  // Bronze
  }
  
  if (rank <= 3) {
    return `
      <svg class="h-5 w-5 ${trophyColors[rank]}" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 15.5A3.5 3.5 0 008.5 12A3.5 3.5 0 0012 8.5a3.5 3.5 0 003.5 3.5A3.5 3.5 0 0012 15.5z"/>
        <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10 10.91 6.74 8 6l2.91-.74L12 2z"/>
        <path d="M12 14l.54 1.63L14 16l-1.46.37L12 18l-.54-1.63L10 16l1.46-.37L12 14z"/>
      </svg>
    `
  }
  
  return `
    <div class="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center">
      <span class="text-xs font-medium text-gray-600">${rank}</span>
    </div>
  `
}

function getBadgesHtml(badges) {
  if (!badges || badges.length === 0) {
    return '<span class="text-xs text-gray-500">No badges</span>'
  }
  
  const badgeColors = {
    gold: "bg-yellow-100 text-yellow-800",
    silver: "bg-gray-100 text-gray-800", 
    bronze: "bg-orange-100 text-orange-800",
    platinum: "bg-purple-100 text-purple-800"
  }
  
    // Group badges by level and show count
  const badgeGroups = {}
  badges.forEach(badge => {
    let level = 'bronze' // default
    if (badge.name?.toLowerCase().includes('gold')) level = 'gold'
    else if (badge.name?.toLowerCase().includes('silver')) level = 'silver'
    else if (badge.name?.toLowerCase().includes('platinum')) level = 'platinum'
    
    badgeGroups[level] = (badgeGroups[level] || 0) + 1
  })
  
  return Object.entries(badgeGroups)
    .map(([level, count]) => 
      `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeColors[level]}">
        ${level.charAt(0).toUpperCase() + level.slice(1)} ${count > 1 ? `(${count})` : ''}
      </span>`
    )
    .join('')
}

// Function to add a quiz result to the leaderboard (called from result.js)
function addToLeaderboard(userResult) {
  try {
    const users = getAllUsers()
    
    // Find existing user or update
    const existingUserIndex = users.findIndex(user => 
      user.name === userResult.name || user.id === userResult.id
    )
    
    if (existingUserIndex !== -1) {
      // Update existing user's score if this is better
      const existingUser = users[existingUserIndex]
      if ((userResult.score || 0) > (existingUser.score || 0)) {
        users[existingUserIndex] = {
          ...existingUser,
          score: userResult.score || 0,
          quizzesCompleted: (existingUser.quizzesCompleted || 0) + 1,
          badges: [...(existingUser.badges || []), ...(userResult.badges || [])],
          lastPlayed: new Date().toISOString()
        }
      }
    }
    
    console.log("Added user result to leaderboard:", userResult)
    return users
  } catch (error) {
    console.error("Error adding to leaderboard:", error)
    return []
  }
}

// Make functions globally accessible
window.addToLeaderboard = addToLeaderboard
