let player1 = '';
let player2 = '';
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let currentQuestionIndex = 0;
let questions = [];           
let selectedCategory = ''; 

const API_BASE_URL = 'https://the-trivia-api.com/api';  // base url of api/static api
 

function startGame() {
  player1 = document.getElementById('player1').value;
  player2 = document.getElementById('player2').value;

  if (!player1 || !player2) {
    alert('Please enter names for both players.');
    return;
  }
  if (player1 === player2) {
    alert('Player names cannot be the same.');
    return;
  }

  document.getElementById('player-setup').style.display = 'none';
  document.getElementById('category-selection').style.display = 'block';
  fetchCategories();
}

async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const categories = await response.json(); // to convert data into object format 

  // console.log(categories)

  const dropdown = document.getElementById('category-dropdown');
  dropdown.innerHTML = Object.entries(categories)
    .map(([key, value]) => `<option value="${key}">${value}</option>`)
    .join('');  


}



async function fetchQuestions() {
  delay(1000);
  selectedCategory = document.getElementById('category-dropdown').value;
  
  const difficulties = ['easy', 'medium', 'hard'];


  for (const difficulty of difficulties) {
    const response = await fetch(
      `${API_BASE_URL}/questions?categories=${selectedCategory}&limit=2&difficulty=${difficulty}`
    );
    const data = await response.json();
    questions = questions.concat(data);
  }


  document.getElementById('category-selection').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';
  displayQuestion();
}

async function displayQuestion() {   
  const abc = questions[currentQuestionIndex];
  console.log(abc);
  let player_turn = document.getElementById('player-turn');
  player_turn.innerText = `Current Turn: ${currentPlayer === 1 ? player1 : player2}`;
  player_turn.style.color = currentPlayer === 1 ? 'white' : 'yellow';
  player_turn.style.fontSize = '20px';
  player_turn.style.backgroundColor = 'black';


  // Display current scores
document.getElementById('player1-score').innerText = `${player1}: ${scores[1]} points`;
document.getElementById('player2-score').innerText = `${player2}: ${scores[2]} points`;

  
  document.getElementById('question-text').innerText = abc.question;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = abc.incorrectAnswers
    .concat(abc.correctAnswer)
    .sort(() => Math.random() - 0.5) 
    .map(answer => {
    let safeAnswer = answer.replace(/'/g, "\\'").replace(/"/g, '&quot;')
    return `<button class="btn btn-outline-secondary" onclick="checkAnswer('${safeAnswer}')">${answer}</button>`
  }
    ).join('');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkAnswer(selectedAnswer) {
   
  const question = questions[currentQuestionIndex];
  // let ans = document.getElementById('answers');
  console.log(selectedAnswer);
  if (selectedAnswer === question.correctAnswer) {
    const points = getPointsForDifficulty(question.difficulty);
    scores[currentPlayer] += points;
    correct();
    document.body.style.backgroundColor = 'green';
    await delay(1000);
  } else {
    wrong();
    document.body.style.backgroundColor = 'red';
    // alert('Wrong answer!');
    await delay(1000);
  }

  // Update the displayed scores after each answer
  document.getElementById('player1-score').innerText = `${player1}: ${scores[1]} points`;
  document.getElementById('player2-score').innerText = `${player2}: ${scores[2]} points`;


  document.body.style.backgroundColor = 'white';
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayQuestion();
  } else {
    endGame();
  }

}


function getPointsForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 15;
    case 'hard': return 20;
    default: return 0;
  }
}


function endGame() {
  
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('game-end').style.display = 'block';

  const resultText = `
    ${player1}: ${scores[1]} points<br>
    ${player2}: ${scores[2]} points<br><br>
    ${getWinnerMessage()}
  `;
  document.getElementById('final-score').innerHTML = resultText;
}


function getWinnerMessage() {
  if (scores[1] > scores[2]) {
    return `${player1} wins! 🎉`;
  } else if (scores[2] > scores[1]) {
    return `${player2} wins! 🎉`;
  } else {
    return "It's a draw! 🤝";
  }
}

function correct() {
  const audio = new Audio('./Sound/correct.wav');
  
  audio.play().catch(error => {
    console.error('Audio playback failed:', error);
  });
}
function wrong() {
  const audio = new Audio('./Sound/wrong.wav');
  
  audio.play().catch(error => {
    console.error('Audio playback failed:', error);
  });
}


function resetGame() {
  scores = { 1: 0, 2: 0 };
  currentQuestionIndex = 0;
  currentPlayer = 1;
  questions = [];

  document.getElementById('game-end').style.display = 'none';
  document.getElementById('player-setup').style.display = 'block';
}


