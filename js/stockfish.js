const INFO = /^info .*\bdepth (\d+) .*\bnps (\d+)/;
const BESTMOVE = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/;
const SCORE = /^info .*\bscore (\w+) (-?\d+)/;
const BOUND = /\b(upper|lower)bound\b/;

function Stockfish(onMessage) {
  const stockfish = new Worker('/stockfish/stockfish.js#/stockfish/stockfish.wasm');
  stockfish.onmessage = onMessage(stockfish);

  return {
    ...stockfish,
    status: 'stopped',
    send: function send(cmd) {
      stockfish.postMessage(cmd);
    },
  };
}

function buildEngine() {
  const engine = Stockfish(function onMessageBuilder(instance) {
    return function onMessage(event) {
      const line = event && typeof event === "object" ? event.data : event;

      console.log('engine', event.data);

      if (line === 'uciok') {
        instance.status = 'loaded';
        $(document).trigger('engine:status', { status: 'loaded' });
        console.log('engine uciok');
      } else if (line === 'readyok') {
        instance.status = 'ready';
        $(document).trigger('engine:status', { status: 'ready' });
        console.log('engine readyok');
      }
    };
  });

  return {
    ...engine,
    analyze: function analyze(fen) {
      console.log('analyze', fen);
      engine.send(`position fen ${fen}`);
      engine.send('go depth 20');
    },
  };
}

function buildEvaler() {
  const evaler = Stockfish(function onMessageBuilder(instance) {
    return function onMessage(event) {
      const line = event && typeof event === "object" ? event.data : event;

      console.log('evaler', event.data);

      $(document).trigger('evaler:content', { content: line });

      if (line === 'uciok') {
        instance.status = 'loaded';
        $(document).trigger('evaler:status', { status: 'loaded' });
        console.log('evaler uciok');
      } else if (line === 'readyok') {
        instance.status = 'ready';
        $(document).trigger('evaler:status', { status: 'ready' });
        console.log('evaler readyok');
      }
    };
  });

  return {
    ...evaler,
    evaluate: function(fen) {
      console.log('evaler', fen);
      evaler.send(`position fen ${fen}`);
      evaler.send('eval');
    }
  };
}

$(document).ready(function() {
  const engine = buildEngine();
  const evaler = buildEvaler();
  window.engine = engine;
  window.evaler = evaler;

  engine.send('uci');
  engine.send('setoption name Use NNUE value true');
  evaler.send('uci');
  evaler.send('setoption name Use NNUE value true');
});
