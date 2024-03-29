const evaluationParser = {
  parsing: false,
  completed: false,
  rowSeparator: '+-------+-------+-------+-------+-------+-------+-------+-------+',
  colSeparator: '|',
  currentRow: 0,
  evaluations: [],
  rowPieceNames: null,
  parse: function (line) {
    if (this.heading) {
      this.rowPieceNames = line.split(this.colSeparator).slice(1, -1).map(s => s.trim());
      this.heading = false;
      return;
    }

    if (!this.parsing) {
      return;
    }

    if (this.currentRow === 1 && line === this.rowSeparator) {
      this.completed = true;
      return;
    }

    if (line === this.rowSeparator) {
      this.currentRow--;
      this.heading = true;
      return;
    }

    if (this.currentRow === 0) {
      return;
    }

    const squares = line.split(this.colSeparator).slice(1, -1).map(s => s.trim());
    const rowEvaluations = squares.map(s => parseFloat(s));

    // make pair of values, the evaluations array with the piece names array
    const combinedArray = [];
    for (let i = 0; i < rowEvaluations.length; i++) {
      const combinedElement = [rowEvaluations[i], this.rowPieceNames[i]];
      combinedArray.push(combinedElement);
    }
    this.evaluations.push(combinedArray);
    this.rowPieceNames = null;
  },
  start: function () {
    this.parsing = true;
    this.currentRow = 9;
    this.evaluations = [];
  },
  stop: function () {
    this.parsing = false;
    this.completed = false;
    this.currentRow = 0;
  },
  process: function (line) {
    if (this.completed) {
      this.stop();
      $(document).trigger('evaler:evaluated', { evaluations: evalMatrixToHash(this.evaluations) });
      return;
    }

    if (this.parsing && !this.completed) {
      this.parse(line)
      return;
    }

    // try to parse evaluations
    if (line.indexOf("NNUE derived piece values:") !== -1) {
      if (this.parsing) return;
      this.start();
      return;
    }
  }
}

/**
 * Convert a matrix of evaluations to a hash object, in which the keys are the square names
 *
 * @param {*} matrix
 * @returns
 */
function evalMatrixToHash(matrix) {
  return matrix.reduce((acc, row, i) => {
    row.reduce((acc, value, j) => {
      const content = value[1] ? { piece: value[1], value: value[0] } : null;
      acc[String.fromCharCode(97 + j) + (8 - i)] = content;
      return acc;
    }, acc);
    return acc;
  }, {});
}
