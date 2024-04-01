const INFO = /^info .*\bdepth (\d+) .*\bnps (\d+)/;
const BESTMOVE = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/;
const SCORE = /^info .*\bscore (\w+) (-?\d+)/;
const BOUND = /\b(upper|lower)bound\b/;

const analysisParser = {
  parsing: false,
  completed: false,
  bestMove: null,
  start: function () {
    this.parsing = true;
  },
  stop: function () {
    this.parsing = false;
    this.completed = false;
  },
  parse: function (line) {
    if (BESTMOVE.test(line)) {
      const result = BESTMOVE.exec(line);
      this.bestMove = {
        from: result[1],
        to: result[2],
        promotion: result[3] || null
      }
      this.completed = true;
      $(document).trigger('analysis:bestmove', {
        bestMove: this.bestMove,
      });
      $(document).trigger('engine:status', { status: 'ready' });
    }
  },
  process: function (line) {
    if (this.completed) {
      this.stop();
      $(document).trigger('analysis:finished', {
        bestMove: this.bestMove,
      });
      return;
    }

    if (this.parsing && !this.completed) {
      this.parse(line)
      return;
    }

    // try to parse analysis
    if (line.indexOf("info string NNUE evaluation enabled.") !== -1) {
      if (this.parsing) return;
      $(document).trigger('engine:status', { status: 'analyzing' });
      this.start();
      return;
    }
  }
};
