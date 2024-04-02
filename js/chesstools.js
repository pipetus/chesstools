$(document).on('engine:status', function(event, data) {
  // console.log('engine status:', event, data);
  switch (data.status) {
    case 'loaded':
    case 'ready':
      $('#engineStatus').text('\u2714').removeClass('spinner-border spinner-border-sm');
      break;
    case 'analyzing':
      $('#engineStatus').text('').addClass('spinner-border spinner-border-sm');
      break;
  }
});

$(document).on('evaler:status', function(event, data) {
  // console.log('evaler status:', event, data);
  $('#evalerStatus').text(data.status);
});

$(document).on('evaler:content', function(event, data) {
  evaluationParser.process(data.content);
  const content = data.content.replace(/ /g, '\u00a0');
  $('#evalOutput').append(`${content}<br>`);
});

$(document).on('engine:content', function(event, data) {
  analysisParser.process(data.content);
  const content = data.content.replace(/ /g, '\u00a0');
  $('#engineOutput').append(`${content}<br>`);
});

$(document).on('evaler:evaluated', function(event, data) {
  // console.log('evaler evaluated:', event, data);
  board.setEvaluations(data.evaluations);
  board.redraw();
});

$(document).on('analysis:bestmove', function(event, data) {
  console.log('analysis bestmove:', event, data);
  board.addArrow(
    `${data.bestMove.from}-${data.bestMove.to}`,
    'blue',
  )
});

$('#btnAnalyze').on('click', function() {
  console.log('analyze');
  $('#evalOutput').text('');
  $('#engineOutput').text('');

  engine.analyze(game.fen());
  evaler.evaluate(game.fen());
});
