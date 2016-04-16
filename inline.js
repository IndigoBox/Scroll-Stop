var pageDeleted = false;
var pageMatch = false;
var siteURLs;
var sitePxs; //default value
var currSitePx = 300;
var websiteIndex = 0; //the index of the website in the URL array
var closeBehav = "close";
var redirectURL = "http://www.google.com"; //default value
var lastAlert = 0; //last scroll value we alerted at
var alertDiff = 1000; //duration until we alert again

var paused = false;

function siteBlocked()
{
	var siteArray = siteURLs.split(",");
	for(var i = 0; i < siteArray.length; i++)
	{
		if(window.location.href.indexOf(siteArray[i]) != "" && window.location.href.indexOf(siteArray[i]) > -1)
		{
			websiteIndex = i;
			return true;
		}
	}
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if (request.method == "setURLs")
    {
			siteURLs = request.data;
			if(siteBlocked())
			{
				pageMatch = true;
			}
			else
			{
				pageMatch = false;
			}
    }
	else if(request.method == "setPxs")
	{
		sitePxs = request.data;
		sitePxs = sitePxs.split(",");
	}
	else if(request.method == "setClose")
	{
		closeBehav = request.data;
	}
	else if(request.method == "setRedirect")
	{
		redirectURL = request.data;
	}
	else if(request.method == "togglePaused")
	{
		paused = !paused;
	}
});

/*
chrome.runtime.sendMessage({method: "getLocalStorage", key: "siteURLs"}, function(response)
{
	siteURLs = response.data;

	//after siteURL is loaded, use that data
	//alert(siteURLs);

	if(siteBlocked())
	{
		//alert("Blocked. Match with " + siteURLs);
		pageMatch = true;
	}
	else
	{
		//alert("No block. No match with " + siteURL + " on " + window.location.href);
	}
});

chrome.runtime.sendMessage({method: "getLocalStorage", key: "sitePxs"}, function(response)
{
	sitePxs = response.data;
	sitePxs = sitePxs.split(",");
});

chrome.runtime.sendMessage({method: "getLocalStorage", key: "closeBehav"}, function(response)
{
	closeBehav = response.data;
});
*/

window.onscroll = function(ev)
{
	//alert("For this site, scroll value is " + sitePxs[websiteIndex]);
	if(sitePxs != null)
	{
		if(window.scrollY > sitePxs[websiteIndex] && pageMatch)
		{
			pageDeleted = true;

			//alert("You've gone too far");
			if(closeBehav == "close")
			{
				chrome.runtime.sendMessage({method: "closeTab"}, function(response)
				{
				  // console.log(response);
				});
			}
			else if(closeBehav == "remove")
			{
				document.body.remove();
			}
			else if(closeBehav == "redirect")
			{
				window.location.replace(redirectURL);
			}
			else if(closeBehav == "alert")
			{
				if(lastAlert == 0 || window.scrollY > lastAlert + alertDiff)
				{
					alert("Hey, you've been scrolling for a while.");
					lastAlert = window.scrollY;
				}
			}
			else
			{
				chrome.runtime.sendMessage({method: "closeTab"}, function(response)
				{
				  // console.log(response);
				});
			}
		}
	}
};