const ANS_X = document.getElementById("x-ans");
const ANS_Y = document.getElementById("y-ans");
const ctx = document.getElementById('equationsChart').getContext('2d');


const TOLERENCE = 0.01;
let questionIdx = 0;
let incorrectGuesses = 0;

let answer;
let values;
let myChart;

const problems = fetch("sysEq.json").then(response => {
  return response.json();
}).then(probs => {
  return probs;
}).catch(err => {
  console.log(err)
})

problems.then(probs => {
  displayQuestion(probs[questionIdx]);
})

function displayQuestion(problem) {
  const question = problem["equations"]
  answer = problem["correct_answer"]
  values = evaluateMatrix(problem["matrix"]);

  const eqElement = document.getElementById("equations");
  const toMathJax = question.map(eq => "$$" + eq + "$$");
  eqElement.innerText = "";
  for (let eq in toMathJax) {
    eqElement.innerText += " " + toMathJax[eq];
  }

  MathJax.typeset();
}

function checkAnswer() {
  let xAns = getValue("x = " + ANS_X.value);
  let yAns = getValue("y = " + ANS_Y.value);
  ANS_X.value = "";
  ANS_Y.value = "";

  let corrX = getValue(answer[0]);
  let corrY = getValue(answer[1]);

  drawGraph();
  nextProblem();

  if (
    Math.abs(xAns - corrX) < TOLERENCE &&
    Math.abs(yAns - corrY) < TOLERENCE
  ) {
    alert("correct!");
  } else {
    alert("incorrect!");
  }
}

function drawGraph() {
  if (myChart) {
    myChart.destroy();
    myChart = undefined;
  }
  const xValues = Array.from({ length: 21 }, (_, i) => -10 + i);

  // Calculate the corresponding y-values for each equation
  const yValues = values.map(([a, b, c]) =>
      xValues.map(x => (c - a * x) / b)
  );

  // Create data points for the line graphs
  const datasets = values.map(([a, b, c], index) => ({
      label: `Equation ${index + 1}: ${a}x + ${b}y = ${c}`,
      data: yValues[index],
      fill: false, // Line graph
      borderColor: getRandomColor(), // Random color for each graph
      borderWidth: 2,
  }));

  // Create options for the graph
  const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
    elements: {
      point:{
          radius: 0
      }
    } 
  };

  // Create a line chart
  // Create a line chart with multiple datasets
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xValues,
        datasets: datasets,
    },
    options: options,
  });

}


function nextProblem() {
  questionIdx += 1;
  problems.then(probs => {
    displayQuestion(probs[questionIdx]);
  });
}

function setup() {
  document.getElementById("submit-button").addEventListener("click", checkAnswer);
}

window.addEventListener("load", setup);



/////////////////////////////////
//                             //
//      UTILITY FUNCTIONS      //
//                             //
/////////////////////////////////

function evaluateMatrix(mat) {
  const transformedMat = [];
  for (let i = 0; i < mat.length; i++) {
    transformedMat.push([]);
    for (let j = 0; j < mat[i].length; j++) {
      const vals = mat[i][j]
      transformedMat[i].push(vals[0]/vals[1])
    }
  }
  return transformedMat;
}

function getValue(answer) {
  const parts = answer.split('=');
  const valueStr = parts[1].trim();

  if (isValidNumericExpression(valueStr)) {
    return eval(valueStr);
  }
  return NaN;
}

function isValidNumericExpression(text) {
  // Remove leading and trailing whitespaces
  const cleanedText = text.trim();

  // Use a regular expression to check if the text consists of valid numerical characters
  const numericPattern = /^[\d+\-*/().]+$/;
  // Remove leading and trailing whitespaces
  if (!numericPattern.test(cleanedText)) {
    return false;
  }

  // Define an array of valid mathematical operators
  const validOperators = ['+', '-', '*', '/'];

  // Initialize a count for operators
  let operatorCount = 0;

  // Iterate through the characters in the expression
  for (let i = 0; i < cleanedText.length; i++) {
    const char = cleanedText.charAt(i);
    
    // Check if the character is a valid operator
    if (validOperators.includes(char)) {
      operatorCount++;

      // If there are more than one operators, return false
      if (operatorCount > 1) {
        return false;
      }
    }
  }

  // If there is at most one operator, return true
  return true;
}

// Function to generate random colors
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}