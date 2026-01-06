// DOM Elements
const startQuizBtn = document.getElementById('startQuiz');
const usernameInput = document.getElementById('username');
const nameError = document.getElementById('nameError');

// Quiz data - This would normally come from the backend
const quizData = {
    'chapter1': [
        {
            question: 'What is Data Analysis?',
            options: [
                'The process of converting data into useful information',
                'Data storage',
                'Application programming',
                'User interface design'
            ],
            correct: 0
        },
        {
            question: 'Which programming language is most commonly used in data analysis?',
            options: ['Python', 'Java', 'C++', 'JavaScript'],
            correct: 0
        },
        {
            question: 'What is the first step in the data analysis process?',
            options: [
                'Data collection',
                'Data cleaning',
                'Data visualization',
                'Model building'
            ],
            correct: 0
        },
        {
            question: 'Which of the following is NOT a data type in Python?',
            options: ['list', 'tuple', 'array', 'loop'],
            correct: 3
        },
        {
            question: 'What does SQL stand for?',
            options: [
                'Structured Query Language',
                'Simple Query Language',
                'Standard Query Language',
                'System Query Language'
            ],
            correct: 0
        }
    ],
    'chapter2': [
        // Questions for chapter 2
        {
            question: 'Which tool is commonly used for data visualization?',
            options: ['Tableau', 'MySQL', 'MongoDB', 'Apache'],
            correct: 0
        },
        {
            question: 'What is the primary use of Jupyter Notebook?',
            options: [
                'Interactive data analysis and visualization',
                'Database management',
                'Web development',
                'System administration'
            ],
            correct: 0
        },
        {
            question: 'Which library is used for data manipulation in Python?',
            options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
            correct: 1
        },
        {
            question: 'What is the main purpose of NumPy?',
            options: [
                'Numerical computing',
                'Web development',
                'Database management',
                'Machine learning'
            ],
            correct: 0
        },
        {
            question: 'Which of these is NOT a data visualization library?',
            options: ['Matplotlib', 'Seaborn', 'Pandas', 'Plotly'],
            correct: 2
        }
    ],
    'chapter3': [
        // Questions for chapter 3
        {
            question: 'What is machine learning?',
            options: [
                'A type of artificial intelligence',
                'A programming language',
                'A database system',
                'A web framework'
            ],
            correct: 0
        },
        {
            question: 'What is the difference between supervised and unsupervised learning?',
            options: [
                'Supervised learning uses labeled data, unsupervised learning does not',
                'Unsupervised learning is faster than supervised learning',
                'Supervised learning is for numbers, unsupervised is for text',
                'There is no difference'
            ],
            correct: 0
        },
        {
            question: 'What is overfitting in machine learning?',
            options: [
                'When a model is too complex and performs well on training data but poorly on new data',
                'When a model is too simple to capture patterns in the data',
                'When the model has too few parameters',
                'When the training process takes too long'
            ],
            correct: 0
        },
        {
            question: 'What is the purpose of a confusion matrix?',
            options: [
                'To evaluate the performance of a classification model',
                'To store training data',
                'To visualize large datasets',
                'To clean data'
            ],
            correct: 0
        },
        {
            question: 'Which of the following is NOT a machine learning algorithm?',
            options: ['Linear Regression', 'Random Forest', 'K-means', 'Bubble Sort'],
            correct: 3
        }
    ]
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the current page
    initPage();
    
    // Handle start quiz button click
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', handleStartQuiz);
    }
    
    // Handle chapter selection
    document.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.addEventListener('click', handleChapterSelect);
    });
    
    // Handle quiz submission
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', handleQuizSubmit);
    }
    
    // Handle admin login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Handle admin logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }
});

