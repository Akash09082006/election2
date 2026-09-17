/**
 * VoteAware - Modern Election Awareness Platform
 * Consolidated 2-in-1 JavaScript (Core App Logic + Voter IQ Quiz Engine)
 */

/* ==========================================================================
   PART 1: VOTER IQ QUIZ ENGINE DATA & CLASS
   ========================================================================== */

const quizData = [
  {
    question: "What is the minimum legal age to register and vote in general elections?",
    options: [
      "16 years old",
      "18 years old",
      "21 years old",
      "25 years old"
    ],
    correct: 1,
    explanation: "In most democratic systems worldwide, any citizen who turns 18 on or before the qualifying registration date is legally eligible to vote."
  },
  {
    question: "If you misplace your Voter ID card, can you still cast your ballot on Polling Day?",
    options: [
      "No, you are completely barred from voting without that specific card.",
      "Yes, provided your name is on the electoral roll and you bring a valid government photo ID.",
      "Only if a family member vouches for you verbally.",
      "Only if you pay an expedited fee at the polling station."
    ],
    correct: 1,
    explanation: "Being registered on the active electoral roll is what legally enfranchises you. You can show alternative approved photo IDs (Passport, Driver's License, National ID, etc.) to vote."
  },
  {
    question: "What does the principle of a 'Secret Ballot' protect?",
    options: [
      "It keeps election dates secret from the public.",
      "It ensures that your individual vote choice remains 100% confidential and protected from coercion.",
      "It allows political parties to keep their funding secret.",
      "It keeps the final election tally confidential."
    ],
    correct: 1,
    explanation: "The secret ballot ensures that no government authority, party representative, employer, or family member can discover how you voted, preventing retaliation or intimidation."
  },
  {
    question: "What is the primary function of the VVPAT (Voter Verifiable Paper Audit Trail)?",
    options: [
      "It prints a receipt that you take home as proof of voting.",
      "It allows you to visually verify that your vote was cast accurately for your chosen candidate before securely sealing it in a ballot box.",
      "It automatically uploads your ballot to social media.",
      "It acts as a ticket to claim election rewards."
    ],
    correct: 1,
    explanation: "VVPAT creates an independent paper verification for the voter to see for ~7 seconds behind a glass window, ensuring machine integrity and enabling recount audits."
  },
  {
    question: "What is NOTA (None of the Above) on a ballot paper or voting machine?",
    options: [
      "A vote for the candidate currently in power.",
      "An invalid or spoiled ballot that is thrown away.",
      "An option allowing voters to formally express dissatisfaction with all nominated candidates without violating ballot secrecy.",
      "A bonus vote given to independent candidates."
    ],
    correct: 2,
    explanation: "NOTA provides citizens with a peaceful, constitutional mechanism to register their disapproval of all competing candidates while still performing their civic duty."
  },
  {
    question: "When does the 'Campaign Silence Period' typically begin ahead of Polling Day?",
    options: [
      "1 hour before voting starts",
      "48 hours before the conclusion of polling",
      "30 days in advance",
      "Only after voting closes"
    ],
    correct: 1,
    explanation: "The silence period (usually 48 hours ending with the close of poll) bans rallies, loud broadcasts, and aggressive canvassing to give voters a peaceful window for contemplation."
  },
  {
    question: "Can an employer legally deduct your salary or fire you for taking time to vote on Election Day?",
    options: [
      "Yes, work always takes priority over voting.",
      "No, electoral and labor laws in most democracies guarantee paid time off or declare a public holiday for voting.",
      "Only if you vote for the candidate the company endorses.",
      "Yes, unless you have been employed for more than 5 years."
    ],
    correct: 1,
    explanation: "Democratic laws protect employees by mandating that employers grant reasonable paid time off to exercise their fundamental voting rights without fear of penalty."
  }
];

