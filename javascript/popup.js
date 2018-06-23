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

function siteBlocked(url)
{
	var siteURLs = localStorage["siteURLs"];
	if(typeof siteURLs == 'undefined')
		return false
	var siteArray = siteURLs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if(url.indexOf(siteArray[i]) > -1)
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

var blockedText = `
<div id='popupHeader' style='background-color:#707070'>
  Active
</div>
<div id='popupRemainder'>
  <img id='popupLogo' src='../images/icon48.png'>
  <p>This page is on your list, we'll be scroll stopping here!</p>
</div>`;

var notBlockedText = `
<div id='popupHeader' style='background-color:#F00'>
  Inactive
</div>
<div id='popupRemainder'>
  <img id='popupLogo' src='../images/icon48.png'>
  <p>You're free to scroll here. To change that, click on the button below.</p>
</div>`;

var noSitesText = `
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
<div id='popupButtonSection'>
</div>
<div id='popupGoToSettings'>
</div>

`;


document.addEventListener('DOMContentLoaded', function()
{
	getCurrentTabUrl(function(url)
	{
		var siteURLs = localStorage["siteURLs"];

		if(siteURLs != null && siteBlocked(url))
		{
			renderStatus(blockedText);
		}
		else if(siteURLs != null)
		{
			renderStatus(notBlockedText);
		}
		else
		{
			renderStatus(noSitesText);
		}
  });
});

$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
