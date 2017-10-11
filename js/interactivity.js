
var scoreList = [];

/*
$("#credits")
  .on(
    "click",
    function () {
      var message = "Game created by Bhuvan Belur";
      alert(message);
    }
  );
*/
$("#accordion")
    .accordion({
    });

function registerScore(score) {
  scoreList.push(score);
  var playerName = prompt("What is your name?");
  var scored = "<li>" + playerName + ":" + score.toString() + "</li>";
  scoreList.push(score);

  $("#scorers")
  .append(
    scoreEntry
  );
}
function sortList(list) {
  function sortNumber(a,b) {
      return a - b;
  }
  list.sort(sortNumber);
  return list;
}
