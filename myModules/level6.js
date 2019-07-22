exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 350,
    y: 250,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 300,
    y: 450,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 450,
    y: 450,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  walls: [
    {
      x: 600,
      y: 50,
      width: 200,
      height: 50,
      color: "#4EABFF",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: 450,
        xGauge: 450,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 550,
      y: 200,
      width: 150,
      height: 50,
      color: "#4EABFF",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: -100,
        xGauge: -100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 650,
      y: 350,
      width: 150,
      height: 50,
      color: "#4EABFF",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: 100,
        xGauge: 100,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 0,
      y: 350,
      width: 100,
      height: 50,
      color: "#4EABFF",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: -150,
        xGauge: -150,
        vertMaxPot: 0,
        yGauge: 0,
        activated: false
      }
    },
    {
      x: 100,
      y: 200,
      width: 150,
      height: 50,
      color: "#4EABFF",
      isFire: true,
      isDoor : {
        id: 2,
        horizMaxPot: 100,
        xGauge: 100,
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
      color: '#663D30',
    },
    {
      x: 100,
      y: 50,
      width: 50,
      height: 500,
      color: '#663D30',
    },
    {
      x: 250,
      y: 150,
      width: 50,
      height: 300,
      color: '#663D30',
    },
    {
      x: 500,
      y: 150,
      width: 50,
      height: 300,
      color: '#663D30',
    },
    {
      x: 650,
      y: 50,
      width: 50,
      height: 500,
      color: '#663D30',
    },
    {
      x: 300,
      y: 400,
      width: 200,
      height: 50,
      color: '#663D30',
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: '#663D30',
    },
  ],
  switches : [
    {
      x: 175,
      y: 275,
      width: 50,
      height: 50,
      id: 1,
      color : [93, 207, 108],
      activated: false
    },
    {
      x: 175,
      y: 125,
      width: 50,
      height: 50,
      id: 2,
      color : [78, 171, 255],
      activated: false
    }
  ],
  coins : [
    {
      x: 162,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 212,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 262,
      y: 62,
      width: 25,
      height: 25
    },
    {
      x: 312,
      y: 62,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#C1C4D9',
  levelTitle: 'La salle à brochettes'
}