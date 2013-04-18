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
  seconds -= 60 * minutes;
  minutes -= 60 * hours;
  hours -= 24 * days;
  res = ''
  if (days !== 0) {
    if (days === 1) {
      res += days + ' day, ';
    } else {
      res += days + ' days, ';
    }
  }
  if (days + hours !== 0) {
    if (hours === 1) {
      res += hours + ' hour, ';
    } else {
      res += hours + ' hours, ';
    }
  }
  if (days + hours + minutes !== 0) {
    if (minutes === 1) {
      res += minutes + ' minute, ';
    } else {
      res += minutes + ' minutes, ';
    }
  }
  if (seconds === 1) {
    res += seconds + ' second';
  } else {
    res += seconds + ' seconds';
  }
  return res;
};

var replace = function() {
  var htmlStr = '';
  if (totalFacebookTime !== 0) {
    htmlStr = 'You have spent ' + getTimeStr(totalFacebookTime) + ' on facebook';
  }
  if ($('#pagelet_home_stream').length > 0) {
    $('#pagelet_home_stream').html(htmlStr);
  } else if ($('#pagelet_feed_header').length > 0) {
    $('#pagelet_feed_header').parent().html(htmlStr);
  }
  setTimeout(replace, 1000);
}

replace();
