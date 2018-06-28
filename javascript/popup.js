// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 **/



function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */

function renderStatus(statusText)
{
  document.getElementById('status').innerHTML = statusText;
}

function addSiteFromPopup(url)
{
  var siteURLs = localStorage["siteURLs"];
  var sitePXs = localStorage["sitePxs"];
  currentDomain = url.split('/')[2]; // get everything after http[s]://, and before trailing '/'
  console.log("Adding " + currentDomain);
  var siteURLList;
  var sitePXList;
  if(siteURLs == null)
  {
		siteURLList = [];
    sitePXList = [];
	}
  else {
    siteURLList = siteURLs.split(",");
    sitePXList = siteURLs.split(",");
  }
  siteURLList.push(currentDomain);
  sitePXList.push(500); // Default is 500 pixels, which is what is added if done via the button.

  // Update the database.
  localStorage["siteURLs"] = siteURLList;
  localStorage["sitePxs"] = sitePXList;

}

function removeSiteFromPopup(url) {
  var siteURLs = localStorage["siteURLs"];
  var sitePXs = localStorage["sitePxs"];
  currentDomain = url.split('/')[2];
  var siteArray = siteURLs.split(",");
  var pxArray = sitePXs.split(",");
  // Why length - 1? It turns out that the split has '' as an element in the array.
  // But '' is in everything, so this would always report active.
	for(var i = 0; i < siteArray.length; i++)
	{
    console.log(siteArray[i]);
    console.log(currentDomain);
		if(currentDomain.indexOf(siteArray[i]) > -1)
		{
			siteArray.splice(i, 1);
      pxArray.splice(i, 1);
      localStorage["siteURLs"] = siteArray;
    	localStorage["sitePxs"] = pxArray;
      return;
		}
	}
}

function siteBlocked(url)
{
	var siteURLs = localStorage["siteURLs"];
	if(typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
  // Why length - 1? It turns out that the split has '' as an element in the array.
  // But '' is in everything, so this would always report active.
	for(var i = 0; i < siteArray.length; i++)
	{
		if((url.indexOf(siteArray[i]) > -1) && siteArray[i] != '')
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

function blockedText(urlFound) {
  return `
    <div id='popupHeader' style='background-color:#303f9f'>
      <i class="material-icons">
        track_changes
      </i>
      <span class="popupHeaderText">
        Active
      </span>
    </div>
    <div id='popupRemainder'>
      <p class="popupRemainderText">You've limited scrolling on this site.
      <span class="textEmphasize">We'll be scroll stopping here!</span>
      </p>
    </div>
    <div id='button-container'>
      <button id="button-add-site" class="button-limit">
        <i class="material-icons">
          public
        </i>
        <span class="button-limit-text">
          Unlimit this site
        </span>
        </button>
    </div>`;
}

function notBlockedText(urlFound) {
  return `
  <div id='popupHeader' style='background-color:#546e7a'>
    <i class="material-icons">
      notifications_off
    </i>
    <span class="popupHeaderText">
      Inactive
    </span>
  </div>
  <div id='popupRemainder'>
    <p class="popupRemainderText">You can <span class="textEmphasize">scroll freely</span> on this site!
    To limit scrolling here, click on the button below.</p>
  </div>
  <div id='button-container'>
    <button id="button-add-site" class="button-limit">
      <i class="material-icons">
        public
      </i>
      <span class="button-limit-text">
        Limit this site
      </span>
      </button>
  </div>`;
}

function noSitesText(urlFound) {
  return `
  <div id='popupHeader' style='background-color:#707070'>
    <i class="material-icons">
      announcement
    </i>
    <span class="popupHeaderText">
      No Sites Added
    </span>
  </div>
  <div id='popupRemainder'>
    <p class="popupRemainderText">There are <span class="textEmphasize">no</span>
    sites set up for Scroll Stop to watch right now.</p>
  </div>
  <div id='button-container'>
    <button id="button-add-site" class="button-limit">
      <i class="material-icons">
        public
      </i>
      <span class="button-limit-text">
        Limit this site
      </span>
      </button>
  </div>
  `;
}


document.addEventListener('DOMContentLoaded', function()
{
	getCurrentTabUrl(function(url)
	{
    var siteURLs = localStorage["siteURLs"];
    console.log(localStorage["siteURLs"]);
		if(siteURLs != null && siteBlocked(url))
		{
			renderStatus(blockedText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        removeSiteFromPopup(url);
        }, false);
		}
		else if(siteURLs != null)
		{
			renderStatus(notBlockedText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        addSiteFromPopup(url);
        }, false);
		}
		else
		{
			renderStatus(noSitesText(url));
      document.getElementById("button-add-site").addEventListener("click", function() {
        addSiteFromPopup(url);
        }, false);
		}

  });
});

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
