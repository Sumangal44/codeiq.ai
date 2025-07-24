import { 
    getCurrentUser, 
    getUserProfile, 
    updateUserProfile, 
    isAuthenticated, 
    signOut, 
    getUserDisplayName, 
    getUserInitials 
} from "./userUtils.js";

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    setupEventListeners();
});

function checkAuthentication() {
    if (!isAuthenticated()) {
        showNotAuthenticated();
        return;
    }
    
    loadProfile();
    setupUserButton();
}

function showNotAuthenticated() {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("not-authenticated").classList.remove("hidden");
}

function loadProfile() {
    const userProfile = getUserProfile();
    
    if (!userProfile) {
        showNotAuthenticated();
        return;
    }
    
    displayProfile(userProfile);
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("profile-content").classList.remove("hidden");
}

function displayProfile(userProfile) {
    // Basic profile information
    document.getElementById("profile-name").textContent = userProfile.name || "Unknown User";
    document.getElementById("profile-email").textContent = userProfile.email || "No email";
    
    // Format joined date
    const joinedDate = userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : "Unknown";
    document.getElementById("profile-joined").textContent = `Member since: ${joinedDate}`;
    
    // Profile avatar/initials
    const initials = getUserInitials();
    document.getElementById("profile-initials").textContent = initials;
    
    // Statistics
    document.getElementById("profile-score").textContent = userProfile.score || 0;
    document.getElementById("profile-quizzes").textContent = userProfile.quizzesCompleted || 0;
    
    // Badges
    displayBadges(userProfile.badges || []);
    
    // Quiz history
    displayQuizHistory(userProfile.quizHistory || []);
}

function displayBadges(badges) {
    const container = document.getElementById("badges-container");
    const noBadges = document.getElementById("no-badges");
    
    document.getElementById("profile-badges-count").textContent = badges.length;
    
    if (badges.length === 0) {
        container.classList.add("hidden");
        noBadges.classList.remove("hidden");
        return;
    }
    
    container.classList.remove("hidden");
    noBadges.classList.add("hidden");
    
    container.innerHTML = badges.map(badge => `
        <div class="border border-zinc-200 rounded-lg p-4 text-center">
            <div class="mb-3">
                ${getBadgeIcon(badge.level || badge.category)}
            </div>
            <h4 class="font-semibold text-zinc-900 mb-1">${badge.name}</h4>
            <p class="text-sm text-zinc-600 mb-2">${badge.description || ''}</p>
            ${badge.category ? `<span class="inline-block bg-zinc-100 text-zinc-700 text-xs px-2 py-1 rounded">${badge.category}</span>` : ''}
            ${badge.percentage ? `<div class="mt-2 text-sm text-zinc-500">${badge.percentage}% score</div>` : ''}
        </div>
    `).join('');
}

function getBadgeIcon(level) {
    const icons = {
        'Bronze': '<div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto"><svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div>',
        'Silver': '<div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto"><svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div>',
        'Gold': '<div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"><svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div>',
        'JavaScript': '<div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"><span class="text-yellow-600 font-bold text-lg">JS</span></div>',
        'Python': '<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto"><span class="text-blue-600 font-bold text-lg">PY</span></div>',
        'HTML/CSS': '<div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto"><span class="text-orange-600 font-bold text-lg">WEB</span></div>',
        'React': '<div class="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto"><span class="text-cyan-600 font-bold text-lg">⚛️</span></div>',
        'Node.js': '<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto"><span class="text-green-600 font-bold text-lg">NODE</span></div>',
        default: '<div class="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto"><svg class="w-6 h-6 text-zinc-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></div>'
    };
    
    return icons[level] || icons.default;
}

