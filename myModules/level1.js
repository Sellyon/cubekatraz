exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 350,
    y: 500,
    width: 100,
    height: 100,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  player2: {
    x: 700,
    y: 50,
    width: 50,
    height: 50,
    movingLeft: false,
    movingRight: false,
    movingUp: false,
    movingDown: false,
  },
  walls: [
    {
      x: 250,
      y: 250,
      width: 50,
      height: 50,
      color: "#4EABFF",
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
      x: 300,
      y: 250,
      width: 50,
      height: 150,
      color: "#4EABFF",
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
      x: 450,
      y: 250,
      width: 50,
      height: 150,
      color: "#5DCF99",
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
      x: 500,
      y: 250,
      width: 50,
      height: 50,
      color: "#5DCF99",
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
      x: 350,
      y: 0,
      width: 100,
      height: 400,
      color: "#86949C",
    },
    {
      x: 0,
      y: 250,
      width: 250,
      height: 50,
      color: "#86949C",
    },
    {
      x: 550,
      y: 250,
      width: 250,
      height: 50,
      color: "#86949C",
    },
    {
      x: 0,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
    {
      x: 100,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
    {
      x: 200,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
    {
      x: 550,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
    {
      x: 650,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
    {
      x: 750,
      y: 300,
      width: 50,
      height: 100,
      color: "#86949C",
    },
  ],
  switches : [
    {
      x: 300,
      y: 150,
      width: 50,
      height: 50,
      id: 2,
      color : [93, 207, 108],
      activated: false
    },
    {
      x: 100,
      y: 500,
      width: 50,
      height: 50,
      id: 1,
      color : [78, 171, 255],
      activated: false
    }
  ],
  coins : [
  {
    x: 62,
    y: 325,
    width: 25,
    height: 25
  },
  {
    x: 162,
    y: 325,
    width: 25,
    height: 25
  },
  {
    x: 612,
    y: 325,
    width: 25,
    height: 25
  },
  {
    x: 712,
    y: 325,
    width: 25,
    height: 25
  }
  ],
  instanceCounter: 0,
  levelColor: '#D9D1D7',
  levelTitle: 'Les cellules'
}