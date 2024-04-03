# ChessTools: Chess Analysis Tools

## Introduction

ChessTools is a simple chess board with the ability to analyze a position with [Stockfish](https://stockfishchess.org/) and provide some statistics from the engine.

## Instructions 

### Analyze

Given a position, you can click the _Analyze_ button and this will ask Stockfish to assess the current position, both by an _evaluator_ instance and an _analysis_ instance of the engine.
The evaluator will throw a human-readable assessment of the position in the right panel, while the analyzer will show its machine-like (UCI) output in the left one.
Based on the output of both, if enabled, the board will change showing different statistics:
- relative piece values as piece transparency
- best move as arrow

### Viewing the board state

Clone this repo, then 

   runserver.sh

Visit http://localhost:8000 and have fun!

### Changing the board state

Edit data/games.js, which contains a javascript array of games in PGN format.  The top game should be the current one.  Add a move, check it in, and push!

### ToDo

- Allow editing a position/board.

## Credits

Adapted from [Chesswork](https://github.com/hjavadish/Chesswork): 

Includes:
* chessboard2.js: https://github.com/oakmac/chessboard2
* chess.js: https://github.com/jhlywa/chess.js
* stockfish.js: https://github.com/nmrugg/stockfish.js / https://github.com/lichess-org/stockfish.js
  
## License

This code is released under the [MIT License](https://github.com/siansell/pgnviewer/blob/master/LICENSE).
