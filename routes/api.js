'use strict';

const { readFile } = require('@babel/core/lib/gensync-utils/fs.js');
const { validateBoolOption } = require('@babel/preset-env/lib/normalize-options.js');
const { raw } = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body

       //--------- Checking if the puzzleString is valid (only if it's not empty) ---------//
      if (puzzle) {
        let validateString = solver.validate(puzzle)
        if (validateString != true) {
          return res.json(validateString)
        }
      }
       
      //--------- Checking if the fields 'puzzle', 'coordinate' and 'value' are not empty ---------//
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing'})
      }

      //--------- Checking if the field 'coordinate' is valid ---------//
      let coordinateRegex = /[a-i][1-9]$/i
      
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' })
      }

      //--------- Checking if the field 'value' is valid ---------//
      let valueRegex = /^[1-9]$/

      if (!valueRegex.test(value)) {
        return res.json({ error: 'Invalid value' })
      }
      
      //--------- Definition of row (rawRow is a letter), col by req.body ---------//
      let rawRow = coordinate[0].toUpperCase()
      let rowNumber = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9 }
      
      let row = rowNumber[rawRow]
      let col = parseInt(coordinate[1])
    
      //console.log(row, col, value)

      //--------- Definition of the matrix (9x9) ---------//
      let puzzleMatrix = [];

      for (let i = 0; i < 9; i ++) {
        puzzleMatrix[i] = []
        for (let j = 0; j < 9; j++) {
          puzzleMatrix[i][j]= req.body.puzzle[(9*i)+j]
        }
      }

      //--------- Checking if the value is on the same row, col, or region of 'coordinate' ---------//
      let checkRow = solver.checkRowPlacement(puzzleMatrix, row, col, value)
      let checkCol = solver.checkColPlacement(puzzleMatrix, row, col, value)
      let checkRegion = solver.checkRegionPlacement(puzzleMatrix, row, col, value)

      //--------- If the checks are undefined, then, the coordinate and value are valid ---------//
      if (!checkRow && !checkCol && !checkRegion) {
        return res.json({ valid: true }) //--------- RESPONSE --------- //
      } else {
        //---------Else, push the checks that are not undefined into a 'conflict' array ---------//
        let check = [checkRow, checkCol, checkRegion]
        let conflict = []
        for (let i = 0; i < 3; i++) {
          if (check[i]) {
            conflict.push(check[i])
          }
        }
        return res.json({ valid: false, conflict }) //--------- RESPONSE --------- //
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle
      let isValid = solver.validate(puzzleString)
      
      //--------- Checking if the puzzleString is valid ---------//
      if (isValid != true) {
        res.json(isValid)
      } else {
        //-------
        let puzzleMatrix = [];

        for (let i = 0; i < 9; i ++) {
          puzzleMatrix[i] = []
          for (let j = 0; j < 9; j++) {
            puzzleMatrix[i][j]= req.body.puzzle[(9*i)+j]
          }
        }

        let solution = solver.solve(puzzleMatrix, 1, 1)

        if (solution == false) {
          res.json({ error: 'Puzzle cannot be solved' })
        } else {
          res.json({ solution })
        }
      }
    });
};