function displayQuizHistory(quizHistory) {
    const container = document.getElementById("quiz-history-container");
    const noHistory = document.getElementById("no-history");
    
    if (quizHistory.length === 0) {
        container.classList.add("hidden");
        noHistory.classList.remove("hidden");
        return;
    }
    
    container.classList.remove("hidden");
    noHistory.classList.add("hidden");
    
    // Sort quiz history by date (most recent first)
    const sortedHistory = quizHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedHistory.map(quiz => {
        const date = new Date(quiz.date).toLocaleDateString();
        const percentage = quiz.percentage || Math.round((quiz.score / quiz.total) * 100);
        const badgeColor = getBadgeColor(percentage);
        
        return `
            <div class="border border-zinc-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h4 class="font-semibold text-zinc-900">${quiz.category}</h4>
                        <p class="text-sm text-zinc-500">${date}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold text-zinc-900">${quiz.score}/${quiz.total}</div>
                        <div class="text-sm text-zinc-600">${percentage}%</div>
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="w-full bg-zinc-200 rounded-full h-2">
                            <div class="bg-${badgeColor}-500 h-2 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                    <span class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${badgeColor}-100 text-${badgeColor}-800">
                        ${quiz.badge || getBadgeLevel(percentage)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function getBadgeColor(percentage) {
    if (percentage >= 90) return 'yellow'; // Gold
    if (percentage >= 75) return 'gray'; // Silver
    if (percentage >= 60) return 'amber'; // Bronze
    return 'zinc'; // No badge
}

function getBadgeLevel(percentage) {
    if (percentage >= 90) return 'Gold';
    if (percentage >= 75) return 'Silver';
    if (percentage >= 60) return 'Bronze';
    return 'None';
}

function setupEventListeners() {
    // Edit profile button
    document.getElementById("edit-profile-btn").addEventListener("click", openEditModal);
    
    // Cancel edit
    document.getElementById("cancel-edit-btn").addEventListener("click", closeEditModal);
    
    // Edit form submission
    document.getElementById("edit-profile-form").addEventListener("submit", handleEditSubmit);
    
    // Close modal when clicking outside
    document.getElementById("edit-modal").addEventListener("click", (e) => {
        if (e.target.id === "edit-modal") {
            closeEditModal();
        }
    });
}

function openEditModal() {
    const userProfile = getUserProfile();
    if (!userProfile) return;
    
    // Populate form with current values
    document.getElementById("edit-name").value = userProfile.name || "";
    document.getElementById("edit-email").value = userProfile.email || "";
    
    // Show modal
    document.getElementById("edit-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeEditModal() {
    document.getElementById("edit-modal").classList.add("hidden");
    document.body.style.overflow = ""; // Restore scrolling
    
    // Clear any messages
    const messageDiv = document.getElementById("edit-message");
    messageDiv.classList.add("hidden");
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim().toLowerCase();
    
    // Validation
    if (!name || !email) {
        showEditMessage("Please fill in all fields.", "error");
        return;
    }
    
    if (!isValidEmail(email)) {
        showEditMessage("Please enter a valid email address.", "error");
        return;
    }
    
    // Update profile
    const updates = { name, email };
    const success = updateUserProfile(updates);
    
    if (success) {
        showEditMessage("Profile updated successfully!", "success");
        
        // Refresh profile display
        setTimeout(() => {
            loadProfile();
            setupUserButton(); // Update header user info
            closeEditModal();
        }, 1500);
    } else {
        showEditMessage("Failed to update profile. Please try again.", "error");
    }
}

function showEditMessage(message, type) {
    const messageDiv = document.getElementById("edit-message");
    messageDiv.className = `p-3 rounded-md ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`;
    messageDiv.textContent = message;
    messageDiv.classList.remove("hidden");
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setupUserButton() {
    const userAccountBtn = document.getElementById("user-account-btn");
    const userAccountName = document.getElementById("user-account-name");
    const userAvatar = document.getElementById("user-avatar");
    const userAvatarFallback = document.getElementById("user-avatar-fallback");
    const userDropdown = document.getElementById("user-dropdown");
    const profileBtn = document.getElementById("profile-btn");
    const logoutBtn = document.getElementById("logout-btn");
    
    const currentUser = getCurrentUser();
    
    if (currentUser && userAccountBtn) {
        const firstName = currentUser.name?.split(' ')[0] || "User";
        userAccountBtn.classList.remove("hidden");
        userAccountBtn.classList.add("flex");
        
        if (userAccountName) {
            userAccountName.textContent = firstName;
        }
        
        // Set avatar fallback
        if (userAvatar && userAvatarFallback) {
            userAvatar.style.display = "none";
            userAvatarFallback.style.display = "flex";
            // Show first letter of name in fallback
            const initials = firstName.charAt(0).toUpperCase();
            userAvatarFallback.textContent = initials;
            userAvatarFallback.classList.add("text-white", "font-semibold");
        }
        
        // Setup dropdown functionality
        if (userDropdown) {
            userAccountBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle("hidden");
            });

            // Close dropdown when clicking outside
            document.addEventListener("click", (e) => {
                if (!userAccountBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.add("hidden");
                }
            });

            if (profileBtn) {
                profileBtn.addEventListener("click", () => {
                    // Already on profile page, just close dropdown
                    userDropdown.classList.add("hidden");
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    signOut();
                });
            }
        }
    }
}