exports.rules = {
  levelStarted: false,
  levelDimension: {
    width: 800,
    height: 600
  },
  finishZone: {
    x: 350,
    y: 450,
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
  switches : [
    {
      x: 100,
      y: 150,
      width: 50,
      height: 50,
      id: 1,
      color : [102, 32, 28],
      activated: false
    },
    {
      x: 650,
      y: 150,
      width: 50,
      height: 50,
      id: 2,
      color : [102, 32, 28],
      activated: false
    },
  ],
  walls: [
    {
      x: 150,
      y: 150,
      width: 50,
      height: 100,
      color: "#66201C",
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 200,
      y: 200,
      width: 50,
      height: 100,
      color: "#66201C",
      isFire: true,
      isDoor : {
        id: 2,
        speed: 0.5,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -250,
        yGauge: -250,
        activated: false
      }
    },
    {
      x: 600,
      y: 150,
      width: 50,
      height: 100,
      color: "#66201C",
      isDoor : {
        id: 1,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 550,
      y: 200,
      width: 50,
      height: 100,
      color: "#66201C",
      isFire: true,
      isDoor : {
        id: 2,
        speed: 0.5,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -250,
        yGauge: -250,
        activated: false
      }
    },
    {
      x: 0,
      y: 0,
      width: 800,
      height: 50,
      color: '#665466',
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 500,
      color: '#665466',
    },
    {
      x: 100,
      y: 50,
      width: 600,
      height: 50,
      color: '#665466',
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 500,
      color: '#665466',
    },
    {
      x: 150,
      y: 100,
      width: 500,
      height: 50,
      color: '#665466',
    },
    {
      x: 50,
      y: 150,
      width: 50,
      height: 400,
      color: '#665466',
    },
    {
      x: 200,
      y: 150,
      width: 400,
      height: 50,
      color: '#665466',
    },
    {
      x: 700,
      y: 150,
      width: 50,
      height: 400,
      color: '#665466',
    },
    {
      x: 100,
      y: 200,
      width: 50,
      height: 350,
      color: '#665466',
    },
    {
      x: 250,
      y: 200,
      width: 300,
      height: 50,
      color: '#665466',
    },
    {
      x: 650,
      y: 200,
      width: 50,
      height: 350,
      color: '#665466',
    },
    {
      x: 150,
      y: 250,
      width: 50,
      height: 200,
      color: '#665466',
    },
    {
      x: 300,
      y: 250,
      width: 200,
      height: 50,
      color: '#665466',
    },
    {
      x: 600,
      y: 250,
      width: 50,
      height: 200,
      color: '#665466',
    },
    {
      x: 200,
      y: 300,
      width: 50,
      height: 150,
      color: '#665466',
    },
    {
      x: 350,
      y: 300,
      width: 100,
      height: 50,
      color: '#665466',
    },
    {
      x: 550,
      y: 300,
      width: 50,
      height: 150,
      color: '#665466',
    },
    {
      x: 250,
      y: 350,
      width: 50,
      height: 150,
      color: '#665466',
    },
    {
      x: 500,
      y: 350,
      width: 50,
      height: 150,
      color: '#665466',
    },
    {
      x: 300,
      y: 400,
      width: 50,
      height: 100,
      color: '#665466',
    },
    {
      x: 450,
      y: 400,
      width: 50,
      height: 100,
      color: '#665466',
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: '#665466',
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
      x: 212,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 562,
      y: 512,
      width: 25,
      height: 25
    },
    {
      x: 612,
      y: 512,
      width: 25,
      height: 25
    },
  ],
  instanceCounter: 0,
  levelColor: '#9B8AA1',
  levelTitle: 'Le vide-ordure'
}