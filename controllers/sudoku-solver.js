class SudokuSolver {

  validate(puzzleString) {
    let regex = /[^0-9.]/g
    if (!puzzleString) {
      return { error: 'Required field missing' }
    } else if (regex.test(puzzleString) === true) {
      return { error: 'Invalid characters in puzzle' }
    } else if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    } else {
      return true
    }
  }

  checkRowPlacement(puzzleMatrix, row, col, value) {
    //console.log('checking row')
    for (let j = 1; j <= 9; j++) {
      if (col !== j) {
        //console.log(row, j, puzzleMatrix[row-1][j-1])
        if (puzzleMatrix[row-1][j-1] == value) {
          return 'row'
        }
      }
    }
  }

  checkColPlacement(puzzleMatrix, row, col, value) {
    //console.log('checking col')
    for (let i = 1; i <= 9; i++) {
      if (row !== i) {
        //console.log(i, col, puzzleMatrix[i-1][col-1]) 
        if (puzzleMatrix[i-1][col-1] == value) {
          return 'column'
        }
      }
    }
  }

  checkRegionPlacement(puzzleMatrix, row, col, value) {
    let startRow = parseInt((row-1) / 3) * 3 + 1
    let startCol = parseInt((col-1) / 3) * 3 + 1
    //console.log(startRow, startCol)
    //console.log('checking region')
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (row !== i || col !== j) {
          //console.log(i, j, puzzleMatrix[i-1][j-1])
          if (puzzleMatrix[i-1][j-1] == value) {
            return 'region'
          }
        }
      }
    }
  }

  validAll(puzzleMatrix, row, col, value) {
    let check = [
      this.checkRowPlacement(puzzleMatrix, row, col, value),
      this.checkColPlacement(puzzleMatrix, row, col, value),
      this.checkRegionPlacement(puzzleMatrix, row, col, value)
    ]
    if (check[0] || check[1] || check[2]) {
      return false
    } else {
      return true
    }

  }

  solve(puzzleMatrix, row, col) {
    //console.log('fila:', row, 'columna:', col)
    
    if (col > 9) {
      row++
      col = 1
    }

    if (row > 9) {
      return puzzleMatrix.map(element => element.join('')).join('')
    }

    if (puzzleMatrix[row-1][col-1] != '.') {
      return this.solve(puzzleMatrix, row, col+1)
    }

    for (let num = 1; num <= 9; num++) {
      if (this.validAll(puzzleMatrix, row, col, num)) {
        puzzleMatrix[row-1][col-1] = num.toString()
        //console.log('Entro:', num)
        //console.log(row, col, puzzleMatrix[row-1][col-1])
        if (this.solve(puzzleMatrix, row, col+1) != false ) {
          return puzzleMatrix.map(element => element.join('')).join('')
        } else {
          //console.log('Volviendo')
          puzzleMatrix[row-1][col-1] = '.'
        }
      }
    }

    return false
  }

}

module.exports = SudokuSolver;

