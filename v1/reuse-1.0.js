/*!
 * reuse-js
 * Copyright (c) 2025 Kousaten LLC. All rights reserved.
 * This file is proprietary and confidential. Unauthorized copying, modification,
 * distribution, or use of this file, via any medium, is strictly prohibited.
 */

const Reuse = {
	Constants: {
		EMAIL_REGEXP: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
	}
};

const DOM = {
	id: function(id) {
		if(!id) {
			throw "argument needed";
		}
		var node = document.getElementById(id);
		if(!node) {
			throw "element with id '"+id+"' not found";
		}
		return node;
	},

	ready: function(handler) {
		if(document.readyState!='loading') {
			// Document already reandered:
			handler();
		}
		else if(document.addEventListener) {
			// Modern browsers:
			document.addEventListener('DOMContentLoaded', handler);
		}
		else {
			// Browser <= IE8:
			document.attachEvent('onreadystatechange', function(){
				if (document.readyState=='complete') callback();
			});
		}
	}
};

const Data = {
	email: function(s) {
		return Reuse.Constants.EMAIL_REGEXP.test(s);
	}
};

// STRING EXTENSIONS:
// Checks that string starts with the specific string.
// Note: not required by Chrome.
if(typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}

// Checks that string ends with the specific string.
// Note: not required by Chrome.
if(typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
        return this.slice(-str.length) == str;
    };
}

// Note: only required by IE8 and below, newer browsers implement trim:
if(typeof String.prototype.trim != 'function') {
    String.prototype.trim = function() {
    	return this.replace(LowLevel.Constants.TRIM_REGEXP, "");
    };
}

if(typeof String.prototype.replaceAll != 'function') {
	String.prototype.replaceAll = function(search, replacement) {
		if(!replacement) {
			replacement = "";
		}
	    return this.split(search).join(replacement);
	};
}

if(typeof String.prototype.removeWhitespace != 'function') {
	String.prototype.removeWhitespace = function() {
		return this.replace(/\s/g, "");
	};
}

// ARRAY EXTENSIONS:
if(!Array.prototype.last) {
	Array.prototype.last = function() {
		if(this.length == 0) {
			return false;
		}
		else {
			return this[this.length - 1];
		}
	};
}

// DATE EXTENSIONS:
if(!Date.prototype.isLeapYear) {
	Date.prototype.isLeapYear = function() {
	    var year = this.getFullYear();
	    if((year & 3) != 0) return false;
	    return ((year % 100) != 0 || (year % 400) == 0);
	};
}
if(!Date.prototype.getDayOfYear) {
	Date.prototype.getDayOfYear = function() {
	    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	    var mn = this.getMonth();
	    var dn = this.getDate();
	    var dayOfYear = dayCount[mn] + dn;
	    if(mn > 1 && this.isLeapYear()) dayOfYear++;
	    return dayOfYear;
	};
}
if(!Date.prototype.getMonthName) {
	Date.prototype.getMonthName = function() {
		return LowLevel.Constants.MONTHS[this.getMonth()];
	};
}
if(!Date.prototype.getWeekdayName) {
	Date.prototype.getWeekdayName = function() {
		return LowLevel.Constants.WEEKDAYS[this.getDay()];
	};
}

// EVENT TRACKING:
const Tracker = {

	_projectId: false,

	init: function(projectId) {
		if(!projectId) {
			throw "parameter required";
		}
		if(this._projectId) {
			throw "Tracker has already been initialized";
		}
		this._projectId = projectId;
		(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
		for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
		mixpanel.init(this._projectId);
	},

	// TODO check that format is correct
	props: function(props) {
		this._props = props;
	},

	track: function(event, props) {
		if(!this._projectId) {
			throw "Tracker has not been initialized";
		}
		var merged = this._props ? this._props : {};
		if(props) {
			merged = {...merged, ...props};
		}
		return mixpanel.track(event, merged);
	}
};
