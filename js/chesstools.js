$(document).on('engine:status', function(event, data) {
  console.log('engine status:', event, data);
  $('#engineStatus').text(data.status);
});

$(document).on('evaler:status', function(event, data) {
  console.log('evaler status:', event, data);
  $('#evalerStatus').text(data.status);
});

$(document).on('evaler:content', function(event, data) {
  evaluationParser.process(data.content);
  const content = data.content.replace(/ /g, '\u00a0');
  $('#evalOutput').append(`${content}<br>`);
});

$(document).on('evaler:evaluated', function(event, data) {
  console.log('evaler evaluated:', event, data);
  board.setEvaluations(data.evaluations);
  // board.position(game.fen());
  board.redraw();
});

$('#btnAnalyze').on('click', function() {
  console.log('analyze');
  $('#evalOutput').text('');

  engine.analyze(game.fen());
  evaler.evaluate(game.fen());
});
