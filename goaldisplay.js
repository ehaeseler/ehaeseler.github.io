let myTeamScore = null;
let goalPending = false;
let gameTime = 0;
let minutesLeft = 0;
let secondsLeft = 0;
let displayTime = 0;
let teamAbbrev = "BUF";

// document.getElementById("enableSound").addEventListener("click", () => {
//     const audio = new Audio("sabres_goalhorn.mp3");
//     audio.play();
//     audio.pause();
//     audio.currentTime = 0;
//     document.getElementById("enableSound").style.display = "none";
// });

async function getScore() {
    const res = await fetch(`https://corsproxy.io/?url=https://api-web.nhle.com/v1/score/now&_=${Date.now()}`);
    const data = await res.json();
    return data.games.find(game =>
        game.homeTeam.abbrev === teamAbbrev ||
        game.awayTeam.abbrev === teamAbbrev
    );
}

async function init() {
    const game = await getScore();
    if (!game) {
        document.getElementById("gameView").style.display = "none";
        document.getElementById("noGameView").style.display = "flex";
        return;
    }
    const myTeam = game.homeTeam.abbrev === teamAbbrev ? game.homeTeam : game.awayTeam;
    myTeamScore = myTeam.score;
    getTime(game);
    updateUI(game);
}

function getTime(game) {
    gameTime = game.clock.timeRemaining;
    let splitted = gameTime.split(":");
    minutesLeft = Number(splitted[0]);
    secondsLeft = Number(splitted[1]);
}

async function checkForGoal() {
    const game = await getScore();
    if (!game) return;
    const myTeam = game.homeTeam.abbrev === teamAbbrev ? game.homeTeam : game.awayTeam;

    if (myTeam.score > myTeamScore && !goalPending) {
        goalPending = true;
        myTeamScore = myTeam.score;  // update immediately so it won't trigger again
        // setTimeout(() => {
        //     const audio = new Audio("sabres_goalhorn.mp3");
        //     audio.play();
        //     updateUI(game);
        //     goalPending = false;
        // }, 45000);
        const audio = new Audio("sabres_goalhorn.mp3");
            audio.play();
            updateUI(game);
            goalPending = false;
    } else if (!goalPending) {
        myTeamScore = myTeam.score;
        updateUI(game);
    }
}

function updateUI(game) {
    const myTeam = game.homeTeam.abbrev === teamAbbrev ? game.homeTeam : game.awayTeam;
    const otherTeam = game.homeTeam.abbrev === teamAbbrev ? game.awayTeam : game.homeTeam;
    
    switch(game.gameState) {
        case "OFF":
        case "FUT":
        case "PRE":
            var date = new Date(game.startTimeUTC);
            var newDate = date.toLocaleTimeString();
            document.getElementById("time").textContent = "Game starts at " + newDate;
            break;
        case "LIVE":
            if (game.clock.running) {
                if (secondsLeft != 0) {
                    secondsLeft--;
                }
                else if (minutesLeft > 0){
                    minutesLeft--;
                    secondsLeft = 59;
                }
            }
            else {
                console.log("actual: " + game.clock.timeRemaining);
                console.log("expected: " + displayTime);
                getTime(game);
            }
            displayTime = minutesLeft.toString().padStart(2, "0") + ":" + secondsLeft.toString().padStart(2, "0");
            document.getElementById("time").textContent = displayTime;
            break;
        case "FIN":
            document.getElementById("time").textContent = "Final Score"
            document.getElementById("time").style.fontSize = "45px";
            break;
    }

    document.getElementById("noGameView").style.display = "none";
    document.getElementById("gameView").style.display = "flex";
    document.getElementById("team1Logo").src = myTeam.logo;
    document.getElementById("team1Score").textContent = myTeam.score;
    document.getElementById("team2Logo").src = otherTeam.logo;
    document.getElementById("team2Score").textContent = otherTeam.score;
}

init();
setInterval(checkForGoal, 1000);