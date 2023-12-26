//fetching the category and name of the player

const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get("selectedCategory");
const username = urlParams.get("username");

//Setting page head to the name of user

let pageHead = document.querySelector(".pageHead");
pageHead.innerHTML += ` ${username}`;

//needed variables
const questionBox = document.querySelector(".question");
const quizOptions = document.querySelector(".options");
const score = document.querySelector(".score");
const quitBtn = document.querySelector(".quit");
const newGamebtn = document.querySelector(".newGame");
const timeIncreasePowerUp = document.querySelector(".timeIncrease");
let numberOfQuestions = 0;
let correctAnswersGiven = 0;
let correctAnswer;
let interval;
let timer = document.querySelector(".timer");
let timerInnerHtml = timer.innerHTML;
let timeIncreased = false;
let cheatUsed = false;
let option = document.querySelectorAll(".option");
const cheat = document.querySelector(".cheat");

//Defining varaibles for storing different categories apiURL

let generalKnowledgeUrl =
    "https://opentdb.com/api.php?amount=1&category=9&type=multiple",
  HistoryUrl = "https://opentdb.com/api.php?amount=1&category=23&type=multiple",
  PoliticsUrl =
    "https://opentdb.com/api.php?amount=1&category=24&type=multiple",
  GeographyUrl =
    "https://opentdb.com/api.php?amount=1&category=22&type=multiple",
  SportsUrl = "https://opentdb.com/api.php?amount=1&category=21&type=multiple";

//mapping between the category selected and api url to fetch data according to the category

let categoryMap = {
  "General Knowledge": generalKnowledgeUrl,
  History: HistoryUrl,
  Politics: PoliticsUrl,
  Geography: GeographyUrl,
  Sports: SportsUrl,
};

//Fetching data from api for the selected category
fetchData(categoryMap[selectedCategory]);

// function for fetching data using async await

async function fetchData(apiUrl, callback) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // calling the function again in case data is not fetched
      fetchData(categoryMap[selectedCategory], callback);
    }
    const fetchedData = await response.json();
    // Call the function to show question and options
    if (numberOfQuestions == 10) {
      quitBtn.style.display = "none";
      showResult(correctAnswersGiven);
      newGamebtn.style.display = "flex";
      timeIncreased = true;
      cheatUsed = true;
    } else {
      showQuestion(fetchedData.results[0]);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

//function to show questions and options

function showQuestion(data) {
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionList = incorrectAnswer;
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  questionBox.innerHTML = `${data.category} - ${data.question}`;

  // Loop through each container and insert an option
  option.forEach((container, index) => {
    container.innerHTML = optionList[index];
  });
  timer.innerHTML = 10;
  startTimer(10);
  numberOfQuestions++;
}

//function to start times as soon as question is displayed on screen

function startTimer(initialValue = 10) {
  let timerNum = initialValue;
  interval = setInterval(() => {
    timerNum--;
    timer.innerHTML = timerNum;
    if (timerNum === -1) {
      clearInterval(interval);
      fetchData(categoryMap[selectedCategory]);
      // Reset the timer to the original value if needed
      timer.innerHTML = 10;
    }
  }, 1000);
}

//function to check if selected option is correct or not
quizOptions.addEventListener("click", (e) => {
  if (e.target.classList.contains("option")) {
    // Get the selected option's inner HTML
    const selectedOption = e.target.innerHTML;

    // Check if the selected option is correct
    if (selectedOption === correctAnswer) {
      // If correct, set the background color to green
      correctAnswersGiven++;
      e.target.style.backgroundColor = "green";
    } else {
      // If incorrect, set the background color of the selected option to red
      e.target.style.backgroundColor = "red";

      // Find the correct option and set its background color to green
      option.forEach((container) => {
        if (container.innerHTML === correctAnswer) {
          container.style.backgroundColor = "green";
        }
      });
    }

    // Reset the background color for all options after a short delay
    setTimeout(resetOptionBackground, 1000);

    // Fetch new question after a short delay
    setTimeout(() => {
      clearInterval(interval); // Clear the interval
      timer.innerHTML = 10;
      fetchData(categoryMap[selectedCategory]);
    }, 1000);
  }
});

//function to reset background color of options

function resetOptionBackground() {
  option.forEach((container) => {
    container.style.backgroundColor = "unset";
  });
}

//function to increase time by 10 second if power up button is clicked

function increaseTime() {
  if (!timeIncreased) {
    let currentTimerValue = parseInt(timer.innerHTML);
    let newTimerValue = currentTimerValue + 10;
    timer.innerHTML = newTimerValue;

    // Stop any existing timer
    clearInterval(interval);

    // Restart the timer with the new value
    startTimer(newTimerValue);
    timeIncreasePowerUp.style.opacity = "0.5";
    timeIncreased = true; // Set the flag to true
  }
}

//function to show correctAnswer if cheat powerUp is clicked

function cheatClicked() {
  if (!cheatUsed) {
    // Stop the current timer
    clearInterval(interval);

    // Highlight the correct answer
    option.forEach((container) => {
      if (container.innerHTML === correctAnswer) {
        container.style.backgroundColor = "green";
      }
    });

    // Increment correctAnswersGiven
    correctAnswersGiven++;

    // Set cheatUsed to true to prevent further use
    cheatUsed = true;

    // Reset the background color for all options after a short delay
    setTimeout(() => {
      resetOptionBackground();

      // Fetch new question after resetting the timer
      fetchData(
        categoryMap[selectedCategory]
        // Restart the timer with the original value after fetching a new question
      );
    }, 1000);
  }
}

cheat.addEventListener("click", cheatClicked);
quitBtn.addEventListener("click", quitGame); //redirect you to home page
newGamebtn.addEventListener("click", startNewGame); //redirect you to home page
timeIncreasePowerUp.addEventListener("click", increaseTime); //icrease time power up

function quitGame() {
  window.location.href = `../landingPage/index.html`;
}

function showResult(correct) {
  score.innerHTML = `Your score was ${correct}`;
  score.style.display = "block";
}

function startNewGame() {
  window.location.href = `../landingPage/index.html`;
}
