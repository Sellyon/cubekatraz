exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 0,
    y: 50,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 100,
    y: 500,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 650,
    y: 500,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  switches : [
    {
      x: 75,
      y: 425,
      width: 50,
      height: 50,
      id: 1,
      color : [204, 200, 147],
      activated: false
    },
    {
      x: 700,
      y: 300,
      width: 50,
      height: 50,
      id: 2,
      color : [113, 227, 143],
      activated: false
    },
    {
      x: 400,
      y: 500,
      width: 50,
      height: 50,
      id: 3,
      color : [227, 166, 118],
      activated: false
    },
    {
      x: 375,
      y: 75,
      width: 50,
      height: 50,
      id: 4,
      color : [145, 182, 217],
      activated: false
    },
    {
      x: 250,
      y: 200,
      width: 50,
      height: 50,
      id: 5,
      color : [102, 32, 28],
      activated: false
    },
    {
      x: 150,
      y: 75,
      width: 50,
      height: 50,
      id: 6,
      color : [218, 128, 193],
      activated: false
    },
  ],
  walls: [
    {
      x: 550,
      y: 400,
      width: 100,
      height: 50,
      color: "#CCC893",
      isDoor : {
        id: 1,
        speed: 1,
        horizMaxPot: -100,
        xGauge: -100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 150,
      y: 400,
      width: 50,
      height: 50,
      color: "#71E38F",
      isDoor : {
        id: 2,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 50,
        yGauge: 50,
        activated: false
      }
    },
    {
      x: 200,
      y: 450,
      width: 100,
      height: 50,
      color: "#71E38F",
      isFire: true,
      isDoor : {
        id: 2,
        speed: 1,
        horizMaxPot: 150,
        xGauge: 150,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 550,
      y: 50,
      width: 200,
      height: 50,
      color: "#71E38F",
      isFire: true,
      isDoor : {
        id: 2,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -500,
        yGauge: -500,
        activated: false
      }
    },
    {
      x: 300,
      y: 550,
      width: 50,
      height: 50,
      color: "#E3A676",
      isDoor : {
        id: 3,
        speed: 5,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 50,
        yGauge: 50,
        activated: false
      }
    },
    {
      x: 450,
      y: 300,
      width: 100,
      height: 50,
      color: "#E3A676",
      isDoor : {
        id: 3,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 50,
        yGauge: 50,
        activated: false
      }
    },
    {
      x: 350,
      y: 250,
      width: 100,
      height: 50,
      color: "#E3A676",
      isDoor : {
        id: 3,
        speed: 1,
        horizMaxPot: 100,
        xGauge: 100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 350,
      y: 450,
      width: 100,
      height: 50,
      color: "#91B6D9",
      isDoor : {
        id: 4,
        speed: 1,
        horizMaxPot: -100,
        xGauge: -100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 350,
      y: 350,
      width: 100,
      height: 50,
      color: "#91B6D9",
      isDoor : {
        id: 4,
        speed: 1,
        horizMaxPot: 100,
        xGauge: 100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 300,
      y: 300,
      width: 50,
      height: 50,
      color: "#91B6D9",
      isDoor : {
        id: 4,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 50,
        yGauge: 50,
        activated: false
      }
    },
    {
      x: 450,
      y: 200,
      width: 100,
      height: 50,
      color: "#91B6D9",
      isDoor : {
        id: 4,
        speed: 10,
        horizMaxPot: 100,
        xGauge: 100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 300,
      y: 50,
      width: 50,
      height: 100,
      color: "#DA80C1",
      isDoor : {
        id: 5,
        speed: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 50,
      y: 150,
      width: 50,
      height: 50,
      color: "#66201C",
      isDoor : {
        id: 6,
        speed: 1,
        horizMaxPot: 50,
        xGauge: 50,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 0,
      y: 0,
      width: 800,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 450,
      y: 50,
      width: 100,
      height: 200,
      color: "#3A0908",
    },
    {
      x: 0,
      y: 150,
      width: 50,
      height: 400,
      color: "#3A0908",
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 500,
      color: "#3A0908",
    },
    {
      x: 100,
      y: 150,
      width: 250,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 300,
      y: 200,
      width: 50,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 100,
      y: 250,
      width: 250,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 450,
      y: 250,
      width: 300,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 50,
      y: 350,
      width: 300,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 450,
      y: 350,
      width: 100,
      height: 200,
      color: "#3A0908",
    },
    {
      x: 650,
      y: 350,
      width: 100,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 150,
      y: 450,
      width: 50,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 300,
      y: 400,
      width: 50,
      height: 100,
      color: "#3A0908",
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: "#3A0908",
    },
    {
      x: 0,
      y: 600,
      width: 800,
      height: 600,
      color: "#66201C",
      isFire: true,
      isDoor : {
        id: 4,
        speed: 0.9,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 600,
        yGauge: 600,
        activated: false
      }
    },
  ],
  coins : [
    {
      x: 212,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 387,
      y: 162,
      width: 25,
      height: 25
    },
    {
      x: 387,
      y: 312,
      width: 25,
      height: 25
    },
    {
      x: 62,
      y: 212,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#B80F00',
  levelTitle: 'L\'alarme est sonnée !'
}