class VoterQuiz {
  constructor() {
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;

    // Elements
    this.startView = document.getElementById("quiz-start-view");
    this.questionView = document.getElementById("quiz-question-view");
    this.resultView = document.getElementById("quiz-result-view");
    this.meta = document.getElementById("quiz-meta");
    this.progressBar = document.getElementById("quiz-progress-bar-wrap");
    this.progressFill = document.getElementById("quiz-progress-fill");

    this.progressText = document.getElementById("question-progress");
    this.scoreTag = document.getElementById("current-score-tag");
    this.questionTitle = document.getElementById("question-title");
    this.optionsContainer = document.getElementById("options-container");

    this.feedbackBox = document.getElementById("feedback-box");
    this.feedbackIcon = document.getElementById("feedback-icon");
    this.feedbackStatus = document.getElementById("feedback-status");
    this.feedbackExplanation = document.getElementById("feedback-explanation");
    this.nextBtn = document.getElementById("next-question-btn");

    this.startBtn = document.getElementById("start-quiz-btn");
    this.restartBtn = document.getElementById("restart-quiz-btn");

    this.initEventListeners();
  }

  initEventListeners() {
    if (this.startBtn) {
      this.startBtn.addEventListener("click", () => this.startQuiz());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.handleNextQuestion());
    }
    if (this.restartBtn) {
      this.restartBtn.addEventListener("click", () => this.restartQuiz());
    }
  }

  startQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.startView.style.display = "none";
    this.resultView.style.display = "none";
    this.meta.style.display = "flex";
    this.progressBar.style.display = "block";
    this.questionView.style.display = "block";
    this.renderQuestion();
  }

  renderQuestion() {
    this.answered = false;
    this.feedbackBox.style.display = "none";
    const currentQ = quizData[this.currentIndex];

    // Update Progress
    this.progressText.textContent = `Question ${this.currentIndex + 1} of ${quizData.length}`;
    this.scoreTag.textContent = `Score: ${this.score}`;
    const progressPercent = ((this.currentIndex) / quizData.length) * 100;
    this.progressFill.style.width = `${progressPercent}%`;

    // Render Question & Options
    this.questionTitle.textContent = currentQ.question;
    this.optionsContainer.innerHTML = "";

    const letters = ["A", "B", "C", "D"];
    currentQ.options.forEach((optText, index) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-indicator">${letters[index]}</span>
        <span class="option-text">${optText}</span>
      `;
      btn.addEventListener("click", () => this.selectOption(index, btn));
      this.optionsContainer.appendChild(btn);
    });
  }

  selectOption(selectedIndex, selectedBtn) {
    if (this.answered) return;
    this.answered = true;

    const currentQ = quizData[this.currentIndex];
    const optionButtons = this.optionsContainer.querySelectorAll(".option-btn");

    optionButtons.forEach(btn => btn.disabled = true);
    const isCorrect = selectedIndex === currentQ.correct;

    if (isCorrect) {
      this.score++;
      this.scoreTag.textContent = `Score: ${this.score}`;
      selectedBtn.classList.add("correct");
      this.feedbackBox.className = "feedback-box status-correct";
      this.feedbackIcon.textContent = "✓";
      this.feedbackStatus.textContent = "Correct! Well Done.";
    } else {
      selectedBtn.classList.add("incorrect");
      optionButtons[currentQ.correct].classList.add("correct");
      this.feedbackBox.className = "feedback-box status-incorrect";
      this.feedbackIcon.textContent = "✕";
      this.feedbackStatus.textContent = "Not quite!";
    }

    this.feedbackExplanation.textContent = currentQ.explanation;
    this.feedbackBox.style.display = "block";

    if (this.currentIndex === quizData.length - 1) {
      this.nextBtn.textContent = "View Final Results 🏆";
    } else {
      this.nextBtn.innerHTML = "Next Question &rarr;";
    }
  }

  handleNextQuestion() {
    if (this.currentIndex < quizData.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    this.questionView.style.display = "none";
    this.meta.style.display = "none";
    this.progressBar.style.display = "none";
    this.resultView.style.display = "block";

    const total = quizData.length;
    document.getElementById("final-score-num").textContent = this.score;
    document.getElementById("total-score-num").textContent = total;

    const badgeIcon = document.getElementById("result-badge-icon");
    const resultTier = document.getElementById("result-tier");
    const resultMsg = document.getElementById("result-message");
    const resultTitle = document.getElementById("result-title");

    const percentage = (this.score / total) * 100;

    if (percentage === 100) {
      badgeIcon.textContent = "🏆";
      resultTitle.textContent = "Outstanding Achievement!";
      resultTier.textContent = "Tier: Master Democracy Champion";
      resultMsg.textContent = "Flawless score! You possess a comprehensive understanding of electoral rights, ballot verification, and democratic processes. You are ready to guide other first-time voters!";
    } else if (percentage >= 70) {
      badgeIcon.textContent = "🎖️";
      resultTitle.textContent = "Excellent Civic Knowledge!";
      resultTier.textContent = "Tier: Certified Informed Voter";
      resultMsg.textContent = "Great job! You know your voter rights and are well prepared to participate confidently on election day.";
    } else if (percentage >= 40) {
      badgeIcon.textContent = "📘";
      resultTitle.textContent = "Good Effort!";
      resultTier.textContent = "Tier: Active Civic Explorer";
      resultMsg.textContent = "You have a solid foundation! Review our Step-by-Step Election Process and Voter Guide sections above to sharpen your polling booth confidence.";
    } else {
      badgeIcon.textContent = "🌱";
      resultTitle.textContent = "Beginning Your Civic Journey";
      resultTier.textContent = "Tier: Aspiring First-Time Voter";
      resultMsg.textContent = "Elections can seem overwhelming, but you are in the right place! Read through our simple voter guides and give the quiz another spin.";
    }
  }

  restartQuiz() {
    this.startQuiz();
  }
}

/* ==========================================================================
   PART 2: APPLICATION CONTROLLER (THEME, NAV, COUNTDOWN, CHECKLIST, FAQ)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initCountdown();
  initChecklist();
  initFAQ();
  new VoterQuiz();
});

function initTheme() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem("voteaware-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme) {
    htmlRoot.setAttribute("data-theme", savedTheme);
  } else if (prefersDark) {
    htmlRoot.setAttribute("data-theme", "dark");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme");
      const targetTheme = currentTheme === "dark" ? "light" : "dark";
      htmlRoot.setAttribute("data-theme", targetTheme);
      localStorage.setItem("voteaware-theme", targetTheme);
    });
  }
}

function initNavigation() {
  const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      mobileToggleBtn.classList.toggle("open", isOpen);
      mobileToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggleBtn.classList.remove("open");
        mobileToggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scrollspy
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  });
}

function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("minutes");
  const secsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 42);
  targetDate.setHours(7, 0, 0, 0);

  function updateClock() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function initChecklist() {
  const checkboxes = document.querySelectorAll(".checklist-item input[type='checkbox']");
  const percentLabel = document.getElementById("checklist-percent");
  const statusLabel = document.getElementById("checklist-status");
  const progressBar = document.getElementById("checklist-progress-bar");
  const resetBtn = document.getElementById("reset-checklist-btn");

  const STORAGE_KEY = "voteaware_readiness_checklist";

  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    savedState = {};
  }

  checkboxes.forEach((box) => {
    const id = box.getAttribute("data-check-id");
    if (savedState[id]) {
      box.checked = true;
    }

    box.addEventListener("change", () => {
      savedState[id] = box.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      updateChecklistProgress();
    });
  });

  function updateChecklistProgress() {
    const total = checkboxes.length;
    let checkedCount = 0;

    checkboxes.forEach((box) => {
      if (box.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / total) * 100);

    if (percentLabel) percentLabel.textContent = `${percent}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (statusLabel) {
      if (percent === 0) {
        statusLabel.textContent = "Not ready yet";
        statusLabel.style.color = "var(--text-muted)";
      } else if (percent < 50) {
        statusLabel.textContent = "Getting prepared...";
        statusLabel.style.color = "var(--color-accent)";
      } else if (percent < 100) {
        statusLabel.textContent = "Almost ready!";
        statusLabel.style.color = "var(--color-primary)";
      } else {
        statusLabel.textContent = "100% Ready to Vote! 🎉";
        statusLabel.style.color = "var(--color-success)";
      }
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset your voter readiness checklist?")) {
        checkboxes.forEach((box) => (box.checked = false));
        localStorage.removeItem(STORAGE_KEY);
        updateChecklistProgress();
      }
    });
  }

  updateChecklistProgress();
}

function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((other) => {
        other.classList.remove("active");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        questionBtn.setAttribute("aria-expanded", "true");
      }
    });
  });
}
