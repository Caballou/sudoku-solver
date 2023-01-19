const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleExample = require('../controllers/puzzle-strings.js').puzzlesAndSolutions[0][0]
const puzzleSolution = require('../controllers/puzzle-strings.js').puzzlesAndSolutions[0][1]

chai.use(chaiHttp);

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

suite('Functional Tests', () => {

  suite('/api/solve POST Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleExample })
        .end((error, res) => {
          assert.equal(res.body.solution, puzzleSolution)
          done()
        })
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: '' })
        .end((error, res) => {
          assert.equal(res.body.error, 'Required field missing')
          done()
        })
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({ puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
      .end((error, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done()
      })
    })

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.2.3' })
      .end((error, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done()
      })
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '11911511.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
      .end((error, res) => {
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done()
      })
    })

  })

  suite('/api/check POST tests', () => {
    
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: '7'
       })
      .end((error, res) => {
        assert.equal(res.body.valid, true)
        done()
      })
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: '2'
       })
      .end((error, res) => {
        assert.equal(res.body.valid, false )
        assert.equal(res.body.conflict.length, 1)
        done()
      })
    })

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: '1'
       })
      .end((error, res) => {
        assert.equal(res.body.valid, false )
        assert.equal(res.body.conflict.length, 2)
        done()
      })
    })

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: '5'
       })
      .end((error, res) => {
        assert.equal(res.body.valid, false )
        assert.equal(res.body.conflict.length, 3)
        done()
      })
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: ''
       })
      .end((error, res) => {
        assert.equal(res.body.error, 'Required field(s) missing' )
        done()
      })
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1'
       })
      .end((error, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle' )
        done()
      })
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: '1.2.3',
        coordinate: 'A1',
        value: '1'
       })
      .end((error, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long' )
        done()
      })
    })

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'Z1',
        value: '1'
       })
      .end((error, res) => {
        assert.equal(res.body.error, 'Invalid coordinate' )
        done()
      })
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({ 
        puzzle: puzzleExample,
        coordinate: 'A1',
        value: '0'
       })
      .end((error, res) => {
        assert.equal(res.body.error, 'Invalid value' )
        done()
      })
    })

  })

});

