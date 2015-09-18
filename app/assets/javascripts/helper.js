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
