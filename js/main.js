let mainScene = document.getElementById("scene");
var beatmap = undefined;
let game_manager = document.querySelector('[game-manager]');
let score_text = document.querySelector("#text-score");
let end_score_text = document.querySelector("#end-score");
let main_menu = document.querySelector("#main-menu");
let end_menu = document.querySelector("#end-menu");
let game_level = document.querySelector("#game-level");
const maxNode = 5;
let score = 0;
let currentNodeCount = 0;
function getRandom(min, max){
    return Math.random() * (max-min) + min;
}