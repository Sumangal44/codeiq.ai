import {
  getCurrentUser,
  requireAuth,
  setupUserButton,
  getUserProfile,
  getAllUsers
} from "./userUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Require authentication
  if (!requireAuth()) return;

  // Setup user button
  setupUserButton();

  // Initialize profile
  await initializeProfile();
});

async function initializeProfile() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = "../../pages/sign-in.html";
    return;
  }

  try {
    // Show loading state
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("profile-container").classList.add("hidden");

    // Get user profile data from localStorage
    const userProfile = getUserProfileFromLocalStorage(currentUser);

    // Display profile
    displayProfile(userProfile);

    // Hide loading and show content
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("profile-container").classList.remove("hidden");
  } catch (error) {
    console.error("Error loading profile:", error);
    showProfileError();
  }
}

function getUserProfileFromLocalStorage(currentUser) {
  const allUsers = getAllUsers();
  const user = allUsers.find((u) => u.id === currentUser.id) || currentUser;

  // Calculate statistics from user data
  const totalQuizzes = user.quizzesCompleted || 0;
  const averageScore = user.score || 0;
  const badges = user.badges || [];

  // Create mock quiz history if none exists
  let quizHistory = user.quizHistory || [];
  if (quizHistory.length === 0 && totalQuizzes > 0) {
    // Generate some mock quiz history based on user data
    quizHistory = [
      {
        category: "JavaScript",
        score: Math.floor(averageScore * 0.2),
        total: 20,
        percentage: Math.round(averageScore),
        badge:
          averageScore > 90 ? "Gold" : averageScore > 75 ? "Silver" : "Bronze",
        date: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString()
      }
    ];
  }

  // Group badges by category and create category stats
  const categoryStats = {};
  badges.forEach((badge) => {
    const category = badge.category || "JavaScript";
    if (!categoryStats[category]) {
      categoryStats[category] = {
        score: 0,
        total: 20,
        count: 1,
        badges: []
      };
    }
    categoryStats[category].badges.push(badge);
    categoryStats[category].count++;
    categoryStats[category].score = Math.floor(averageScore * 0.2); // Mock score based on percentage
  });

  // If no category stats exist, create default ones
  if (Object.keys(categoryStats).length === 0 && totalQuizzes > 0) {
    categoryStats["JavaScript"] = {
      score: Math.floor(averageScore * 0.2),
      total: 20,
      count: 1,
      badges: badges.length > 0 ? [badges[0]] : []
    };
  }

  // Determine favorite category
  const favoriteCategory = Object.keys(categoryStats).reduce(
    (fav, cat) =>
      categoryStats[cat].count > (categoryStats[fav]?.count || 0) ? cat : fav,
    "JavaScript"
  );

  return {
    name: user.name || "User",
    email: user.email || "user@example.com",
    createdAt: user.createdAt || new Date().toISOString(),
    totalQuizzes: totalQuizzes,
    averageScore: averageScore / 100, // Convert to decimal for percentage calculation
    favoriteCategory: favoriteCategory,
    badges: badges,
    categoryStats: categoryStats,
    quizHistory: quizHistory
  };
}

