import {setPaused} from './games/common.js';
import { games } from './catalog.js';
import { readStats, saveMatch } from './storage.js';
import './styles.css';

const $ = (selector) => document.querySelector(selector);
const grid = $('#game-grid');
const dialog = $('#game-dialog');
const canvas = $('#game-canvas');
const ctx = canvas.getContext('2d');
const startOverlay = $('#start-overlay');
const resultOverlay = $('#result-overlay');
const keyState = new Set();
const touchKeys = new Map();
let paused=false;
let activeGame = null;
let activeEntry = null;
let scoreTimer = null;

function updatePoints() { $('#points').textContent = `${readStats().points} PTS`; }
updatePoints();

grid.innerHTML = games.map((game) => `
  <article class="game-card game-${game.accent}">
    <div class="card-art card-art-${game.id}"><span class="card-number">${game.number} / TG</span><span class="card-icon" aria-hidden="true">${game.icon}</span><span class="card-playtime">${game.time}</span></div>
    <div class="card-content"><div class="card-title-row"><div><span class="card-subtitle">${game.subtitle}</span><h3>${game.title}</h3></div><span class="mode-tag">${game.mode}</span></div><p>${game.description}</p><div class="card-bottom"><span class="players-label"><i></i> 2 PLAYERS / LOCAL</span><button class="card-button" data-launch="${game.id}" aria-label="Play ${game.title}">PLAY <span>↗</span></button></div></div>
  </article>`).join('');

function renderControls(entry) {
  $('#game-controls').innerHTML = entry.controls.map((player, index) => `<div class="control-player control-${player.side}"><span class="control-name">${player.name}</span><span class="control-keys">${player.keys}</span></div>`).join('');
}

function renderTouchControls(entry) {
  const maps = entry.id === 'roof-rush'
    ? [['KeyW','KeyA','KeyS','KeyD','KeyE'], ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Enter']]
    : entry.id === 'bento-blitz'
      ? [['KeyW','KeyA','KeyS','KeyD','KeyE'], ['ArrowUp','ArrowLeft','ArrowDown','ArrowRight','Enter']]
      : [['KeyW','KeyA','KeyD'], ['ArrowUp','ArrowLeft','ArrowRight']];
  const labels = { KeyW: '↑', KeyA: '←', KeyS: '↓', KeyD: '→', ArrowUp: '↑', ArrowLeft: '←', ArrowDown: '↓', ArrowRight: '→', KeyE: 'E', Enter: '↵' };
  return maps.map((keys, player) => `<div class="touch-player"><span>P${player + 1}</span>${keys.map((key) => `<button type="button" class="touch-key" data-key="${key}" aria-label="Player ${player + 1} ${key}">${labels[key]}</button>`).join('')}</div>`).join('');
}

function openGame(entry) {
  if (activeGame) activeGame.destroy();
  activeEntry = entry;
  $('#game-title').textContent = entry.title;
  $('#game-instructions').textContent = entry.instructions;
  $('#round-clock').textContent = entry.time.replace(' MIN', ':00');
  $('#game-kicker').textContent = `${entry.mode} / LOCAL MATCH / 2 PLAYERS`;
  $('#game-status-text').textContent = 'LOCAL PLAY / SAME DEVICE';
  renderControls(entry);
  $('#game-controls').insertAdjacentHTML('beforeend', `<div class="touch-controls">${renderTouchControls(entry)}</div>`);
  startOverlay.classList.remove('hidden');
  resultOverlay.classList.add('hidden');
  clearKeys();
  dialog.showModal();
}

function clearKeys(){keyState.clear();touchKeys.clear();document.querySelectorAll('.touch-key.pressed').forEach(b=>b.classList.remove('pressed'));}
function pauseMatch(value){if(!activeGame)return;paused=value;setPaused(value);clearKeys();document.querySelector('#pause-overlay').classList.toggle('hidden',!value);document.querySelector('#pause-game').textContent=value?'RESUME':'PAUSE';}

window.addEventListener('keydown', (event) => {
  if (!dialog.open || event.target.matches('input,textarea'))return;
  if(event.code==='KeyP'&&!event.repeat){pauseMatch(!paused);return;}
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault();
  keyState.add(event.code);
});
window.addEventListener('keyup', (event) => keyState.delete(event.code));
window.addEventListener('blur',()=>{clearKeys();pauseMatch(true);});
document.addEventListener('visibilitychange', () => { if (document.hidden){clearKeys();pauseMatch(true);} });
document.addEventListener('pointerdown',event=>{const b=event.target.closest('[data-key]');if(!b||paused)return;event.preventDefault();b.setPointerCapture(event.pointerId);touchKeys.set(event.pointerId,b.dataset.key);keyState.add(b.dataset.key);b.classList.add('pressed');});
for(const type of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,event=>{const key=touchKeys.get(event.pointerId);if(!key)return;touchKeys.delete(event.pointerId);if(![...touchKeys.values()].includes(key)){keyState.delete(key);document.querySelectorAll('[data-key="'+key+'"]').forEach(b=>b.classList.remove('pressed'));}});
const pauseButton=document.createElement('button');pauseButton.id='pause-game';pauseButton.className='button button-quiet';pauseButton.textContent='PAUSE';pauseButton.onclick=()=>pauseMatch(!paused);document.querySelector('.game-heading').append(pauseButton);
const pauseOverlay=document.createElement('div');pauseOverlay.id='pause-overlay';pauseOverlay.className='start-overlay hidden';pauseOverlay.innerHTML='<h3>PAUSED</h3><p>The match waits for you. P or Resume to continue.</p><button class="button button-primary" id="resume-game">RESUME MATCH</button>';document.querySelector('.game-stage-wrap').append(pauseOverlay);document.querySelector('#resume-game').onclick=()=>pauseMatch(false);

grid.addEventListener('click', (event) => {
  const launch = event.target.closest('[data-launch]');
  if (launch) openGame(games.find((game) => game.id === launch.dataset.launch));
});
$('#start-game').addEventListener('click', startMatch);
$('#replay-game').addEventListener('click', startMatch);
$('#home-game').addEventListener('click', closeGame);
$('#close-game').addEventListener('click', closeGame);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeGame();});
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeGame(); });

