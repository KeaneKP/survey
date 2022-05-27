const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const fs = require('fs');

const names = JSON.parse(fs.readFileSync("names.json", "utf8"));
const updateData = () => {
  fs.writeFile("names.json", JSON.stringify(names), () => {
    console.log('File Updated')
  });
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/site.html');
});
app.get('/leaderboard', (req, res) => {
  res.sendFile(__dirname + '/leaderboard.html');
});

const commitOutcomeData = (winner, loser) => {
  names[winner].wins++;
  names[loser].losses++;
  updateData();
}


io.on('connection', socket => {
  console.log('New Connecton Established');
  socket.on('outcome', (winner, loser) => {
    commitOutcomeData(winner, loser);
  });
  socket.on('namesRequest', () => {
    socket.emit('namesOutput', names);
  });
  setInterval(() => {socket.emit('namesOutput', names);}, 3000)
});
        

http.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
