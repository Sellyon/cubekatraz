exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 700,
    y: 200,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 0,
    y: 250,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 0,
    y: 300,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  walls: [
    {
      x: 0,
      y: 150,
      width: 800,
      height: 50,
      color: "#86949C"
    },
    {
      x: 0,
      y: 400,
      width: 800,
      height: 50,
      color: "#86949C"
    },
    {
      x: 200,
      y: 0,
      width: 50,
      height: 150,
      color: "#86949C"
    },
    {
      x: 550,
      y: 0,
      width: 50,
      height: 150,
      color: "#86949C"
    },
    {
      x: 200,
      y: 450,
      width: 50,
      height: 150,
      color: "#86949C"
    },
    {
      x: 550,
      y: 450,
      width: 50,
      height: 150,
      color: "#86949C"
    },
    {
      x: 200,
      y: 300,
      width: 100,
      height: 100,
      color: "#9E4620",
    },
    {
      x: 500,
      y: 200,
      width: 100,
      height: 100,
      color: "#9E4620",
    },
    {
      x: 700,
      y: 300,
      width: 100,
      height: 100,
      color: "#9E4620",
    },
  ],
  coins : [
  {
    x: 162,
    y: 362,
    width: 25,
    height: 25
  },
  {
    x: 312,
    y: 362,
    width: 25,
    height: 25
  },
  {
    x: 462,
    y: 212,
    width: 25,
    height: 25
  },
  {
    x: 662,
    y: 362,
    width: 25,
    height: 25
  }
  ],
  instanceCounter: 0,
  levelColor: '#D9D1D7',
  levelTitle: 'Le corridor'
}