function startMatch() {
  if (activeGame) activeGame.destroy();
  clearKeys();paused=false;setPaused(false);pauseOverlay.classList.add('hidden');pauseButton.textContent='PAUSE';
  startOverlay.classList.add('hidden');
  resultOverlay.classList.add('hidden');
  activeGame = activeEntry.create({ canvas, ctx, isDown: (code) => keyState.has(code), onFinish: finishMatch });
  activeGame.start();
}

function finishMatch(result) {
  if (scoreTimer) clearTimeout(scoreTimer);
  clearKeys();paused=false;setPaused(false);pauseOverlay.classList.add('hidden');
  const stats = saveMatch(result.winner);
  updatePoints();
  const winner = result.winner === 1 ? 'PLAYER 01 WINS' : result.winner === 2 ? 'PLAYER 02 WINS' : 'NICE TEAMWORK!';
  $('#result-title').textContent = result.title || winner;
  $('#result-copy').textContent = `${result.copy || 'Good match.'}  +${result.winner ? 25 : 10} PTS · ${stats.matches} MATCH${stats.matches === 1 ? '' : 'ES'} PLAYED`;
  resultOverlay.classList.remove('hidden');
  activeGame = null;
}

function closeGame() {
  if (activeGame) activeGame.destroy();
  activeGame = null;paused=false;setPaused(false);pauseOverlay.classList.add('hidden');
  clearKeys();
  if (dialog.open) dialog.close();
}

window.addEventListener('keydown', (event) => {
  if (!dialog.open || event.code !== 'Escape') return;
  closeGame();
});

setInterval(()=>{if(!activeGame)return;const remaining=Math.ceil(activeGame.getState().seconds);document.querySelector('#round-clock').textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0');},150);
