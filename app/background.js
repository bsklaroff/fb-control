var currentTab = null;
var onFacebook = false;
var facebookStartTime = null;
var totalFacebookTime = 0;
var timeSynced = true;
var siteRegexp = /^\w+:\/\/([^\/]+).*$/;

$(document).ready(function() {
  chrome.storage.sync.get('total_facebook_time', function(res) {
    if (res.total_facebook_time !== undefined) {
      totalFacebookTime = res.total_facebook_time;
    }
  });
});

var isFacebook = function(tab) {
  if (tab === null) {
    return false;
  }
  var match = tab.url.match(siteRegexp);
  if (match === null) {
    return false;
  }
  return match[1] === "www.facebook.com";
};

var syncTime = function() {
  if (!timeSynced) {
    chrome.storage.sync.set({'total_facebook_time': totalFacebookTime}, function() {
      timeSynced = true;
    });
  }
};

var recordFacebookTime = function() {
  currentTime = new Date().getTime();
  totalFacebookTime += currentTime - facebookStartTime;
  timeSynced = false;
  if (currentTab !== null) {
    chrome.tabs.sendMessage(currentTab.id, {'total_facebook_time': totalFacebookTime});
  }
  facebookStartTime = currentTime;
};

var checkUpdateTime = function() {
  if (onFacebook) {
    recordFacebookTime();
  }
};

var checkFacebookSwitch = function() {
  if (onFacebook) {
    if (!isFacebook(currentTab)) {
      recordFacebookTime();
      onFacebook = false;
    }
  } else {
    if (isFacebook(currentTab)) {
      facebookStartTime = new Date().getTime();
      onFacebook = true;
    }
  }
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.focus === true) {
    currentTab = sender.tab;
    checkFacebookSwitch();
  } else if (currentTab !== null && sender.tab.id === currentTab.id && request.blur === true) {
    currentTab = null;
    checkFacebookSwitch();
  }
});

chrome.tabs.onUpdated.addListener(function() {
  tabChange();
});

chrome.tabs.onActivated.addListener(function() {
  tabChange();
});

chrome.windows.onFocusChanged.addListener(function() {
  tabChange();
});

var tabChange = function() {
  queryInfo = {
    active: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    if (tabs.length == 0) {
      console.log('no tabs found!');
    } else {
      chrome.windows.getLastFocused(function(topWindow) {
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].windowId == topWindow.id) {
            if (currentTab === null
                || currentTab.id !== tabs[i].id
                || currentTab.url !== tabs[i].url) {
              currentTab = tabs[i];
              checkFacebookSwitch();
            }
          }
        }
      });
    }
  });
};

setInterval(checkUpdateTime, 1000);
setInterval(syncTime, 20000);
