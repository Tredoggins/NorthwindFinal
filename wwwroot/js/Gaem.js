$(document).ready(function () {
    var clicked;
    var playerTurn = true;
    var board = $("#board");
    var playAgain;
    var cells = $("td");
    var gameOver = false;
    var r1;
    var r2;
    var r3;
    var c1;
    var c2;
    var c3;
    var d1;
    var d2;
    //var myChecks;
    cells.click(function (e) {
        e.preventDefault();
        if (playerTurn && !gameOver) {
            var myChoice = $(this);
            console.log("you clicked on a square",myChoice);
            clicked = $(".clicked");
            if (!myChoice.hasClass("x") && !myChoice.hasClass("o")) {
                if (clicked.length) {
                    clicked.removeClass("clicked");
                }
                myChoice.addClass("clicked");
                $("input[type='submit']").show();
            }
        }
        $("#start").hide();
    });
    board.submit(function (e) {
        if (!gameOver) {
            e.preventDefault();
            clicked = $(".clicked");
            clicked.addClass("x");
            clicked.append("<i class='fas fa-utensils'></i>");
            clicked.removeClass("clicked");
            $("input[type='submit']").hide();
            if (!checkIfWinStart()) {
                $("#turn").text("Computer Turn");
                playerTurn = false;
                computerTurn();
            }
        }
    });
    function computerTurn() {
        if (!gameOver) {
            var myChoice;
            var catsGame = true;
            var mySpace;
            cells.each(function () {
                mySpace = $(this);
                if (!(mySpace.hasClass("x") || mySpace.hasClass("o"))) {
                    catsGame = false;
                }
            });
            if (catsGame) {
                endGame(0);
            } else {
                myChoice = getBestSpace();
                window.setTimeout(function () {
                    myChoice.addClass("o");
                    myChoice.append("<i class='fas fa-utensil-spoon'></i>");
                    if (!checkIfWinStart()) {
                        $("#turn").text("Player Turn");
                        playerTurn = true;
                    }
                }, 1000)
            }
        }
    }
    function checkIfWinStart() {
        if (!gameOver) {
            refreshRowsColsDiag();
            var p1Checker = "x";
            var p2Checker = "o";
            if (checkIfWin(r1, p1Checker) || checkIfWin(r2, p1Checker) || checkIfWin(r3, p1Checker) || checkIfWin(c1, p1Checker) || checkIfWin(c2, p1Checker) || checkIfWin(c3, p1Checker) || checkIfWin(d1, p1Checker) || checkIfWin(d2, p1Checker)) {
                endGame(1);
                return true;
            } else if (checkIfWin(r1, p2Checker) || checkIfWin(r2, p2Checker) || checkIfWin(r3, p2Checker) || checkIfWin(c1, p2Checker) || checkIfWin(c2, p2Checker) || checkIfWin(c3, p2Checker) || checkIfWin(d1, p2Checker) || checkIfWin(d2, p2Checker)) {
                endGame(2);
                return true;
            } else {
                return false;
            }
        }
    }
    function checkIfWin(list, checker) {
        if (!gameOver) {
            return (getAmountOf(list, checker) >= 3);
        }
    }
    function getAmountOf(list, checker) {
        let currentSpace;
        let count = 0;
        list.each(function () {
            currentSpace = $(this);
            if (currentSpace.hasClass(checker)) {
                count++;
            }
        });
        return count;
    }
    function getLastSpace(list, checker) {
        let space = 0;
        if (getAmountOf(list, checker) === 2) {
            let currentSpace;
            let count = 0;
            list.each(function () {
                count++;
                currentSpace = $(this);
                if (!currentSpace.hasClass("x") && !currentSpace.hasClass("o")) {
                    space = currentSpace;
                }
            });
        }
        return space;
    }
    function getBestSpace() {
        refreshRowsColsDiag();
        let myChecks = [r1, r2, r3, c1, c2, c3, d1, d2];
        let mySpace;
        for (let i = 0; i < myChecks.length; i++) {
            mySpace = getLastSpace(myChecks[i], "o");
            if (mySpace !== 0) {
                //if(!mySpace.hasClass("x")) {
                return mySpace;
                //}
            }
        }
        for (let j = 0; j < myChecks.length; j++) {
            mySpace = getLastSpace(myChecks[j], "x");
            if (mySpace !== 0) {
                //if(!mySpace.hasClass("x")) {
                return mySpace;
                //}
            }
        }
        var row;
        var col;
        do {
            row = Math.floor(Math.random() * 3 + 1);
            col = Math.floor(Math.random() * 3 + 1);
            mySpace = $("#row" + row + ">td.col" + col);
        } while (mySpace.hasClass("x") || mySpace.hasClass("o"));
        return mySpace;
    }
    function refreshRowsColsDiag() {
        r1 = $("#row1").children();
        r2 = $("#row2").children();
        r3 = $("#row3").children();
        c1 = $(".col1");
        c2 = $(".col2");
        c3 = $(".col3");
        d1 = $("#row1 .col1,#row2 .col2,#row3 .col3");
        d2 = $("#row3 .col1,#row2 .col2,#row1 .col3");
    }
    function endGame(winner) {
        if (!gameOver) {
            //board.hide();
            var winBanner = $("#turn");
            switch (winner) {
                case 1:
                    winBanner.text("Player Wins!");
                    break;
                case 2:
                    winBanner.text("Computer Wins!");
                    break;
                default:
                    winBanner.text("Tie!");
                    break;
            }
            $("#container").append($("<input type='button' id='playAgain' value='Play Again?'>"));
            playAgain = $("#playAgain");
            gameOver = true;
            playAgain.click(function () {
                location.reload();
            });
        }
    }
});