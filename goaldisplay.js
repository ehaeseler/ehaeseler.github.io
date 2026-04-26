async function sabresIsPlaying() {
    const res = await fetch("https://api-web.nhle.com/v1/score/now");
    const data = await res.json();
  
    let gameFound = null;
  
    for (const day of data.gamesByDate) {
      for (const game of day.games) {
        if (
          game.homeTeam.abbrev === "MIN" ||
          game.awayTeam.abbrev === "MIN"
        ) {
          gameFound = game;
          break;
        }
      }
      if (gameFound) break;
    }
  
    const gameView = document.getElementById("gameView");
    const noGameView = document.getElementById("noGameView");
  
    if (!gameFound) {
      gameView.style.display = "none";
      noGameView.style.display = "block";
      return;
    }
  
    noGameView.style.display = "none";
    gameView.style.display = "block";
  
    document.getElementById("team1Score").textContent = gameFound.homeTeam.score;
    document.getElementById("team2Score").textContent = gameFound.awayTeam.score;
  }