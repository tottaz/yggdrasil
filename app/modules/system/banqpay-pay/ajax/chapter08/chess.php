<?php
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

define('NEW_GAME', '{"lastMove":{"movePiece": null,"takePieceId":null,"moveTime":null},"pieceList":{"white_r1":{"color":"white","id":"white_r1","pos":[0,0],"origPos":[]},"white_n1":{"color":"white","id":"white_n1","pos":[0,1],"origPos":[]},"white_b1":{"color":"white","id":"white_b1","pos":[0,2],"origPos":[]},"white_q":{"color":"white","id":"white_q","pos":[0,3],"origPos":[]},"white_k":{"color":"white","id":"white_k","pos":[0,4],"origPos":[]},"white_b2":{"color":"white","id":"white_b2","pos":[0,5],"origPos":[]},"white_n2":{"color":"white","id":"white_n2","pos":[0,6],"origPos":[]},"white_r2":{"color":"white","id":"white_r2","pos":[0,7],"origPos":[]},"white_p1":{"color":"white","id":"white_p1","pos":[1,0],"origPos":[]},"white_p2":{"color":"white","id":"white_p2","pos":[1,1],"origPos":[]},"white_p3":{"color":"white","id":"white_p3","pos":[1,2],"origPos":[]},"white_p4":{"color":"white","id":"white_p4","pos":[1,3],"origPos":[]},"white_p5":{"color":"white","id":"white_p5","pos":[1,4],"origPos":[]},"white_p6":{"color":"white","id":"white_p6","pos":[1,5],"origPos":[]},"white_p7":{"color":"white","id":"white_p7","pos":[1,6],"origPos":[]},"white_p8":{"color":"white","id":"white_p8","pos":[1,7],"origPos":[]},"black_r1":{"color":"black","id":"black_r1","pos":[7,0],"origPos":[]},"black_n1":{"color":"black","id":"black_n1","pos":[7,1],"origPos":[]},"black_b1":{"color":"black","id":"black_b1","pos":[7,2],"origPos":[]},"black_q":{"color":"black","id":"black_q","pos":[7,3],"origPos":[]},"black_k":{"color":"black","id":"black_k","pos":[7,4],"origPos":[]},"black_b2":{"color":"black","id":"black_b2","pos":[7,5],"origPos":[]},"black_n2":{"color":"black","id":"black_n2","pos":[7,6],"origPos":[]},"black_r2":{"color":"black","id":"black_r2","pos":[7,7],"origPos":[]},"black_p1":{"color":"black","id":"black_p1","pos":[6,0],"origPos":[]},"black_p2":{"color":"black","id":"black_p2","pos":[6,1],"origPos":[]},"black_p3":{"color":"black","id":"black_p3","pos":[6,2],"origPos":[]},"black_p4":{"color":"black","id":"black_p4","pos":[6,3],"origPos":[]},"black_p5":{"color":"black","id":"black_p5","pos":[6,4],"origPos":[]},"black_p6":{"color":"black","id":"black_p6","pos":[6,5],"origPos":[]},"black_p7":{"color":"black","id":"black_p7","pos":[6,6],"origPos":[]},"black_p8":{"color":"black","id":"black_p8","pos":[6,7],"origPos":[]}}}');

require_once "JSON.php";

$json = new Services_JSON();
$input = implode("\r\n", file('php://input'));
$cmd = $json->decode($input);
$game = Game::instance();
$resp = new Response();
$out = '';

switch ($cmd->cmdName) {
  case 'load':
    $out = '{"respStatus":"ok", "respData":'.$game->getFromFile().'}';
    break;
  case 'wipe':
    $game->saveToFile(NEW_GAME);
    $out = '{"respStatus":"ok", "respData":'.NEW_GAME.'}';
    break;
  case 'poll':
    $lastMove = $cmd->cmdData;
    $game->load();
    if (($game->state->lastMove->moveTime > $lastMove->moveTime)||
      ($lastMove->moveTime && !$game->state->lastMove->moveTime)) {
      $out = '{"respStatus":"update", "respData":'.getGame().'}';
    }
    else {
      $resp->respStatus = 'nochange';
      $out = $json->encode($resp);
    }
    break;
  case 'move':  
    $move = $cmd->cmdData;
    $movePieceId = $move->movePiece->id;
    $takePieceId = $move->takePieceId;
    $moveTime = strftime('%Y-%m-%d %T', time());
    $game->load();
    $game->state->pieceList->$movePieceId->pos[0] = $move->movePiece->pos[0];
    $game->state->pieceList->$movePieceId->pos[1] = $move->movePiece->pos[1];
    if ($takePieceId) {
      unset($game->state->pieceList->$takePieceId);
    }
    $game->state->lastMove->movePiece = $move->movePiece;
    $game->state->lastMove->moveTime = $moveTime;
    $game->state->lastMove->takePieceId = $takePieceId;
    $resp->respStatus = 'ok';
    $resp->respData->lastMove = $game->state->lastMove;
    $out = $json->encode($resp);
    $game->save();
    break;
}
header('Content-Type: text/plain');
print $out;

class Game {
  function Game() {
    $this->json = new Services_JSON();
    $this->state = new GameState();
    $this->filePath = 'chessboard.txt';
  }
  function saveToFile($str) {
    if (is_writable($this->filePath)) {
      file_put_contents($this->filePath, $str) or die('Could not write to file '.$this->filePath);
    }
    else {
      die('File is not writable');
    }
  }
  function getFromFile() {
    if (is_readable($this->filePath)) {
      $str = file_get_contents($this->filePath) or die('Could not get file contents from '.$this->filePath);
      return $str;
    }
    else {
      die('File '.$this->filePath.' is not readable');
    }
  }
  function load() {
    $str = $this->getFromFile();
    $this->state = $this->json->decode($str);
  }
  function save() {
    $str = $this->json->encode($this->state);
    $this->saveToFile($str);
  }
  function instance() {
    static $instance = null;
    if($instance === null) {
      $instance = new Game();
    }
    return $instance;
  }
}

class Response {
  function Response($respStatus = '', $respData = '') {
    $this->respStatus = $respStatus;
    $this->respData = $respData;
  }
}

class GameState {
  function GameState($lastMove = null, $pieceList = null) {
    $this->lastMove = $lastMove;
    $this->pieceList = $pieceList;
  }
}

?>