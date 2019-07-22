exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 700,
    y: 450,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 0,
    y: 300,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 0,
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
      x: 550,
      y: 300,
      width: 50,
      height: 50,
      color: '#9D6DC9',
      isDoor : {
        id: 1,
        horizMaxPot: 50,
        xGauge: 50,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 350,
      y: 250,
      width: 50,
      height: 50,
      color: '#686AB0',
      isDoor : {
        id: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 50,
        yGauge: 50,
        activated: false
      }
    },
    {
      x: 600,
      y: 150,
      width: 50,
      height: 50,
      color: '#709CBD',
      isDoor : {
        id: 3,
        horizMaxPot: 50,
        xGauge: 50,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 650,
      y: 450,
      width: 50,
      height: 100,
      color: '#72D4C9',
      isDoor : {
        id: 4,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 0,
      y: 0,
      width: 800,
      height: 50,
      color: '#12171A',
    },
    {
      x: 0,
      y: 400,
      width: 50,
      height: 150,
      color: '#12171A',
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: '#12171A',
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 250,
      color: '#12171A',
    },
    {
      x: 50,
      y: 250,
      width: 100,
      height: 50,
      color: '#12171A',
    },
    {
      x: 50,
      y: 400,
      width: 100,
      height: 50,
      color: '#12171A',
    },
    {
      x: 100,
      y: 100,
      width: 150,
      height: 50,
      color: '#12171A',
    },
    {
      x: 100,
      y: 150,
      width: 50,
      height: 50,
      color: '#12171A',
    },
    {
      x: 200,
      y: 150,
      width: 50,
      height: 350,
      color: '#12171A',
    },
    {
      x: 250,
      y: 200,
      width: 200,
      height: 50,
      color: '#12171A',
    },
    {
      x: 250,
      y: 350,
      width: 100,
      height: 50,
      color: '#12171A',
    },
    {
      x: 300,
      y: 50,
      width: 50,
      height: 100,
      color: '#12171A',
    },
    {
      x: 300,
      y: 450,
      width: 50,
      height: 100,
      color: '#12171A',
    },
    {
      x: 350,
      y: 100,
      width: 150,
      height: 50,
      color: '#12171A',
    },
    {
      x: 350,
      y: 300,
      width: 50,
      height: 100,
      color: '#12171A',
    },
    {
      x: 350,
      y: 450,
      width: 100,
      height: 50,
      color: '#12171A',
    },
    {
      x: 450,
      y: 300,
      width: 50,
      height: 50,
      color: '#12171A',
    },
    {
      x: 450,
      y: 400,
      width: 50,
      height: 100,
      color: '#12171A',
    },
    {
      x: 500,
      y: 200,
      width: 50,
      height: 150,
      color: '#12171A',
    },
    {
      x: 550,
      y: 50,
      width: 50,
      height: 200,
      color: '#12171A',
    },
    {
      x: 0,
      y: 0,
      width: 800,
      height: 50,
      color: '#12171A',
    },
    {
      x: 600,
      y: 300,
      width: 50,
      height: 150,
      color: '#12171A',
    },
    {
      x: 650,
      y: 150,
      width: 100,
      height: 50,
      color: '#12171A',
    },
    {
      x: 650,
      y: 400,
      width: 150,
      height: 50,
      color: '#12171A',
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 350,
      color: '#12171A',
    },
  ],
  switches : [
    {
      x: 75,
      y: 475,
      width: 50,
      height: 50,
      id: 1,
      color : [157, 109, 201],
      activated: false
    },
    {
      x: 675,
      y: 325,
      width: 50,
      height: 50,
      id: 2,
      color : [104, 106, 176],
      activated: false
    },
    {
      x: 275,
      y: 275,
      width: 50,
      height: 50,
      id: 3,
      color : [112, 156, 189],
      activated: false
    },
    {
      x: 675,
      y: 75,
      width: 50,
      height: 50,
      id: 4,
      color : [114, 212, 201],
      activated: false
    },
  ],
  coins : [
    {
      x: 362,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 362,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 162,
      y: 162,
      width: 25,
      height: 25
    },
    {
      x: 262,
      y: 462,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#2E3D42',
  levelTitle: 'Les conduits d\'aération'
}