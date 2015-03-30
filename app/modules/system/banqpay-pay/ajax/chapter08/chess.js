/*
 * Copyright 2006 SitePoint Pty. Ltd, www.sitepoint.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var xPos = 0;
var yPos = 0;
var REFRESH_INTERVAL = 5;

var Chess = new function() {
  this.REFRESH_INTERVAL = REFRESH_INTERVAL;
  this.ajax = null;
  this.boardDiv = null;
  this.leftPos = 0;
  this.topPos = 0;
  this.squareSize = 56;
  this.boardSize = this.squareSize*8;
  this.pieceOffset = 10;
  this.pieceSize = this.squareSize - (this.pieceOffset * 2);
  this.panelHeight = 56;
  this.pieceList = [];
  this.selectPiece = null;
  this.dragPiece = null;
  this.lastMove = null;
  this.pollInterval = null;
  this.proc = false;
  
  this.init = function() {
    var self = Chess;
    self.ajax = new Ajax();
    self.boardDiv = document.getElementById('boardDiv');
    self.placeBoard();
    self.placePanel();
    self.loadGame();
    self.doPollDelay();
  };
  
  this.placeBoard = function() {
    var self = Chess;
    var w = self.getWinWidth();
    var h = self.getWinHeight();
    var sq = null;
    var sqL = 0;
    var sqT = 0;
    self.boardDiv.style.width = self.boardSize + 'px';
    self.boardDiv.style.height = self.boardSize + 'px';
    self.leftPos = (parseInt((w - self.boardSize) / 2));
    self.topPos = (parseInt((h - self.boardSize + this.panelHeight) / 2));
    if (self.topPos < this.panelHeight) {
      self.topPos = this.panelHeight;
    }
    self.boardDiv.style.left = self.leftPos + 'px';
    self.boardDiv.style.top = self.topPos + 'px';
    sqT = 0;
    for (var i = 0; i < 8; i++) {
      sqL = 0;
      for (var j = 0; j < 8; j++) {
        sq = document.createElement('div');
        sq.id = 'square' + i + '_' + j;
        if ((j + i) % 2 > 0) {
          sq.className = 'boardSquareWhite';
        }
        else {
          sq.className = 'boardSquareBlack';
        }
        sq.style.width = self.squareSize + 'px';
        sq.style.height = self.squareSize + 'px';
        sq.style.top = sqT + 'px';
        sq.style.left = sqL + 'px';
        self.boardDiv.appendChild(sq);
        sqL += self.squareSize;
      }
      sqT += self.squareSize;
    }
  };
  
  this.placePanel = function() {
    var self = Chess;
    var panelDiv = document.getElementById('panelDiv');
    panelDiv.style.width = this.boardSize + 'px';
    panelDiv.style.left = self.leftPos + 'px';
    panelDiv.style.top = (self.topPos - this.panelHeight) + 'px';
  };
  
  this.execCmd = function(str, handlerFunc) {
    var self = Chess;
    self.ajax.doPost('chess.php', str, handlerFunc);
  };
  
  this.loadGame = function() {
    var self = Chess;
    var str = '';
    var cmd = new Command();
    cmd.cmdName = 'load';
    str = JSON.stringify(cmd);
    self.execCmd(str, self.handleLoadGame);
  };
  
  this.handleLoadGame = function(str) {
    var self = Chess;
    var resp = JSON.parse(str);
    if (resp.respStatus == 'ok') {
      self.displayGame(resp.respData);
    }
    else {
      alert(str);
    }
  };
  
  this.displayGame = function(gameState) {
    var self = Chess;
    var piece = null;
    var label = '';
    var pieceDiv = null;
    var colX = 0;
    var colY = 0;
    
    self.lastMove = gameState.lastMove;
    self.pieceList = gameState.pieceList;
    
    if (self.lastMove.moveTime) {
      self.setStatusMsg(self.lastMove.movePiece.color, self.lastMove.moveTime);
    }
    else {
      self.setStatusMsg('(New Game)');
    }
    for (var i in self.pieceList) {
      piece = self.pieceList[i];
      self.pieceList[i] = new Piece(piece.color, piece.id, [piece.pos[0], piece.pos[1]]);
      piece = self.pieceList[i];
      label = piece.id.split('_')[1];
      label = label.substr(0, 1).toUpperCase();
      pieceDiv = document.createElement('div');
      pieceDiv.id = i;
      pieceDiv.className = piece.color + 'PieceDiv';
      pieceDiv.style.width = self.pieceSize + 'px';
      pieceDiv.style.height = self.pieceSize + 'px';
      pieceDiv.style.left = self.calcPosFromCol(piece.pos[0]) + 'px';
      pieceDiv.style.top = self.calcPosFromCol(piece.pos[1]) + 'px';
      pieceDiv.style.lineHeight = self.pieceSize + 'px';
      pieceDiv.appendChild(document.createTextNode(label));
      self.boardDiv.appendChild(pieceDiv);
    }
    return true;
  };
  
  this.wipeBoard = function() {
    var self = Chess;
    var str = '';
    var cmd = new Command();
    cmd.cmdName = 'wipe';
    str = JSON.stringify(cmd);
    self.execCmd(str, self.handleWipeBoard);
  };
  
  this.handleWipeBoard = function(str) {
    var self = Chess;
    var resp = JSON.parse(str);
    if (resp.respStatus == 'ok') {
      self.clearPieces();
      self.displayGame(resp.respData);
    }
    else {
      alert(str);
    }
  };
  
  this.doPollDelay = function() {
    var self = Chess;
    self.pollInterval = setTimeout(self.doPoll, (self.REFRESH_INTERVAL * 1000));
  };
  
  this.doPoll = function() {
    var self = Chess;
    var str = '';
    var cmd = new Command();
    cmd.cmdName = 'poll';
    cmd.cmdData = self.lastMove;
    str = JSON.stringify(cmd);
    self.execCmd(str, self.handlePoll);
  };
  
  this.handlePoll = function(str) {
    var self = Chess;
    var resp = JSON.parse(str);
    if (resp.respStatus == 'update') {
      self.clearPieces();
      self.displayGame(resp.respData);
    }
    self.doPollDelay();
  };
  
  this.doMove = function(colX, colY) {
    var self = Chess;
    var occPieceId = '';
    var cmd = null;
    var move = null;
    var err = '';
    self.selectPiece.backUpPos();
    self.selectPiece.updatePos(colX, colY);
    if ((!self.lastMove.moveTime) && (self.selectPiece.color == 'black')) {
      err = 'White has to go first.';
    }
    else if ((self.lastMove.moveTime) && (self.selectPiece.color == self.lastMove.movePiece.color)) {
      err = 'Same color as previous move.';
    }
    else {
      occPieceId = self.getOccupyingPieceId();
      if (occPieceId.indexOf(self.selectPiece.color) > -1) {
        err = 'Cannot capture a piece of your own color.';
      }
    }
    if (err) {
      self.setErrMsg(err);
      self.abortMove();
    }
    else {
      clearTimeout(self.pollInterval);
      self.ajax.abort();
      self.setErrMsg('')
      move = new Move(self.selectPiece, occPieceId);
      cmd = new Command('move', move);
      var str = JSON.stringify(cmd);
      self.execCmd(str, self.handleMove);
      self.proc = true;
      self.selectPiece.startProcessing();
    }
  };
  this.handleMove = function(str) {
    var self = Chess;
    var take = '';
    var takeDiv = null;
    var resp = JSON.parse(str);
    if (resp.respStatus == 'ok') {  
      self.lastMove = resp.respData.lastMove;
      self.setStatusMsg(self.lastMove.movePiece.color, self.lastMove.moveTime);
      take = self.lastMove.takePieceId;
      if (take) {
        takeDiv = document.getElementById(take);
        self.boardDiv.removeChild(takeDiv);
        delete self.pieceList[take];
      }
    }
    else {
      alert(str);
      self.abortMove();
    }
    self.selectPiece.endProcessing();
    self.proc = false;
    self.doPollDelay();
  };
  this.getOccupyingPieceId = function() {
    var self = Chess;
    var p = null;
    for (var i in self.pieceList) {
      p = self.pieceList[i];
      if ((self.selectPiece.pos[0] == p.pos[0] && self.selectPiece.pos[1] == p.pos[1]) && (self.selectPiece.id != p.id)) {
        return p.id;
      }
    }
    return '';
  };
  this.abortMove = function() {
    var self = Chess;
    var pieceDiv = document.getElementById(self.selectPiece.id);
    pieceDiv.style.left = self.calcPosFromCol(self.selectPiece.origPos[0]) + 'px';
    pieceDiv.style.top = self.calcPosFromCol(self.selectPiece.origPos[1]) + 'px';
    self.selectPiece.restore();
  };
  this.clearPieces = function() {
    var self = Chess;
    var pieceDiv = null;
    for (var i in self.pieceList) {
      pieceDiv = document.getElementById(i);
      self.boardDiv.removeChild(pieceDiv);
    }
    self.pieceList = [];
  };
  this.setStatusMsg = function() {
    var statusMsgDiv = document.getElementById('statusMsgDiv');
    var msg = ''; 
    if (arguments.length > 1) {
      var color = arguments[0];
      color = color.substr(0,1).toUpperCase() + color.substr(1);
      msg = 'Last Move: ' + color + ' (' + arguments[1] + ')';
    }
    else {
      msg = arguments[0];
    }
    if (statusMsgDiv.firstChild) {
      statusMsgDiv.removeChild(statusMsgDiv.firstChild);
    }
    statusMsgDiv.appendChild(document.createTextNode(msg));
  };
  this.setErrMsg = function(msg) {
    var errMsgDiv = document.getElementById('errMsgDiv');
    if (errMsgDiv.firstChild) {
      errMsgDiv.removeChild(errMsgDiv.firstChild);
    }
    errMsgDiv.appendChild(document.createTextNode(msg));
  };
  this.mouseDownHandler = function(e) {
    var self = Chess;
    var id = '';
    var pat = null;
    if (self.proc) { return false; }
    e = e || window.event;
    id = self.getSrcElemId(e);
    pat = /^(white|black)_/;
    if (pat.test(id)) {
      self.selectPiece = self.pieceList[id];
      self.dragPiece = new Draggable(id);
    }
  };
  this.mouseMoveHandler = function(e) {
    var self = Chess;
    xPos = e ? e.pageX : window.event.x;
    yPos = e ? e.pageY : (window.event.y + document.body.scrollTop);
    if (self.dragPiece) {
      self.dragPiece.move();
    }
  };
  this.mouseUpHandler = function(e) {
    var self = Chess;
    var id = '';
    if (self.dragPiece) {
      self.dragPiece.drop();
      self.dragPiece = null;
    }
  };
  this.getSrcElemId = function(e) {
    var ret = null;
    if (e.srcElement) { ret = e.srcElement; }
    else if (e.target) { ret = e.target; }
    if (ret.nodeType == 3) {
      ret = ret.parentNode;
    }
    return ret.id
  };
  this.getWinHeight = function() {
    if (document.all) {
      return document.body.clientHeight;
    }
    else {
      return window.innerHeight;
    }
  };
  this.getWinWidth = function() {
    if (document.all) {
      return document.body.clientWidth;
    }
    else {
      return window.innerWidth;
    }
  };
  this.toBoardX = function(xPos) {
    return xPos - Chess.leftPos;
  };
  this.toBoardY = function(yPos) {
    return yPos - Chess.topPos;
  };
  this.calcPosFromCol = function(col) {
    var self = Chess;
    return (col * self.squareSize) + (self.pieceOffset - 1);
  };
  this.calcColFromPos = function(pos) {
    var self = Chess;
    return parseInt(pos / self.squareSize)
  };
  this.cleanup = function() {
    var self = Chess;
    self.boardDiv = null;
  };
}
Chess.constructor = null;

function Piece(color, id, pos) {
  this.color = color;
  this.id = id;
  this.pos = pos;
  this.origPos = [];
  this.backUpPos = function() {
    this.origPos = [this.pos[0], this.pos[1]];
  };
  this.updatePos = function(colX, colY) {
    this.pos = [colX, colY];
  };
  this.restore = function() {
    this.pos = [this.origPos[0], this.origPos[1]];
  };
  this.startProcessing = function() {
    var pieceDiv = document.getElementById(this.id);
    pieceDiv.style.background = '#bbbbee';
    pieceDiv.style.cursor = 'progress';
    pieceDiv.style.zIndex = 10;
  };
  this.endProcessing = function() {
    var pieceDiv = document.getElementById(this.id);
    pieceDiv.style.background = this.id.indexOf('white') > -1 ? '#ffffff' : '#000000';
    pieceDiv.style.cursor = 'move';
    pieceDiv.style.zIndex = 5;
  };
  this.wasMoved = function(colX, colY) {
    if (colX == this.pos[0] && colY == this.pos[1]) {
      return false;
    }
    else {
      return true;
    }
  };
}

function Draggable(divId) {
  this.div = document.getElementById(divId);
  this.clickOffsetX = (Chess.toBoardX(xPos) - this.div.offsetLeft);
  this.clickOffsetY = (Chess.toBoardY(yPos) - this.div.offsetTop);
  this.div.style.zIndex = 10;
  
  this.move = function() {
    var calcX = 0;
    var calcY = 0;
    var xMin = 0;
    var xMax = 0;
    var yMin = 0;
    var yMax = 0;
    calcX = xPos - this.clickOffsetX;
    calcY = yPos - this.clickOffsetY;
    xMin = Chess.leftPos - 1;
    xMax = Chess.leftPos + Chess.boardSize - Chess.pieceSize - 1;
    yMin = Chess.topPos - 1;
    yMax = Chess.topPos + Chess.boardSize - Chess.pieceSize - 1;
    calcX = calcX < xMin ? xMin : calcX;
    calcX = calcX > xMax ? xMax : calcX;
    calcY = calcY < yMin ? yMin : calcY;
    calcY = calcY > yMax ? yMax : calcY;
    this.div.style.left = parseInt(Chess.toBoardX(calcX)) + 'px';
    this.div.style.top = parseInt(Chess.toBoardY(calcY)) + 'px';
  };
  this.drop = function() {
    var calcX = 0;
    var calcY = 0;
    var deltaX = 0;
    var deltaY = 0;
    var colX = 0;
    var colY = 0;
    calcX = this.div.offsetLeft;
    calcY = this.div.offsetTop;
    deltaX = calcX % Chess.squareSize;
    deltaY = calcY % Chess.squareSize;
    calcX = this.getSnap(deltaX, calcX);
    calcY = this.getSnap(deltaY, calcY);
    calcX = calcX + Chess.pieceOffset - 1;
    calcY = calcY + Chess.pieceOffset - 1;
    this.div.style.left = calcX + 'px';
    this.div.style.top = calcY + 'px';
    colX = Chess.calcColFromPos(calcX);
    colY = Chess.calcColFromPos(calcY);
    if (Chess.selectPiece.wasMoved(colX, colY)) {
      Chess.doMove(colX, colY);
    }
    else {
      this.div.style.zIndex = 5;
    }
    this.div = null;
  };
  this.getSnap = function(delta, pos) {
    if (delta > (Chess.squareSize / 2)) {
      pos += (Chess.squareSize - delta);
    }
    else {
      pos -= delta;
    }
    return pos;
  };
}

function Command(cmdName, cmdData) {
  this.cmdName = cmdName || '';
  this.cmdData = cmdData || '';
}

function Move(movePiece, takePieceId, moveTime) {
  this.movePiece = movePiece || null;
  this.takePieceId = takePieceId || '';
  this.moveTime = moveTime || '';
}

document.onmousemove = Chess.mouseMoveHandler;
document.onmousedown = Chess.mouseDownHandler;
document.onmouseup = Chess.mouseUpHandler;
document.ondrag = function () { return false; };
document.onselectstart = function () { return false; };
window.onload = Chess.init;
window.onunload = Chess.cleanup;