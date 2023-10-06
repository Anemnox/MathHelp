const FILE_PATH = "text.txt";

const problems = fetch(FILE_PATH).then(response => {
  return response.text();
}).then(text => {
  return text.split("\n");
});

function loadProblem(idx) {
  problems.then(probs => {
    yourLoadProblem(probs[idx]);
  });
}

function yourLoadProblem(problemString) {
  console.log(problemString);
}

loadProblem(3);
loadProblem(2);
loadProblem(4);