// Initialize the current page based on URL
function initPage() {
    const path = window.location.pathname;
    
    if (path.endsWith('chapters.html')) {
        loadChaptersPage();
    } else if (path.includes('quiz.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const chapter = urlParams.get('chapter');
        if (chapter) {
            loadQuizPage(chapter);
        } else {
            // Redirect to chapters if no chapter specified
            window.location.href = 'chapters.html';
        }
    } else if (path.endsWith('dashboard.html')) {
        checkAdminAuth();
        loadDashboard();
    } else if (path.endsWith('admin.html')) {
        // Check if already logged in
        checkAdminSession();
    }
}

// Handle start quiz button click
function handleStartQuiz(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (!username) {
        nameError.style.display = 'block';
        return;
    }
    
    // Save username to localStorage
    localStorage.setItem('quizUsername', username);
    
    // Redirect to chapters page
    window.location.href = 'chapters.html';
}

// Handle chapter selection
function handleChapterSelect(e) {
    const chapter = this.dataset.chapter;
    window.location.href = `quiz.html?chapter=${chapter}`;
}

// Load chapters page
function loadChaptersPage() {
    // This function can be expanded if needed
    console.log('Loading chapters page');
}

// Load quiz page
function loadQuizPage(chapter) {
    const questions = quizData[chapter];
    const quizContainer = document.getElementById('quizContainer');
    
    if (!questions || !quizContainer) return;
    
    let quizHTML = `<h2>الفصل ${chapter.charAt(chapter.length - 1)}</h2>`;
    
    questions.forEach((q, qIndex) => {
        let optionsHTML = '';
        q.options.forEach((option, oIndex) => {
            optionsHTML += `
                <label class="option">
                    <input type="radio" name="q${qIndex}" value="${oIndex}" required>
                    ${option}
                </label>
            `;
        });
        
        quizHTML += `
            <div class="question">
                <h3>س ${qIndex + 1}: ${q.question}</h3>
                <div class="options">
                    ${optionsHTML}
                </div>
            </div>
        `;
    });
    
    quizHTML += `
        <input type="hidden" name="chapter" value="${chapter}">
        <button type="submit" class="submit-btn">إرسال الإجابات</button>
    `;
    
    quizContainer.innerHTML = quizHTML;
}

// Handle quiz submission
async function handleQuizSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const chapter = formData.get('chapter');
    const questions = quizData[chapter];
    let score = 0;
    const answers = [];
    
    // Calculate score
    questions.forEach((q, qIndex) => {
        const answer = parseInt(formData.get(`q${qIndex}`));
        answers.push({
            question: q.question,
            answer: q.options[answer],
            correct: q.options[q.correct],
            isCorrect: answer === q.correct
        });
        
        if (answer === q.correct) {
            score++;
        }
    });
    
    // Calculate percentage
    const percentage = Math.round((score / questions.length) * 100);
    
    // Get username from localStorage
    const username = localStorage.getItem('quizUsername') || 'مستخدم';
    
    try {
        // Submit results to backend
        const response = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                chapter: `الفصل ${chapter.charAt(chapter.length - 1)}`,
                score: percentage,
                answers
            })
        });
        
        if (response.ok) {
            // Show results
            showQuizResults(percentage, questions.length, score);
        } else {
            throw new Error('فشل في إرسال النتائج');
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('حدث خطأ أثناء إرسال النتائج. الرجاء المحاولة مرة أخرى.');
    }
}

// Show quiz results
function showQuizResults(percentage, totalQuestions, correctAnswers) {
    const quizContainer = document.getElementById('quizContainer');
    
    if (!quizContainer) return;
    
    quizContainer.innerHTML = `
        <div class="results">
            <h2>Quiz Results</h2>
            <div class="score">
                <p>Your Score: <strong>${percentage}%</strong></p>
                <p>Correct Answers: <strong>${correctAnswers} out of ${totalQuestions}</strong></p>
            </div>
            <a href="chapters.html" class="submit-btn">Back to Chapters</a>
        </div>
    `;
}

// Handle admin login
async function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            showError(data.error || 'Login failed. Please check your username and password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred while trying to log in. Please try again.');
    }
}

// Handle admin logout
async function handleAdminLogout() {
    try {
        const response = await fetch('/api/admin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Check admin session
async function checkAdminSession() {
    try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        
        if (data.isAuthenticated) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}

// Check admin authentication
async function checkAdminAuth() {
    try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = 'admin.html';
    }
}

// Load dashboard data
async function loadDashboard() {
    try {
        const response = await fetch('/api/results');
        const results = await response.json();
        
        if (response.ok) {
            displayResults(results);
        } else {
            throw new Error('Failed to load results');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('An error occurred while loading results. Please refresh the page and try again.');
    }
}

// Display results in dashboard
function displayResults(results) {
    const resultsTable = document.getElementById('resultsTable');
    const totalQuizzesEl = document.getElementById('totalQuizzes');
    const averageScoreEl = document.getElementById('averageScore');
    const highestScoreEl = document.getElementById('highestScore');
    
    if (!resultsTable) return;
    
    if (results.length === 0) {
        resultsTable.innerHTML = '<tr><td colspan="4">No results available</td></tr>';
        totalQuizzesEl.textContent = '0';
        averageScoreEl.textContent = '0%';
        highestScoreEl.textContent = '0%';
        return;
    }
    
    // Calculate statistics
    const totalQuizzes = results.length;
    const totalScores = results.reduce((sum, result) => sum + parseFloat(result.score), 0);
    const averageScore = Math.round(totalScores / totalQuizzes);
    const highestScore = Math.max(...results.map(result => parseFloat(result.score)));
    
    // Update statistics
    totalQuizzesEl.textContent = totalQuizzes;
    averageScoreEl.textContent = `${averageScore}%`;
    highestScoreEl.textContent = `${highestScore}%`;
    
    // Sort results by date (newest first)
    const sortedResults = [...results].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Generate table HTML
    let tableHTML = `
        <thead>
            <tr>
                <th>Username</th>
                <th>Chapter</th>
                <th>Score</th>
                <th>Date & Time</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    sortedResults.forEach(result => {
        const date = new Date(result.timestamp);
        const formattedDate = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        // Add row with score-based color
        const score = parseFloat(result.score);
        let rowClass = '';
        
        if (score >= 80) rowClass = 'high-score';
        else if (score >= 50) rowClass = 'medium-score';
        else rowClass = 'low-score';
        
        tableHTML += `
            <tr class="${rowClass}">
                <td>${result.username}</td>
                <td>${result.chapter}</td>
                <td>${result.score}%</td>
                <td>${formattedDate}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody>';
    resultsTable.innerHTML = tableHTML;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}
