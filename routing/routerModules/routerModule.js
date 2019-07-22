exports.requireLogin = function (req, res, next) {
  if (req.session.user) {
    // User is authenticated, let him in
    next();
  } else {
    // Otherwise, we redirect him to login form
    res.redirect("/login");
  }
}

exports.getUserName = function (req) {
  if (req.session.user) {
    return req.session.user
  } else {
    return 'mysterieux inconnu'
  }
}

exports.getVictoryMessage = function (message) {
  if (message) {
    message = 'oui';
  } else {
    message = 'non';
  }
  return message
}

exports.convertDateNowToEuropeanDate = function (date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}

exports.msToTime = function(duration) {
    // let milliseconds = parseInt((duration%1000)/100)
    let seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}