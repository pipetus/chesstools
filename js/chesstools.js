$(document).on('engine:status', function(event, data) {
  console.log('engine status:', event, data);
  $('#engineStatus').text(data.status);
});

$(document).on('evaler:status', function(event, data) {
  console.log('evaler status:', event, data);
  $('#evalerStatus').text(data.status);
});

$(document).on('evaler:content', function(event, data) {
  const content = data.content.replace(/ /g, '\u00a0');
  $('#evalOutput').append(`${content}<br>`);
});

$('#btnAnalyze').on('click', function() {
  console.log('analyze');
  $('#evalOutput').text('');

  engine.analyze(game.fen());
  evaler.evaluate(game.fen());
});