function displayProfile(userProfile) {
  // Update user info section
  const userNameElement = document.getElementById("user-name");
  const userEmailElement = document.getElementById("user-email");
  const memberSinceElement = document.getElementById("member-since");

  if (userNameElement) userNameElement.textContent = userProfile.name;
  if (userEmailElement) userEmailElement.textContent = userProfile.email;
  if (memberSinceElement) {
    const memberSince = new Date(userProfile.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
    memberSinceElement.textContent = memberSince;
  }

  // Update profile avatar
  const userAvatar = document.getElementById("user-avatar");
  const userAvatarFallback = document.getElementById("user-avatar-fallback");

  if (userProfile.profileImage) {
    userAvatar.src = userProfile.profileImage;
    userAvatar.style.display = "block";
    userAvatarFallback.style.display = "none";
  } else {
    userAvatar.style.display = "none";
    userAvatarFallback.style.display = "flex";
    const initials = userProfile.name.charAt(0).toUpperCase();
    userAvatarFallback.innerHTML = `<span class="text-white font-semibold text-4xl">${initials}</span>`;
  }

  // Update stats
  updateProfileStats(userProfile);

  // Update badges section
  updateBadgesSection(userProfile.badges);

  // Update quiz history
  updateQuizHistory(userProfile.quizHistory);

  // Update category breakdown
  updateCategoryBreakdown(userProfile.categoryStats);
}

function updateProfileStats(userProfile) {
  // Update stat cards with fallbacks for undefined values
  const totalQuizzesElement = document.getElementById("total-quizzes");
  const averageScoreElement = document.getElementById("average-score");
  const favoriteCategoryElement = document.getElementById("favorite-category");
  const totalBadgesElement = document.getElementById("total-badges");

  if (totalQuizzesElement)
    totalQuizzesElement.textContent = userProfile.totalQuizzes || 0;
  if (averageScoreElement)
    averageScoreElement.textContent = `${Math.round(
      (userProfile.averageScore || 0) * 100
    )}%`;
  if (favoriteCategoryElement)
    favoriteCategoryElement.textContent =
      userProfile.favoriteCategory || "JavaScript";
  if (totalBadgesElement)
    totalBadgesElement.textContent = (userProfile.badges || []).length;
}

function updateBadgesSection(badges) {
  const badgesContainer = document.getElementById("badges-container");

  if (!badgesContainer) return;

  // Ensure badges is an array
  if (!Array.isArray(badges) || badges.length === 0) {
    badgesContainer.innerHTML = `
      <div class="col-span-full text-center py-8">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No badges yet</h3>
        <p class="text-gray-500">Take more quizzes to earn badges!</p>
        <a href="quiz.html" class="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Start Quiz
        </a>
      </div>
    `;
    return;
  }

  badgesContainer.innerHTML = badges
    .map((badge) => {
      const badgeColors = {
        Platinum: "bg-purple-100 text-purple-800 border-purple-200",
        Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Silver: "bg-gray-100 text-gray-800 border-gray-200",
        Bronze: "bg-orange-100 text-orange-800 border-orange-200"
      };

      const level = badge.level || badge.badge || "Bronze";
      const colorClass = badgeColors[level] || badgeColors.Bronze;

      return `
      <div class="border-2 ${colorClass} rounded-lg p-4 text-center">
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-semibold">${level}</div>
        <div class="text-sm">${badge.category || "General"}</div>
        ${
          badge.percentage
            ? `<div class="text-xs mt-1">${badge.percentage}%</div>`
            : ""
        }
      </div>
    `;
    })
    .join("");
}

function updateQuizHistory(quizHistory) {
  const historyContainer = document.getElementById("quiz-history");

  if (!historyContainer) return;

  // Ensure quizHistory is an array
  if (!Array.isArray(quizHistory) || quizHistory.length === 0) {
    historyContainer.innerHTML = `
      <div class="text-center py-8">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No quiz history</h3>
        <p class="text-gray-500">Take your first quiz to see your progress!</p>
        <a href="quiz.html" class="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Take Your First Quiz
        </a>
      </div>
    `;
    return;
  }

  historyContainer.innerHTML = quizHistory
    .slice(0, 10)
    .map((quiz) => {
      const date = quiz.date
        ? new Date(quiz.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        : "Unknown date";

      const badgeColor =
        quiz.badge === "Platinum"
          ? "purple"
          : quiz.badge === "Gold"
          ? "yellow"
          : quiz.badge === "Silver"
          ? "gray"
          : "orange";

      return `
      <div class="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
        <div>
          <div class="font-medium text-gray-900">${
            quiz.category || "Unknown Category"
          }</div>
          <div class="text-sm text-gray-500">${date}</div>
        </div>
        <div class="text-right">
          <div class="font-medium text-gray-900">${quiz.score || 0}/${
        quiz.total || 20
      }</div>
          <div class="text-sm">
            <span class="text-gray-500">${quiz.percentage || 0}%</span>
            ${
              quiz.badge
                ? `<span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${badgeColor}-100 text-${badgeColor}-800">${quiz.badge}</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

function updateCategoryBreakdown(categoryStats) {
  const categoryContainer = document.getElementById("category-breakdown");

  if (!categoryContainer) return;

  // Ensure categoryStats is an object
  if (!categoryStats || typeof categoryStats !== "object") {
    categoryStats = {};
  }

  const categories = Object.keys(categoryStats);

  if (categories.length === 0) {
    categoryContainer.innerHTML = `
      <div class="text-center py-8">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
        <p class="text-gray-500">Take quizzes in different categories to see your breakdown!</p>
        <a href="quiz.html" class="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Take a Quiz
        </a>
      </div>
    `;
    return;
  }

  categoryContainer.innerHTML = categories
    .map((category) => {
      const stats = categoryStats[category] || {
        score: 0,
        total: 20,
        count: 0,
        badges: []
      };
      const percentage =
        stats.total > 0 ? Math.round((stats.score / stats.total) * 100) : 0;

      return `
      <div class="bg-white p-4 border border-gray-200 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium text-gray-900">${category}</h4>
          <span class="text-sm text-gray-500">${stats.count || 0} ${
        (stats.count || 0) === 1 ? "quiz" : "quizzes"
      }</span>
        </div>
        <div class="mb-2">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>${percentage}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-zinc-600 h-2 rounded-full" style="width: ${percentage}%"></div>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          ${(stats.badges || [])
            .map(
              (badge) => `
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              ${badge.level || badge.badge || "Bronze"}
            </span>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");
}

function showProfileError() {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("profile-container").classList.remove("hidden");

  const container = document.getElementById("profile-container");
  container.innerHTML = `
    <div class="text-center py-12">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h2>
      <p class="text-gray-600 mb-6">We couldn't load your profile data. Please try again later.</p>
      <button onclick="location.reload()" class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
        Retry
      </button>
    </div>
  `;
}
