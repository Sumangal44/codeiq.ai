import {
  getCurrentUser,
  requireAuth,
  setupUserButton,
  getUserProfile,
  addUserBadge
} from "./userUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (!requireAuth()) {
    return;
  }

  initializeResults();
});

function initializeResults() {
  const score = Number.parseInt(localStorage.getItem("quizScore") || "0");
  const total = Number.parseInt(localStorage.getItem("totalQuestions") || "5");
  const category = localStorage.getItem("category") || "JavaScript";

  if (!localStorage.getItem("quizScore")) {
    window.location.href = "../../pages/quiz.html";
    return;
  }

  const percentage = Math.round((score / total) * 100);
  let badge = "bronze";

  if (percentage >= 80) badge = "gold";
  else if (percentage >= 50) badge = "silver";

  // Add badge to user profile
  const badgeData = {
    id: `${badge}-${category
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
    name: `${badge.charAt(0).toUpperCase() + badge.slice(1)} ${category}`,
    description: `Scored ${percentage}% in ${category} quiz`,
    category,
    score: percentage
  };
  addUserBadge(badgeData);

  displayResults(score, total, percentage, badge, category);
}

function displayResults(score, total, percentage, badge, category) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("result-container").classList.remove("hidden");

  // Setup user button
  setupUserButton();

  // Update user greeting
  const userGreeting = document.getElementById("user-greeting");
  const currentUser = getCurrentUser();
  if (currentUser) {
    const firstName = currentUser.name.split(" ")[0] || "User";
    userGreeting.textContent = `Great job, ${firstName}! Here are your results:`;
  } else {
    userGreeting.textContent = "Great job! Here are your results:";
  }

  // Update UI elements
  document.getElementById("score-fraction").textContent = `${score}/${total}`;
  document.getElementById("percentage").textContent = `${percentage}%`;
  document.getElementById(
    "category-display"
  ).textContent = `Category: ${category}`;

  // Set badge
  const badgeIcon = document.getElementById("badge-icon");
  const badgeDisplay = document.getElementById("badge-display");

  const badgeColors = {
    gold: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    silver: "bg-gradient-to-r from-gray-300 to-gray-500",
    bronze: "bg-gradient-to-r from-orange-400 to-orange-600"
  };

  const badgeIcons = {
    gold: `<svg class="h-16 w-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>`,
    silver: `<svg class="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>`,
    bronze: `<svg class="h-16 w-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>`
  };

  badgeIcon.className = `inline-flex p-4 rounded-full mb-4 ${badgeColors[badge]}`;
  badgeIcon.innerHTML = badgeIcons[badge];

  badgeDisplay.className = `inline-block px-6 py-3 rounded-full text-white font-semibold mb-2 ${badgeColors[badge]}`;
  badgeDisplay.textContent = `${
    badge.charAt(0).toUpperCase() + badge.slice(1)
  } Badge Earned!`;
}
