var siteURLs; //array of sites
var sitePxs; //array of pixel numbers (parallel to siteURLs)

window.onload = function()
{
	// executes when HTML-Document is loaded and DOM is ready
	loadOptions();
	document.getElementById("save").addEventListener("click", saveOptions);
	document.getElementById("reset").addEventListener("click", eraseOptions);
	document.getElementById("add").addEventListener("click", addSite);
	document.getElementById("remove0").addEventListener("click", function(){removeSite(0)});
};

function addSite()
{
	//siteURLs[siteURLs.length] = "";
	siteURLs.push("");
	sitePxs.push(0);

	var index = siteURLs.length - 1;
	addSiteField(index);
}

function addSiteField(index)
{
	document.getElementById("sites").insertAdjacentHTML('beforeend', '<div class="option-row" id="row' + index
	+ '">On <input class="siteURL" placeholder="example.com" id="siteURL' + index
	+ '" type="text"></input> stop after <input class="pxNum" value="500" id="pxNum' + index
	+ '" type="number" min="0"></input><select class="limitType"><option value="pixels">pixels</option><option value="screens">screens</option></select><img class="closeImage" id="remove' + index
	+ '" src="cross.png"><br></div>');
	document.getElementById("remove" + index).addEventListener("click", function(){removeSite(index)});
}

function removeSite(index)
{
	remove("row" + index);
	siteURLs.splice(index, 1);
	sitePxs.splice(index, 1);
}

function remove(id)
{
    var elem=document.getElementById(id)
	if(elem != null)
		elem.parentNode.removeChild(elem);
	else
		alert("NULL WITH ID " + id + "!");
}

function loadOptions()
{
	siteURLs = localStorage["siteURLs"];
	sitePxs = localStorage["sitePxs"];
	var closeBehav = localStorage["closeBehav"];
	var redirectURL = localStorage["redirectURL"];

	console.log(siteURLs);
	if(siteURLs == null)
	{
		siteURLs = [""];
	}
	else
	{
		siteURLs = siteURLs.split(",");
	}
	if(sitePxs == null)
	{
		sitePxs = [1];
		sitePxs[0] = 500;
	}
	else
	{
		sitePxs = sitePxs.split(",");
	}

	if(redirectURL != null)
	{
		document.getElementById("redirectURL").value = redirectURL;
	}

	document.getElementById("siteURL0").value = siteURLs[0];
	for(var i = 1; i < siteURLs.length; i++)
	{
		addSiteField(i);
		document.getElementById('siteURL' + i).value = siteURLs[i];
	}

	document.getElementById("pxNum0").value = sitePxs[0];
	for(var i = 1; i < sitePxs.length; i++)
	{
		document.getElementById('pxNum' + i).value = sitePxs[i];
	}

	var radios = document.getElementsByName('closeBehav');

	for (var i = 0, length = radios.length; i < length; i++)
	{
		if (radios[i].value == closeBehav)
		{
			radios[i].checked = true;
			break;
		}
	}
}

function saveOptions()
{
	var closeBehav = "";

	var redirectURL = document.getElementById("redirectURL").value;

	var siteURLInputs = document.getElementsByClassName("siteURL");
	var sitePxInputs = document.getElementsByClassName("pxNum");
	var siteLimitSelection = document.getElementsByClassName("limitType");

	for(var i = 0; i < siteURLInputs.length; i++)
	{
		siteURLs[i] = siteURLInputs[i].value;
	}

	for(var i = 0; i < sitePxInputs.length; i++)
	{
		var siteLimitType = siteLimitSelection[i].value;
		if(siteLimitType == 'pixels')
		{
			sitePxs[i] = sitePxInputs[i].value;
		}
		else
		{
			sitePxs[i] = sitePxInputs[i].value * window.innerHeight;
		}
	}

	var radios = document.getElementsByName('closeBehav');

	for (var i = 0; i < radios.length; i++)
	{
		if (radios[i].checked)
		{
			// do whatever you want with the checked radio
			closeBehav = radios[i].value;
			// only one radio can be logically checked, don't check the rest
			break;
		}
	}

	localStorage["siteURLs"] = siteURLs;
	localStorage["sitePxs"] = sitePxs;

	localStorage["closeBehav"] = closeBehav;
	localStorage["redirectURL"] = redirectURL;
	$("#checkmark").animate({width:'show'},350).delay( 2000);
	$("#checkmark").animate({width:'hide'},350);
}

function eraseOptions()
{
	localStorage.removeItem("siteURLs");
	localStorage.removeItem("sitePxs");
	localStorage.removeItem("closeBehav");
	localStorage.removeItem("redirectURL");
	location.reload();
}