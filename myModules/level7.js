exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 700,
    y: 250,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 0,
    y: 200,
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
  switches : [
    {
      x: 0,
      y: 100,
      width: 50,
      height: 400,
      id: 1,
      color : [193, 196, 217],
      activated: false
    },
    {
      x: 150,
      y: 100,
      width: 50,
      height: 400,
      id: 2,
      color : [193, 196, 217],
      activated: false
    },
    {
      x: 400,
      y: 100,
      width: 50,
      height: 400,
      id: 3,
      color : [193, 196, 217],
      activated: false
    },
    {
      x: 650,
      y: 100,
      width: 50,
      height: 400,
      id: 4,
      color : [193, 196, 217],
      activated: false
    }
  ],
  walls: [
    {
      x: 250,
      y: 250,
      width: 100,
      height: 100,
      color: '#663D30',
    },
    {
      x: 450,
      y: 100,
      width: 100,
      height: 100,
      color: '#663D30',
    },
    {
      x: 450,
      y: 400,
      width: 100,
      height: 100,
      color: '#663D30',
    },
    {
      x: 650,
      y: 200,
      width: 50,
      height: 200,
      color: '#663D30',
    },
    {
      x: 0,
      y: 50,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 0,
      y: -300,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 200,
      y: 50,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 200,
      y: -300,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 400,
      y: 50,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 3,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 400,
      y: -300,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 3,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 600,
      y: 50,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 4,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 600,
      y: -300,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 4,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -200,
        yGauge: -200,
        activated: false
      }
    },
    {
      x: 0,
      y: 500,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 0,
      y: 550,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 200,
      y: 500,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 200,
      y: 550,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 400,
      y: 500,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 3,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 400,
      y: 550,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 3,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 600,
      y: 500,
      width: 200,
      height: 50,
      color: "#663D30",
      isFire: true,
      isDoor : {
        id: 4,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
    {
      x: 600,
      y: 550,
      width: 200,
      height: 350,
      color: "#663D30",
      isDoor : {
        id: 4,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 200,
        yGauge: 200,
        activated: false
      }
    },
  ],
  coins : [
    {
      x: 362,
      y: 262,
      width: 25,
      height: 25
    },
    {
      x: 362,
      y: 312,
      width: 25,
      height: 25
    },
    {
      x: 562,
      y: 162,
      width: 25,
      height: 25
    },
    {
      x: 562,
      y: 412,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#C1C4D9',
  levelTitle: 'Le gauffrier'
}