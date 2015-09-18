function statusmap(status) {
  var target = 'default';
  switch (status) {
    case 'passed':
      target = 'success';
      break;
    case 'failed':
      target = 'danger';
      break;
    case 'broken':
      target = 'warning';
      break;
    case 'pending':
      target = 'default';
      break;
    default:
      target = 'default';
  }
  return target;
}

function statusIcon(status) {
  var icon = 'question';
  switch (status) {
    case 'passed':
      icon = 'check';
      break;
    case 'failed':
      icon = 'times';
      break;
    case 'broken':
      icon = 'bolt';
      break;
    case 'canceled':
      icon = 'ban';
      break;
    default:
      icon = 'question';
  }
  return icon;
}

Number.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}

function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var key = f(o);
    if (key == null) {return;}
    // var group = JSON.stringify( f(o) );
    var group = f(o);
    groups[group] = groups[group] || [];
    groups[group].push( o );
  });
  return groups;
  // return Object.keys(groups).map( function( group )
  // {
  //   return groups[group];
  // })
}

function showDuration(start, stop) {
  var _start = moment(start);
  var _stop = moment(stop);
  var _duration = _stop.diff(_start, 'seconds').toHHMMSS();
  var content = [
    _start.format('HH:mm:SS'),
    '->',
    _stop.format('HH:mm:SS'),
    '(' + _duration + ')'
  ];
  return content.join(' ');
}

function showDate(time) {
  return moment(time).format("YYYY-MM-DD");
}
