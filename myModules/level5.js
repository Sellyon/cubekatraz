exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 350,
    y: 0,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 350,
    y: 350,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 400,
    y: 350,
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
      y: 0,
      width: 350,
      height: 50,
      color: '#663D30',
    },
    {
      x: 450,
      y: 0,
      width: 350,
      height: 50,
      color: '#663D30',
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
      color: '#663D30',
    },
    {
      x: 100,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 150,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 200,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 250,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 300,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 450,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 500,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 550,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 600,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 650,
      y: 50,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 50,
      color: '#663D30',
    },
    {
      x: 0,
      y: 100,
      width: 50,
      height: 50,
      color: '#663D30',
      isFire: true
    },
    {
      x: 750,
      y: 100,
      width: 50,
      height: 50,
      color: '#663D30',
      isFire: true
    },
    {
      x: 0,
      y: 150,
      width: 50,
      height: 400,
      color: '#663D30',
    },
    {
      x: 50,
      y: 150,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 700,
      y: 150,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 750,
      y: 150,
      width: 50,
      height: 400,
      color: '#663D30',
    },
    {
      x: 50,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 250,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 300,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 350,
      y: 200,
      width: 100,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 450,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 500,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 550,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 700,
      y: 200,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 50,
      y: 250,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 200,
      y: 250,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 250,
      y: 250,
      width: 300,
      height: 100,
      color: '#5C616E',
    },
    {
      x: 550,
      y: 250,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 700,
      y: 250,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 50,
      y: 300,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 200,
      y: 300,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 550,
      y: 300,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 700,
      y: 300,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 50,
      y: 350,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 700,
      y: 350,
      width: 50,
      height: 50,
      color: '#5C616E',
    },
    {
      x: 50,
      y: 400,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 700,
      y: 400,
      width: 50,
      height: 50,
      color: '#5C616E',
      isFire: true
    },
    {
      x: 50,
      y: 450,
      width: 50,
      height: 100,
      color: '#5C616E',
    },
    {
      x: 150,
      y: 450,
      width: 500,
      height: 100,
      color: '#5C616E',
    },
    {
      x: 700,
      y: 450,
      width: 50,
      height: 100,
      color: '#5C616E',
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: '#663D30',
    },
  ],
  coins : [
    {
      x: 62,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 712,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 112,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 662,
      y: 512,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#C1C4D9',
  levelTitle: 'Les cuisines'
}