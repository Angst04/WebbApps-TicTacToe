let tg = window.Telegram.WebApp;
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
var stop = false;
var arrData = document.querySelectorAll("[data-num]");
var arr = [null, null, null, null, null, null, null, null, null];


let theme = document.getElementById('theme');
if (prefersDarkMode) {
   theme.href = 'dark-mode.css'
} else {
   theme.href = 'light-mode.css'
};


var concat = function(a, b, c) {
  var result = arr[a] + arr[b] + arr[c];
  
  switch (result) {
    case "xxnull":
      return ["x", c];
  
    case "xnullx":
      return ["x", b];
  
    case "nullxx":
      return ["x", a];
  
    case "oonull":
      return ["o", c];
  
    case "onullo":
      return ["o", b];
  
    case "nulloo":
      return ["o", a];
      
    default:
      if (result === "xxx" || result === "ooo") {
        return result;
      }
  }
};


var changeColorAndStop = function(a, b, c) {
  if (prefersDarkMode) {
	arrData[a].style.color = "rgb(121, 61, 61)";
	arrData[b].style.color = "rgb(121, 61, 61)";
	arrData[c].style.color = "rgb(121, 61, 61)";
  } else {
	arrData[a].style.color = "red";
	arrData[b].style.color = "red";
	arrData[c].style.color = "red";
  };
  
  stop = true;

  var result = concat(a, b, c);

  if (result === "xxx" || result === "ooo") {
    // There is a winner, no need to restart the game
    var winningPlayer = arr[a] === 'x' ? 'crosses' : 'noughts';
    var winningSymbol = arr[a];
    console.log("The winner is: " + winningPlayer);
	 tg.sendData(winningPlayer); 
    tg.close();
  } else {
    // It's a draw, pause for 3 seconds before restarting the game
    console.log("It's a draw!");
    setTimeout(restartGame, 3000);
  }
};


var restartGame = function() {
  stop = false;
  arr = [null, null, null, null, null, null, null, null, null];

  for (var i = 0; i < arrData.length; i++) {
    arrData[i].innerHTML = "";
    arrData[i].style.color = "#4e4e4e";
  }
};


var checkWin = function() {
  for (var i = 0; i < 3; i++) {
    var result = concat(i, i + 3, i + 6);

    if (result === "xxx" || result === "ooo") {
      changeColorAndStop(i, i + 3, i + 6);
    }
  }

  for (var i = 0; i <= 6; i += 3) {
    var result = concat(i, i + 1, i + 2);

    if (result === "xxx" || result === "ooo") {
      changeColorAndStop(i, i + 1, i + 2);
    }
  }

  if (concat(0, 4, 8) === "xxx" || concat(0, 4, 8) === "ooo") {
    changeColorAndStop(0, 4, 8);
  }

  if (concat(2, 4, 6) === "xxx" || concat(2, 4, 6) === "ooo") {
    changeColorAndStop(2, 4, 6);
  }
};


var isWinner = function(result) {
  return result === "xxx" || result === "ooo";
};


var botZero = function() {
  // проверка комбинаций из двух "оо" и "xx"
  for (var i = 0; i < 3; i++) {
    var result = concat(i, i + 3, i + 6);

    if (Array.isArray(result) && result[0] === "o") {
      arrData[result[1]].innerHTML = "o";
      arr[result[1]] = "o";
      return;
    }

    if (Array.isArray(result) && result[0] === "x") {
      arrData[result[1]].innerHTML = "o";
      arr[result[1]] = "o";
      return;
    }
  }

  for (var i = 0; i <= 6; i += 3) {
    var result = concat(i, i + 1, i + 2);

    if (Array.isArray(result) && result[0] === "o") {
      arrData[result[1]].innerHTML = "o";
      arr[result[1]] = "o";
      return;
    }

    if (Array.isArray(result) && result[0] === "x") {
      arrData[result[1]].innerHTML = "o";
      arr[result[1]] = "o";
      return;
    }
  }

  if (Array.isArray(concat(0, 4, 8)) && concat(0, 4, 8)[0] === "o") {
    arrData[concat(0, 4, 8)[1]].innerHTML = "o";
    arr[concat(0, 4, 8)[1]] = "o";
    return;
  }

  if (Array.isArray(concat(0, 4, 8)) && concat(0, 4, 8)[0] === "x") {
    arrData[concat(0, 4, 8)[1]].innerHTML = "o";
    arr[concat(0, 4, 8)[1]] = "o";
    return;
  }

  // ставим "о" в случайную пустую ячейку
  var tempArr = []

  for (var i = 0; i < 9; i++) {
    if (arr[i] === null) {
      tempArr.push(i)
    }
  }

  if (tempArr.length === 0) {
    console.log("draw");
    setTimeout(restartGame, 1500);
    return;
  }

  var randIndexTempArr = Math.floor(Math.random() * tempArr.length)

  var randNull = tempArr[randIndexTempArr]

  arrData[randNull].innerHTML = "o"
  arr[randNull] = "o"
};


addEventListener("click", function(event) {
  if (stop) {
    return;
  }

  if (event.target.className === "cell" && event.target.textContent === "") {
	 if (prefersDarkMode) {
		event.target.style.color = "#c7c5c5";
	 } else {
		event.target.style.color = "#f2f2f2";
	 };
    event.target.innerHTML = "x";

    arr[event.target.dataset.num] = "x";
  } else {
    return;
  }

  checkWin();

  if (!stop) {
    botZero();
    checkWin();
  }
});