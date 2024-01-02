(function(){
"use strict";
'use strict';

/* Useful prm codes
prmTopBarBefore - Top most part of the page
prmLogoAfter - Below the logo but to the left of the search bar? Might be immediately to the right of the logo
prmSearchBarAfter - Below the search bar
prmTopbarAfter - Above search bar, below NavBar
*/

/* Status Bar */
/*
app.component("statusBar", {
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
/*     template: `<span style="margin-left: 40%;">MESSAGE GOES HERE</span>` */
});
app.component("prmTopBarBefore", {
	bindings: {parentCtrl: "<"}, template: "<statusBar></statusBar>"  
});
*/

/* LibCal Integration */
var jq = document.createElement("script");
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
document.getElementsByTagName("head")[0].appendChild(jq);
jq.onload = function() {
  $(document).ready( function() {
    setTimeout( function() {
      $.getScript("https://raw.githubusercontent.com/tjencks1/nccLib/main/LibraryLibCalHoursIntegration.js");
    },1000);
  });
};

/* Collapse "Get It From Other Institutions" dropdown by default in full record display. */
app.component("prmAlmaOtherMembersAfter", {
  bindings: {
    parentCtrl: "<",
  },
  controller: [
    function() {
      var ctrl = this;
 
      this.$onInit = function(){
        {
          ctrl.parentCtrl.isCollapsed = true;
        }
      };
    },
  ],
});

/** 
 * Remember to adjust the var app line in the custom.js file to include customActions:
 * var app = angular.module('viewCustom', ['angularLoad', 'customActions']); 
 */

/** 
 * Add a Custom "Report a Problem" button to the "Send To" Action with LibWizard Service
 * Original github code for Primo from Orbis Cascade Alliance; modifications made for Primo VE.
 * https://github.com/alliance-pcsg/primo-explore-custom-actions
 * Contributed by Evan Barber (University of Illinois Springfield) and Paxton Luangnikone
 */

"use strict";
'use strict';

angular.module('customActions', []);

/* eslint-disable max-len */
angular.module('customActions').component('customAction', {
  bindings: {
	name: '@',
	label: '@',
	icon: '@',
	iconSet: '@',
	link: '@',
	index: '<'
  },
  require: {
	prmActionCtrl: '^prmActionList'
  },
  controller: ['customActions', function (customActions) {
	var _this = this;

	this.$onInit = function () {
  	_this.action = {
    	name: _this.name,
    	label: _this.label,
    	index: _this.index,
    	icon: {
      	icon: _this.icon,
      	iconSet: _this.iconSet,
      	type: 'svg'
    	},
    	onToggle: customActions.processLinkTemplate(_this.link, _this.prmActionCtrl.item)
  	};
  	customActions.addAction(_this.action, _this.prmActionCtrl);
	};
	this.$onDestroy = function () {
  	return customActions.removeAction(_this.action, _this.prmActionCtrl);
	};
  }]
});

