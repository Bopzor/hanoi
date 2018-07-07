var body = document.getElementsByTagName('body')[0];
var root = document.getElementById('game');

body.onload = () => {
  var game = new Game(root);

  window.game = game;
};