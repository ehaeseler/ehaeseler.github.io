let myTeamScore = null;

document.getElementById("enableSound").addEventListener("click", () => {
    const audio = new Audio("sabres_goalhorn.mp3");
    audio.play();
    audio.currentTime = 0;
    document.getElementById("enableSound").style.display = "none";
});

async function getScore() {
    const res = await fetch(`https://corsproxy.io/?url=https://api-web.nhle.com/v1/score/now&_=${Date.now()}`);
    const data = await res.json();
    return data.games.find(game =>
        game.homeTeam.abbrev === "BUF" ||
        game.awayTeam.abbrev === "BUF"
    );
}

async function init() {
    const game = await getScore();
    if (!game) {
        document.getElementById("gameView").style.display = "none";
        document.getElementById("noGameView").style.display = "block";
        return;
    }
    const myTeam = game.homeTeam.abbrev === "BUF" ? game.homeTeam : game.awayTeam;
    myTeamScore = myTeam.score;
    updateUI(game);
}

async function checkForGoal() {
    const game = await getScore();
    if (!game) return;
    const myTeam = game.homeTeam.abbrev === "BUF" ? game.homeTeam : game.awayTeam;

    if (myTeam.score > myTeamScore) {
        const audio = new Audio("goal.mp3");
        audio.play();
    }

    myTeamScore = myTeam.score;
    updateUI(game);
}

function updateUI(game) {
    const myTeam = game.homeTeam.abbrev === "BUF" ? game.homeTeam : game.awayTeam;
    const otherTeam = game.homeTeam.abbrev === "BUF" ? game.awayTeam : game.homeTeam;

    document.getElementById("noGameView").style.display = "none";
    document.getElementById("gameView").style.display = "block";
    document.getElementById("team1Logo").src = myTeam.logo;
    document.getElementById("team1Name").textContent = myTeam.name.default;
    document.getElementById("team1Score").textContent = myTeam.score;
    document.getElementById("team2Logo").src = otherTeam.logo;
    document.getElementById("team2Name").textContent = otherTeam.name.default;
    document.getElementById("team2Score").textContent = otherTeam.score;
}

init();
setInterval(checkForGoal, 30000);