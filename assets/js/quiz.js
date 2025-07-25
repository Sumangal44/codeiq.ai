import { getCurrentUser, requireAuth, setupUserButton, updateUserScore } from "./userUtils.js"

// Quiz state
const currentQuiz = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  category: "JavaScript",
  timeLeft: 30,
  selectedAnswer: null,
  timer: null,
}

// Fallback questions
const fallbackQuestions = {
  JavaScript: [
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
      answer: "var x = 5;",
    },
    {
      question: "Which method is used to add an element to the end of an array?",
      options: ["push()", "add()", "append()", "insert()"],
      answer: "push()",
    },
    {
      question: "What does '===' operator do in JavaScript?",
      options: ["Assigns value", "Compares value only", "Compares value and type", "Creates variable"],
      answer: "Compares value and type",
    },
    {
      question: "How do you create a function in JavaScript?",
      options: ["function myFunction() {}", "create myFunction() {}", "def myFunction() {}", "func myFunction() {}"],
      answer: "function myFunction() {}",
    },
    {
      question: "What is the result of 'typeof null' in JavaScript?",
      options: ["null", "undefined", "object", "string"],
      answer: "object",
    },
  ],
  Python: [
    {
      question: "How do you create a list in Python?",
      options: ["list = []", "list = ()", "list = {}", "list = <>"],
      answer: "list = []",
    },
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "func", "define"],
      answer: "def",
    },
    {
      question: "What is the correct way to import a module in Python?",
      options: ["import module", "include module", "require module", "use module"],
      answer: "import module",
    },
    {
      question: "How do you start a comment in Python?",
      options: ["//", "/*", "#", "<!--"],
      answer: "#",
    },
    {
      question: "What is the output of print(type([]))?",
      options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
      answer: "<class 'list'>",
    },
  ],
  React: [
    {
      question: "What is JSX in React?",
      options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
      answer: "JavaScript XML",
    },
    {
      question: "How do you create a React component?",
      options: [
        "function Component() {}",
        "class Component extends React.Component {}",
        "Both A and B",
        "component Component() {}",
      ],
      answer: "Both A and B",
    },
    {
      question: "What hook is used for state management in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      answer: "useState",
    },
    {
      question: "How do you pass data to a child component?",
      options: ["Through props", "Through state", "Through context", "Through refs"],
      answer: "Through props",
    },
    {
      question: "What is the virtual DOM?",
      options: [
        "A copy of the real DOM",
        "A JavaScript representation of the DOM",
        "A faster DOM",
        "A React-specific DOM",
      ],
      answer: "A JavaScript representation of the DOM",
    },
  ],
  "HTML/CSS": [
    {
      question: "Which HTML tag is used for the largest heading?",
      options: ["<h1>", "<h6>", "<heading>", "<header>"],
      answer: "<h1>",
    },
    {
      question: "How do you apply CSS to an HTML element?",
      options: ["Using class or id", "Using style attribute", "Using external CSS file", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      answer: "Cascading Style Sheets",
    },
    {
      question: "Which CSS property is used to change text color?",
      options: ["color", "text-color", "font-color", "text-style"],
      answer: "color",
    },
    {
      question: "How do you make text bold in CSS?",
      options: ["font-weight: bold;", "text-style: bold;", "font-style: bold;", "text-weight: bold;"],
      answer: "font-weight: bold;",
    },
  ],
  "Node.js": [
    {
      question: "What is Node.js?",
      options: ["A JavaScript runtime", "A web browser", "A database", "A CSS framework"],
      answer: "A JavaScript runtime",
    },
    {
      question: "Which command is used to install packages in Node.js?",
      options: ["npm install", "node install", "install npm", "get package"],
      answer: "npm install",
    },
    {
      question: "How do you import a module in Node.js?",
      options: ["require('module')", "import 'module'", "include 'module'", "use 'module'"],
      answer: "require('module')",
    },
    {
      question: "What file contains project dependencies in Node.js?",
      options: ["package.json", "dependencies.json", "node.json", "modules.json"],
      answer: "package.json",
    },
    {
      question: "Which method is used to create a server in Node.js?",
      options: ["http.createServer()", "server.create()", "http.server()", "createServer()"],
      answer: "http.createServer()",
    },
  ],
}

