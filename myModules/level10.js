exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 0,
    y: 0,
    width: 100,
    height: 600,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 750,
    y: 150,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 750,
    y: 400,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  switches : [
    {
      x: 650,
      y: 500,
      width: 50,
      height: 50,
      id: 1,
      color : [204, 200, 147],
      activated: false
    },
    {
      x: 550,
      y: 200,
      width: 50,
      height: 50,
      id: 2,
      color : [113, 227, 143],
      activated: false
    },
    {
      x: 550,
      y: 450,
      width: 50,
      height: 50,
      id: 3,
      color : [227, 166, 118],
      activated: false
    },
    {
      x: 350,
      y: 200,
      width: 50,
      height: 50,
      id: 4,
      color : [145, 182, 217],
      activated: false
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 500,
      id: 5,
      color : [0, 0, 0],
      activated: false
    },
  ],
  walls: [
    {
      x: 600,
      y: 50,
      width: 50,
      height: 200,
      color: "#CCC893",
      isDoor : {
        id: 1,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -150,
        yGauge: -150,
        activated: false
      }
    },
    {
      x: 450,
      y: 350,
      width: 50,
      height: 100,
      color: "#71E38F",
      isDoor : {
        id: 2,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 300,
        yGauge: 300,
        activated: false
      }
    },
    {
      x: 400,
      y: 50,
      width: 50,
      height: 100,
      color: "#E3A676",
      isDoor : {
        id: 3,
        speed: 5,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 400,
      y: 450,
      width: 50,
      height: 100,
      color: "#91B6D9",
      isDoor : {
        id: 4,
        speed: 5,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 100,
      y: 0,
      width: 700,
      height: 50,
      color: "#3A0908",
      isFire: true
    },
    {
      x: 200,
      y: 150,
      width: 200,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 400,
      y: 150,
      width: 50,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 500,
      y: 150,
      width: 150,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 150,
      y: 250,
      width: 650,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 150,
      y: 400,
      width: 100,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 300,
      y: 400,
      width: 50,
      height: 150,
      color: "#3A0908",
    },
    {
      x: 400,
      y: 350,
      width: 50,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 500,
      y: 400,
      width: 100,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 600,
      y: 400,
      width: 50,
      height: 150,
      color: "#3A0908",
    },
    {
      x: 100,
      y: 550,
      width: 700,
      height: 50,
      color: "#3A0908",
      isFire: true
    },
    {
      x: 100,
      y: -300,
      width: 50,
      height: 300,
      color: "#66201C",
      isFire: true,
      isDoor : {
        id: 5,
        speed: 0.25,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -300,
        yGauge: -300,
        activated: false
      }
    },
    {
      x: 100,
      y: 600,
      width: 50,
      height: 300,
      color: "#66201C",
      isFire: true,
      isDoor : {
        id: 5,
        speed: 0.25,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 300,
        yGauge: 300,
        activated: false
      }
    },
  ],
  coins : [
    {
      x: 162,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 262,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 62,
      y: 12,
      width: 25,
      height: 25
    },
    {
      x: 62,
      y: 562,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#B80F00',
  levelTitle: 'La dernière porte'
}