async function sabresIsPlaying() {
    const res = await fetch("https://api-web.nhle.com/v1/score/now");
    const data = await res.json();

    const gameFound = data.games.find(game =>
      game.homeTeam.abbrev === "MIN" ||
      game.awayTeam.abbrev === "MIN"
    );
  
    const gameView = document.getElementById("gameView");
    const noGameView = document.getElementById("noGameView");
  
    if (!gameFound) {
      gameView.style.display = "none";
      noGameView.style.display = "block";
      return;
    }
  
    noGameView.style.display = "none";
    gameView.style.display = "block";
  
    document.getElementById("team1Score").textContent =
      gameFound.homeTeam.score;
  
    document.getElementById("team2Score").textContent =
      gameFound.awayTeam.score;
  }
  
  sabresIsPlaying();