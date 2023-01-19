const chai = require('chai');
const { Test } = require('mocha');
const puzzleExample = require('../controllers/puzzle-strings.js').puzzlesAndSolutions[0][0]
const puzzleSolution = require('../controllers/puzzle-strings').puzzlesAndSolutions[0][1]
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

let puzzleMatrix = [];

for (let i = 0; i < 9; i ++) {
  puzzleMatrix[i] = []
  for (let j = 0; j < 9; j++) {
    puzzleMatrix[i][j]= puzzleExample[(9*i)+j]
  }
}

suite('Unit Tests', () => {

  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.validate(puzzleExample), true)
    done()
  })

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    let puzzle = 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
    assert.deepEqual(solver.validate(puzzle), { error: 'Invalid characters in puzzle' })
    done()
  })

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    let puzzle = '..1.2..5'
    assert.deepEqual(solver.validate(puzzle), { error: 'Expected puzzle to be 81 characters long' })
    done()
  })

  test('Logic handles a valid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(puzzleMatrix, 1, 1, 7), undefined )
    done()
  })

  test('Logic handles an invalid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(puzzleMatrix, 1, 1, 1), 'row' )
    done()
  })

  test('Logic handles a valid column placement', (done) => {
    assert.equal(solver.checkColPlacement(puzzleMatrix, 1, 1, 3), undefined )
    done()
  })

  test('Logic handles an invalid column placement', (done) => {
    assert.equal(solver.checkColPlacement(puzzleMatrix, 1, 1, 8), 'column' )
    done()
  })

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzleMatrix, 5, 5, 5), undefined )
    done()
  })

  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzleMatrix, 1, 1, 2), 'region' )
    done()
  })

  test('Valid puzzle strings pass the solver', (done) => {
    assert.equal(solver.solve(puzzleMatrix, 1, 1), puzzleSolution)
    done()
  })

  test('Invalid puzzle strings fail the solver', (done) => {
    let failPuzzle = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
    let failMatrix = []

    for (let i = 0; i < 9; i ++) {
      failMatrix[i] = []
      for (let j = 0; j < 9; j++) {
       failMatrix[i][j]= failPuzzle[(9*i)+j]
      }
    }
    
    assert.equal(solver.solve(failMatrix, 1, 1), false)
    done()
  })

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    assert.equal(solver.solve(puzzleMatrix, 1, 1), puzzleSolution)
    done()
  })
});
