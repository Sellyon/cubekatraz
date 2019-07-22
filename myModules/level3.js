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
    height: 200,
    player1InZone: false,
    player2InZone: false
  },
  player1: {
    x: 50,
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
  switches : [
    {
      x: 75,
      y: 100,
      width: 50,
      height: 50,
      id: 9,
      color : [38, 102, 199],
      activated: false
    },
    {
      x: 225,
      y: 100,
      width: 50,
      height: 50,
      id: 5,
      color : [20, 227, 121],
      activated: false
    },
    {
      x: 375,
      y: 100,
      width: 50,
      height: 50,
      id: 8,
      color : [41, 156, 214],
      activated: false
    },
    {
      x: 525,
      y: 100,
      width: 50,
      height: 50,
      id: 7,
      color : [33, 224, 237],
      activated: false
    },
    {
      x: 75,
      y: 450,
      width: 50,
      height: 50,
      id: 3,
      color : [53, 214, 30],
      activated: false
    },
    {
      x: 225,
      y: 450,
      width: 50,
      height: 50,
      id: 4,
      color : [28, 199, 61],
      activated: false
    },
    {
      x: 375,
      y: 450,
      width: 50,
      height: 50,
      id: 1,
      color : [193, 227, 20],
      activated: false
    },
    {
      x: 525,
      y: 450,
      width: 50,
      height: 50,
      id: 6,
      color : [32, 227, 183],
      activated: false
    },
    {
      x: 500,
      y: 275,
      width: 50,
      height: 50,
      id: 2,
      color : [124, 237, 21],
      activated: false
    },
  ],
  walls: [
    {
      x: 600,
      y: 200,
      width: 50,
      height: 200,
      color: '#C1E314',
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
      y: 0,
      width: 800,
      height: 50,
      color: '#6B4743',
    },
    {
      x: 0,
      y: 550,
      width: 800,
      height: 50,
      color: '#6B4743',
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 150,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 300,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 450,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 600,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 750,
      y: 50,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 0,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 150,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 300,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 450,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 600,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 750,
      y: 400,
      width: 50,
      height: 150,
      color: '#6B4743',
    },
    {
      x: 50,
      y: 150,
      width: 100,
      height: 50,
      color: '#7CED15',
      isDoor : {
        id: 2,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 200,
      y: 150,
      width: 100,
      height: 50,
      color: '#35D61E',
      isDoor : {
        id: 3,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 350,
      y: 150,
      width: 100,
      height: 50,
      color: '#1CC73D',
      isDoor : {
        id: 4,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 500,
      y: 150,
      width: 100,
      height: 50,
      color: '#14E379',
      isDoor : {
        id: 5,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: 100,
        yGauge: 100,
        activated: false
      }
    },
    {
      x: 50,
      y: 400,
      width: 100,
      height: 50,
      color: '#20E3B7',
      isDoor : {
        id: 6,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 200,
      y: 400,
      width: 100,
      height: 50,
      color: '#21E0ED',
      isDoor : {
        id: 7,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 350,
      y: 400,
      width: 100,
      height: 50,
      color: '#299CD6',
      isDoor : {
        id: 8,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
    {
      x: 500,
      y: 400,
      width: 100,
      height: 50,
      color: '#2666C7',
      isDoor : {
        id: 9,
        speed: 2,
        horizMaxPot: 0,
        xGauge: 0,
        vertMaxPot: -100,
        yGauge: -100,
        activated: false
      }
    },
  ],
  coins : [
  {
    x: 662,
    y: 62,
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
  levelColor: '#9D9775',
  levelTitle: 'Les toilettes'
}