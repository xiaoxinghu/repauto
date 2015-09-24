function getPassRate(status) {
  if (!status) {
    return 0;
  }
  var passed = status.passed || 0;
  var total = passed;
  total += status.failed || 0;
  total += status.broken || 0;
  total += status.pending || 0;
  var pr = Math.round(passed / total * 1000) / 10
  return pr;
}

function getStatusMeta(status) {
  var formated = {
    status: status
  };
  var context = 'default';
  var icon = 'default';
  switch (status) {
    case 'passed':
      formated.context = 'success';
      formated.icon = 'fa fa-check';
      break;
    case 'failed':
      formated.context = 'danger';
      formated.icon = 'fa fa-times';
      break;
    case 'broken':
      formated.context = 'warning';
      formated.icon = 'fa fa-bolt';
      break;
    case 'pending':
      formated.context = 'default';
      formated.icon = 'fa fa-ban';
      break;
    case 'todo':
      formated.context = 'primary';
      formated.icon = 'fa fa-check-square-o';
      break;
    case 'pr':
      formated.context = 'info';
      formated.icon = 'fa fa-pie-chart';
      break;
    default:
  }
  // var orderedStatus = ['passed', 'failed', 'broken', 'pending', 'todo', 'rate'];
  // formated = orderedStatus.filter(function(s) {
  //   return status.hasOwnProperty(s);
  // }).map(function(s) {
  //   return {
  //     color: statusmap(s),
  //     icon: statusIcon(s),
  //     key: s,
  //     value: status[s]
  //   }
  // });
  return formated;
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

function showDateTime(time) {
  return moment(time).format("YYYY-MM-DD H:m:s");
}