/* eslint-disable max-len */
angular.module('customActions').factory('customActions', function () {
  return {
	/**
 	* Adds an action to the actions menu, including its icon.
 	* @param  {object} action  action object
 	* @param  {object} ctrl	instance of prmActionCtrl
 	*/

	addAction: function addAction(action, ctrl) {
  	this.addActionIcon(action, ctrl);
  	if (!this.actionExists(action, ctrl)) {
    	ctrl.actionListService.requiredActionsList.splice(action.index, 0, action.name);
    	ctrl.actionListService.actionsToIndex[action.name] = action.index;
    	ctrl.actionListService.onToggle[action.name] = action.onToggle;
    	ctrl.actionListService.actionsToDisplay.unshift(action.name);
  	}
	},
	/**
 	* Removes an action from the actions menu, including its icon.
 	* @param  {object} action  action object
 	* @param  {object} ctrl	instance of prmActionCtrl
 	*/
	removeAction: function removeAction(action, ctrl) {
  	if (this.actionExists(action, ctrl)) {
    	this.removeActionIcon(action, ctrl);
    	delete ctrl.actionListService.actionsToIndex[action.name];
    	delete ctrl.actionListService.onToggle[action.name];
    	var i = ctrl.actionListService.actionsToDisplay.indexOf(action.name);
    	ctrl.actionListService.actionsToDisplay.splice(i, 1);
    	i = ctrl.actionListService.requiredActionsList.indexOf(action.name);
    	ctrl.actionListService.requiredActionsList.splice(i, 1);
  	}
	},
	/**
 	* Registers an action's icon.
 	* Called internally by addAction().
 	* @param  {object} action  action object
 	* @param  {object} ctrl	instance of prmActionCtrl
 	*/
	addActionIcon: function addActionIcon(action, ctrl) {
  	ctrl.actionLabelNamesMap[action.name] = action.label;
  	ctrl.actionIconNamesMap[action.name] = action.name;
  	ctrl.actionIcons[action.name] = action.icon;
	},
	/**
 	* Deregisters an action's icon.
 	* Called internally by removeAction().
 	* @param  {object} action  action object
 	* @param  {object} ctrl	instance of prmActionCtrl
 	*/
	removeActionIcon: function removeActionIcon(action, ctrl) {
  	delete ctrl.actionLabelNamesMap[action.name];
  	delete ctrl.actionIconNamesMap[action.name];
  	delete ctrl.actionIcons[action.name];
	},
	/**
 	* Check if an action exists.
 	* Returns true if action is part of actionsToIndex.
 	* @param  {object} action  action object
 	* @param  {object} ctrl	instance of prmActionCtrl
 	* @return {bool}
 	*/
	actionExists: function actionExists(action, ctrl) {
  	return ctrl.actionListService.actionsToIndex.hasOwnProperty(action.name);
	},
	/**
 	* Process a link into a function to call when the action is clicked.
 	* The function will open the processed link in a new tab.
 	* Will replace {pnx.xxx.xxx} expressions with properties from the item.
 	* CUSTOM CODE: added a line of code that will also replace the string '{url}' contained in the link with the current url of the user's browser
 	* @param  {string}	link	the original link string from the html
 	* @param  {object}	item	the item object obtained from the controller
 	* @return {function}      	function to call when the action is clicked
 	*/
	processLinkTemplate: function processLinkTemplate(link, item) {
  	var processedLink = link;
  	var pnxProperties = link.match(/\{(pnx\..*?)\}/g) || [];
  	pnxProperties.forEach(function (property) {
    	var value = property.replace(/[{}]/g, '').split('.').reduce(function (o, i) {
      	try {
        	var h = /(.*)(\[\d\])/.exec(i);
        	if (h instanceof Array) {
          	return o[h[1]][h[2].replace(/[^\d]/g, '')];
        	}
        	return o[i];
      	} catch (e) {
        	return '';
      	}
    	}, item);
    	// EDITED CODE: called encodeURIComponent on value to ensure that pnx properties are URL-friendly
    	processedLink = processedLink.replace(property, encodeURIComponent(value));
  	});
      
      // Add url
	// CUSTOM CODE: Replaces the string '{url}' contained in the link with the current url of the user's browser; used to get the url of the user's web browser when an error is reported for more specific details
      processedLink = processedLink.replace("{url}", encodeURIComponent(document.URL));
      
  	return function () {
    	return window.open(processedLink, '_blank');
  	};
	}
  };
});

/** END of Add a Custom "Report a Problem" button to the "Send To" Action with LibWizard Service */
 
/** Custom record action - Report a Problem TEMPLATE
 * Paste after var app = ... line in custom.js. 
 * Edit the link URL for your LibWizard Service (or other service).
 * Edit the label as desired.
 */
 