// Initialize quiz
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (!requireAuth()) {
    return
  }
  
  showCategorySelection()
})

function showCategorySelection() {
  document.getElementById("loading").classList.add("hidden")
  document.getElementById("category-selection").classList.remove("hidden")

  // Setup user button
  setupUserButton()
  
  document.getElementById("start-quiz-btn").addEventListener("click", startQuiz)
}

function startQuiz() {
  const category = document.getElementById("category-select").value
  currentQuiz.category = category
  currentQuiz.questions = [...fallbackQuestions[category]].sort(() => 0.5 - Math.random()).slice(0, 5)
  currentQuiz.currentQuestion = 0
  currentQuiz.score = 0
  currentQuiz.timeLeft = 30

  document.getElementById("category-selection").classList.add("hidden")
  document.getElementById("quiz-container").classList.remove("hidden")

  setupQuizUI()
  displayQuestion()
  startTimer()
}

function setupQuizUI() {
  document.getElementById("category-badge").textContent = currentQuiz.category
  document.getElementById("next-btn").addEventListener("click", nextQuestion)
}

function displayQuestion() {
  const question = currentQuiz.questions[currentQuiz.currentQuestion]

  document.getElementById("question-counter").textContent =
    `Question ${currentQuiz.currentQuestion + 1} of ${currentQuiz.questions.length}`

  document.getElementById("question-text").textContent = question.question

  const progressPercent = ((currentQuiz.currentQuestion + 1) / currentQuiz.questions.length) * 100
  document.getElementById("progress-bar").style.width = `${progressPercent}%`

  document.getElementById("score-display").textContent = `${currentQuiz.score}/${currentQuiz.questions.length}`

  // Display options
  const optionsContainer = document.getElementById("options-container")
  optionsContainer.innerHTML = ""

  question.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "w-full p-4 text-left rounded-lg border-2 border-zinc-200 hover:border-zinc-300 transition-all"
    button.innerHTML = `<span class="font-medium text-zinc-700">${String.fromCharCode(65 + index)}. ${option}</span>`
    button.addEventListener("click", () => selectAnswer(option, button))
    optionsContainer.appendChild(button)
  })

  // Reset UI state
  currentQuiz.selectedAnswer = null
  document.getElementById("next-btn").disabled = true
  currentQuiz.timeLeft = 30
}

function selectAnswer(answer, button) {
  // Remove previous selection
  document.querySelectorAll("#options-container button").forEach((btn) => {
    btn.classList.remove("border-indigo-600", "bg-indigo-50")
    btn.classList.add("border-gray-200")
  })

  // Highlight selected answer
  button.classList.remove("border-gray-200")
  button.classList.add("border-indigo-600", "bg-indigo-50")

  currentQuiz.selectedAnswer = answer
  document.getElementById("next-btn").disabled = false
}

function startTimer() {
  currentQuiz.timer = setInterval(() => {
    currentQuiz.timeLeft--
    document.getElementById("timer").textContent = `${currentQuiz.timeLeft}s`

    if (currentQuiz.timeLeft <= 0) {
      clearInterval(currentQuiz.timer)
      nextQuestion()
    }
  }, 1000)
}

function nextQuestion() {
  clearInterval(currentQuiz.timer)

  // Check answer
  const currentQuestion = currentQuiz.questions[currentQuiz.currentQuestion]
  if (currentQuiz.selectedAnswer === currentQuestion.answer) {
    currentQuiz.score++
  }

  currentQuiz.currentQuestion++

  if (currentQuiz.currentQuestion < currentQuiz.questions.length) {
    displayQuestion()
    startTimer()
  } else {
    finishQuiz()
  }
}

function finishQuiz() {
  // Update user score
  updateUserScore(currentQuiz.score)
  
  // Save results to localStorage
  localStorage.setItem("quizScore", currentQuiz.score.toString())
  localStorage.setItem("totalQuestions", currentQuiz.questions.length.toString())
  localStorage.setItem("category", currentQuiz.category)

  // Redirect to results
  window.location.href = "../../pages/result.html"
}
