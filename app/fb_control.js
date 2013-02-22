var totalFacebookTime = 0;

$(window).focus(function() {
  chrome.extension.sendMessage({focus: true});
});

$(window).blur(function() {
  chrome.extension.sendMessage({blur: true});
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.total_facebook_time !== undefined) {
    totalFacebookTime = request.total_facebook_time;
  }
});

var getTimeStr = function(millis) {
  var seconds = Math.floor(millis / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  hours -= 24 * days;
  minutes -= 60 * hours;
  seconds -= 60 * minutes;
  res = ''
  if (days !== 0) {
    res += days + ' days, ';
  }
  if (days + hours !== 0) {
    res += hours + ' hours, ';
  }
  if (days + hours + minutes !== 0) {
    res += minutes + ' minutes, ';
  }
  res += seconds + ' seconds';
  return res;
};

var replace = function() {
  try {
    if (totalFacebookTime === 0) {
      document.getElementById('pagelet_home_stream').innerHTML = '';
    } else {
      document.getElementById('pagelet_home_stream').innerHTML =
        'You have spent ' + getTimeStr(totalFacebookTime) + ' on facebook';
    }
  } catch (err) {
    // do nothing if element not found
  }
  setTimeout(replace, 1000);
}

replace();