app.component('prmActionListAfter', {

  /**
   * template:
   *	name: 	The internal name of the component; not visible to front-end users
   *	label:	The text displayed underneath the icon
   *	index:	The 1-dimensional location of the icon in the list of record actions (under [Send to] or the 3-dot options menu)
   *	icon: 	The name of the icon displayed; the string is in the format 'ic_<icon name>_24px'; icons and their names can be found here: https://fonts.google.com/icons?selected=Material+Icons
   *	icon-set: (**no need to change this**) The set of icons where the current icon is retrieved from
   *	link: 	The destination of the custom action button when it is clicked. (handled in the function processLinkTemplate)
   *   
   */  
    
  template: `
	<custom-action  name="report_bug"
            	label="Report a Problem"
            	index=0
            	icon="ic_report_problem_24px"
            	icon-set="action"
            	link="https://docs.google.com/forms/d/e/1FAIpQLSexYjkk6TytYBmQ295Ym1RasBZmBXKDaE9BLarS4uaxpX-1rQ/viewform?usp=pp_url&entry.95225430={pnx.display.title[0]}&entry.86977020={url}"

})

/** END of Custom Report a Problem TEMPLATE */

var app = angular.module('viewCustom', ['angularLoad', 'hathiTrustAvailability', 'customActions']);

/* Primo VE HathiTrust Availability Add-On for CARLI I-Share - 12/15/2020
* adapted from https://github.com/UMNLibraries/primo-explore-hathitrust-availability
*
* NOTE: Be sure to add 'hathiTrustAvailability' to the
*       angular.module() function at the top of the custom.js file,
*       i.e., add it to the array that also includes 'angularLoad', e.g.:
*
* var app = angular.module('viewCustom', ['angularLoad', 'hathiTrustAvailability']);
*
* There are several optional configuration choices you can set for the app.component "template":
*
* Customizing the Availability Message - The default availability message that displays in the Brief 
* Results list and the Full Record page is "Full Text Available at HathiTrust". You can override 
* this by setting the msg attribute:
* 
* <hathi-trust-availability msg="Set this text to your preferred message"></hathi-trust-availability>
* 
* Selectively Suppress Full-text Links - By default, the component will display full-text links 
* for any resource.
* 
* --If you want it avoid looking for full-text availability on records for which you already have online 
* access, add the hide-online attribute to the component:
* 
* <hathi-trust-availability hide-online="true"></hathi-trust-availability>
* 
* --You can also suppress full-text links for journals, if desired, with hide-if-journal option:
* 
* <hathi-trust-availability hide-if-journal="true"></hathi-trust-availability>
* 
* Copyright Status - By default, the component will display only when the item is out of copyright 
* and therefore should be accessible.
* 
* --If you want to display full-text links to any HathiTrust record, regardless of copyright status, 
* use the ignore-copyright attribute:
* 
* <hathi-trust-availability ignore-copyright="true"></hathi-trust-availability>
* 
* --If your institution is a HathiTrust partner institution and you want the availability links 
* in Primo VE to use HathiTrust's automatic login process, add your SAML IdP's entity ID:
* 
* <hathi-trust-availability entity-id="https://shibboleth.inst.edu/idp/shibboleth"></hathi-trust-availability>
*
* E.g.,
* app.component('prmSearchResultAvailabilityLineAfter', {
*   template: '<hathi-trust-availability hide-online="true" msg="Set this text to your preferred message"></hathi-trust-availability>'
* });
*
*/

app.component('prmSearchResultAvailabilityLineAfter', {
  template: '<hathi-trust-availability></hathi-trust-availability>'
});

angular.module('hathiTrustAvailability', []).constant('hathiTrustBaseUrl', 'https://catalog.hathitrust.org/api/volumes/brief/json/').config(['$sceDelegateProvider', 'hathiTrustBaseUrl', function ($sceDelegateProvider, hathiTrustBaseUrl) {
  var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
  urlWhitelist.push(hathiTrustBaseUrl + '**');
  $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
}]).factory('hathiTrust', ['$http', '$q', 'hathiTrustBaseUrl', function ($http, $q, hathiTrustBaseUrl) {
  var svc = {};

  var lookup = function lookup(ids) {
    if (ids.length) {
      var hathiTrustLookupUrl = hathiTrustBaseUrl + ids.join('|');
      return $http.jsonp(hathiTrustLookupUrl, {
        cache: true,
        jsonpCallbackParam: 'callback'
      }).then(function (resp) {
        return resp.data;
      });
    } else {
      return $q.resolve(null);
    }
  };

  // find a HT record URL for a given list of identifiers (regardless of copyright status)
  svc.findRecord = function (ids) {
    return lookup(ids).then(function (bibData) {
      for (var i = 0; i < ids.length; i++) {
        var recordId = Object.keys(bibData[ids[i]].records)[0];
        if (recordId) {
          return $q.resolve(bibData[ids[i]].records[recordId].recordURL);
        }
      }
      return $q.resolve(null);
    }).catch(function (e) {
      console.error(e);
    });
  };

  // find a public-domain HT record URL for a given list of identifiers
  svc.findFullViewRecord = function (ids) {
    var handleResponse = function handleResponse(bibData) {
      var fullTextUrl = null;
      for (var i = 0; !fullTextUrl && i < ids.length; i++) {
        var result = bibData[ids[i]];
        for (var j = 0; j < result.items.length; j++) {
          var item = result.items[j];
          if (item.usRightsString.toLowerCase() === 'full view') {
            fullTextUrl = result.records[item.fromRecord].recordURL;
            break;
          }
        }
      }
      return $q.resolve(fullTextUrl);
    };
    return lookup(ids).then(handleResponse).catch(function (e) {
      console.error(e);
    });
  };

  return svc;
}]).controller('hathiTrustAvailabilityController', ['hathiTrust', function (hathiTrust) {
  var self = this;

  self.$onInit = function () {
    if (!self.msg) self.msg = 'Full Text Available at HathiTrust';

    // prevent appearance/request iff 'hide-online'
    if (self.hideOnline && isOnline()) {
      return;
    }

    // prevent appearance/request iff 'hide-if-journal'
    if (self.hideIfJournal && isJournal()) {
      return;
    }

    // look for full text at HathiTrust
    updateHathiTrustAvailability();
  };

  var isJournal = function isJournal() {
    var format = self.prmSearchResultAvailabilityLine.result.pnx.addata.format[0];
    return !(format.toLowerCase().indexOf('journal') == -1); // format.includes("Journal")
  };

  var isOnline = function isOnline() {
    var delivery = self.prmSearchResultAvailabilityLine.result.delivery || [];
    if (!delivery.GetIt1) return delivery.deliveryCategory.indexOf('Alma-E') !== -1;
    return self.prmSearchResultAvailabilityLine.result.delivery.GetIt1.some(function (g) {
      return g.links.some(function (l) {
        return l.isLinktoOnline;
      });
    });
  };

  var formatLink = function formatLink(link) {
    return self.entityId ? link + '?signon=swle:' + self.entityId : link;
  };

  var isOclcNum = function isOclcNum(value) {
    return value.match(/^(\(ocolc\))\d+$/i);
  };

  var updateHathiTrustAvailability = function updateHathiTrustAvailability() {
    var hathiTrustIds = (self.prmSearchResultAvailabilityLine.result.pnx.addata.oclcid || []).filter(isOclcNum).map(function (id) {
      return 'oclc:' + id.toLowerCase().replace('(ocolc)', '');
    });
    hathiTrust[self.ignoreCopyright ? 'findRecord' : 'findFullViewRecord'](hathiTrustIds).then(function (res) {
      if (res) self.fullTextLink = formatLink(res);
    });
  };
}]).component('hathiTrustAvailability', {
  require: {
    prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
  },
  bindings: {
    entityId: '@',
    ignoreCopyright: '<',
    hideIfJournal: '<',
    hideOnline: '<',
    msg: '@?'
  },
  controller: 'hathiTrustAvailabilityController',
  template: '<span ng-if="$ctrl.fullTextLink" class="umnHathiTrustLink">\
                <md-icon alt="HathiTrust Logo">\
                  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">  <image id="image0" width="16" height="16" x="0" y="0"\
                  xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN\
                  AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACNFBMVEXuegXvegTsewTveArw\
                  eQjuegftegfweQXsegXweQbtegnsegvxeQbvegbuegbvegbveQbtegfuegbvegXveQbvegbsfAzt\
                  plfnsmfpq1/wplPuegXvqFrrq1znr2Ptok/sewvueQfuegbtegbrgRfxyJPlsXDmlTznnk/rn03q\
                  pVnomkjnlkDnsGnvwobsfhPveQXteQrutHDqpF3qnUnpjS/prmDweQXsewjvrWHsjy7pnkvqqGDv\
                  t3PregvqhB3uuXjusmzpp13qlz3pfxTskC3uegjsjyvogBfpmkHpqF/us2rttXLrgRjrgBjttXDo\
                  gx/vtGznjzPtfhHqjCfuewfrjCnwfxLpjC7wtnDogBvssmjpfhLtegjtnEjrtnTmjC/utGrsew7s\
                  o0zpghnohB/roUrrfRHtsmnlkTbrvH3tnEXtegXvegTveQfqhyHvuXjrrGTpewrsrmXqfRHogRjt\
                  q2Dqewvqql/wu3vqhyDueQnwegXuegfweQPtegntnUvnt3fvxI7tfhTrfA/vzJvmtXLunEbtegrw\
                  egTregzskjbsxI/ouoPsqFzniyrz2K3vyZnokDLpewvtnkv30J/w17XsvYXjgBbohR7nplnso1L0\
                  1Kf40Z/um0LvegXngBnsy5juyJXvsGftrGTnhB/opVHoew7qhB7rzJnnmErkkz3splbqlT3smT3t\
                  tXPqqV7pjzHvunjrfQ7vewPsfA7uoU3uqlruoEzsfQ/vegf///9WgM4fAAAAFHRSTlOLi4uLi4uL\
                  i4uLi4uLi4tRUVFRUYI6/KEAAAABYktHRLvUtndMAAAAB3RJTUUH4AkNDgYNB5/9vwAAAQpJREFU\
                  GNNjYGBkYmZhZWNn5ODk4ubh5WMQERUTl5CUEpWWkZWTV1BUYlBWUVVT19BUUtbS1tHV0zdgMDQy\
                  NjE1MzRXsrC0sraxtWOwd3B0cnZxlXZz9/D08vbxZfDzDwgMCg4JdQsLj4iMio5hiI2LT0hMSk5J\
                  TUvPyMzKzmHIzcsvKCwqLiktK6+orKquYZCuratvaGxqbmlta+8QNRBl6JQ26Oru6e3rnzBx0uQ8\
                  aVGGvJopU6dNn1E8c9bsOXPniYoySM+PXbBw0eIlS5fl1C+PFRFlEBUVXbFy1eo1a9fliQDZYIHY\
                  9fEbNm7avEUUJiC6ddv2HTt3mSuBBfhBQEBQSEgYzOIHAHtfTe/vX0uvAAAAJXRFWHRkYXRlOmNy\
                  ZWF0ZQAyMDE2LTA5LTEzVDE0OjA2OjEzLTA1OjAwNMgVqAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAx\
                  Ni0wOS0xM1QxNDowNjoxMy0wNTowMEWVrRQAAAAASUVORK5CYII=" />\
                  </svg> \
                </md-icon>\
                <a target="_blank" ng-href="{{$ctrl.fullTextLink}}">\
                {{ ::$ctrl.msg }}\
                  <prm-icon external-link="" icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\
                </a>\
              </span>'
});

/* END HathiTrust Availability add-on */ 



"use strict";
'use strict';
/*----------below is the code for LibCalHours-----------*/

var jq = document.createElement("script");
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
document.getElementsByTagName("head")[0].appendChild(jq);
jq.onload = function() {
  $(document).ready( function() {
    setTimeout( function() {
      $.getScript("INSERT URL WHERE EXTERNAL SCRIPT IS STORED");
    },1000);
  });
};

/*---------------LibCalHours code ends here---------------*/
"use strict";
'use strict';

/*----------below is the code for LibraryH3lp-----------*/
var needsJs = document.createElement('div');
needsJs.setAttribute('class', 'needs-js');
var closeChatButton = document.createElement('button');
closeChatButton.innerHTML = '☓';
closeChatButton.setAttribute('style', 'border: 0 none; background: #c10230; font-size: 16px; position: absolute; padding: 5px; right: -15px; top: -10px; border-radius: 50%; width: 30px; font-weight: bold;');
var chatFrameWrap = document.createElement('div');
chatFrameWrap.setAttribute('id', 'chat-frame-wrap');
chatFrameWrap.setAttribute('style', 'display: none; width: 300px; background-color: #c10230; padding: 0; box-shadow: -5px -5px 20px 5px rgba(0, 0, 0, 0.3); position: fixed; bottom: 40px; right: 10px; border: 0 none; z-index: 200;');
chatFrameWrap.appendChild(closeChatButton);
chatFrameWrap.appendChild(needsJs);
svar chatButton = document.createElement('button');
chatButton.innerHTML = 'Cardinal Chat';
chatButton.setAttribute('style', 'background: #c10230; color: #ffffff; padding: 10px 10px 8px; font-size: 14px; border-radius: 3px 3px 0 0; position: fixed; bottom: 5px; right: 10px; border: 0 none; z-index: 200; box-shadow: none; font-weight: 400; text-align: center; display: inline-block; text-decoration: none;');

var showChat = false;
function toggleChat() {
  chatFrameWrap.style.display = showChat ? 'none' : 'block';
  showChat = !showChat;
}
closeChatButton.addEventListener('click', toggleChat);
closeChatButton.addEventListener('touchend', toggleChat);
chatButton.addEventListener('click', toggleChat);
chatButton.addEventListener('touchend', toggleChat);

var chatWidget = document.createElement('aside');
chatWidget.setAttribute('tabindex', '-1');
chatWidget.setAttribute('style', 'display: block;');
chatWidget.appendChild(chatButton);
chatWidget.appendChild(chatFrameWrap);
document.body.appendChild(chatWidget);

var s = document.createElement('script');
s.id = 'localScript';
s.src = 'https://libraryh3lp.com/js/libraryh3lp.js?18922';
document.body.appendChild(s);

/*---------------LibraryH3lp code ends here---------------*/

"use strict";
/* Collapse "Get It From Other Institutions" dropdown by default in full record display. */
app.component("prmAlmaOtherMembersAfter", {
  bindings: {
    parentCtrl: "<",
  },
  controller: [
    function() {
      var ctrl = this;
 
      this.$onInit = function(){
        {
          ctrl.parentCtrl.isCollapsed = true;
        }
      };
    },
  ],
});

'use strict';

"use strict";
'use strict';

"use strict";
'use strict';

"use strict";
'use strict';

"use strict";
'use strict';

"use strict";
'use strict';
})();