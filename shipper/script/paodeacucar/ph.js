/**
* [PlaceHub description]
*
* @author Victor N. wwww.victorborges.com
* @date   2016-10-03
*/

//**************************** Polyfills *************************************//

	//console polyfill for IE
	window.console = window.console || {
		error: function () {},
		warn: function () {},
		info: function () {},
		log: function () {},
		debug: function () {}
	};


	/**
	 * Add a event to a element;
	 * @param {Object} element	Element or ID;
	 * @param {String} event	Trigger to fire fn eg:load,click,mouseover,etc;
	 * @param {Function} fn	A pointer to a function to be called on event;
	 */
	function addEvent(element, event, fn){
		if(typeof element==="string"){ element=document.getElementById(element); }
		if(element.addEventListener){
			element.addEventListener(event,fn,false);
			return true;
		}
		else if(element.attachEvent){
			element['e'+event+fn] = fn;
			element[event+fn] = function() { element['e'+event+fn](window.event); };
			var r = element.attachEvent('on'+event, element[event+fn]);
			return r;
		}
		else{
			element['on'+event] = fn;
			return true;
		}
	}

	/**
	 * Cross browser implementation for Ajax Get
	 * @param  {String}     url        Remote url
	 * @param  {String}     parameters Parameters sent using get
	 * @param  {Function} callback   Callback called when request is received
	 *
	 * @author Victor N. wwww.victorborges.com
	 * @date   2016-10-04
	 */
	function ajax(url, parameters, callback){
		var Ajax = (function(){
			try{ return new XMLHttpRequest(); }
			catch(e){ try { return new ActiveXObject("Msxml2.XMLHTTP"); }
			catch(e){ try { return new ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e){ return null; }}}
		})();
		if(Ajax){
			Ajax.onreadystatechange=function(){
				if(Ajax.readyState===4){
	                callback(Ajax.response);
	            }
			};
			Ajax.open('GET', url, true);
			Ajax.send(parameters);
		}else{
			callback(null);
		}
	}


	/**
	 * trim strings polyfill (IE6)
	 * @param  {String}     str A string will trailling spaces
	 * @return {String}         Trimmed string
	 *
	 * @author Victor N. wwww.victorborges.com
	 * @date   2016-10-04
	 */
	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}


	/**
	 * parse JSON String crossbrowser IE6
	 * @param  {String}     data A string containing a valid JSON
	 * @return {Object}          Object
	 *
	 * @author Victor N. wwww.victorborges.com
	 * @date   2016-10-04
	 */
	function parseJSON( data ) {
	    if ( typeof data !== "string" || !data ) {
	        return null;
	    }

		var rvalidchars = /^[\],:{}\s]*$/;
		var	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
		var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
		var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;

	    // Make sure leading/trailing whitespace is removed (IE can't handle it)
	    data = trim(data);

	    // Attempt to parse using the native JSON parser first
	    if ( window.JSON && window.JSON.parse ) {
	        return window.JSON.parse( data );
	    }

	    // Make sure the incoming data is actual JSON
	    // Logic borrowed from http://json.org/json2.js
	    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
	        .replace( rvalidtokens, "]" )
	        .replace( rvalidbraces, "")) ) {

	        return ( new Function( "return " + data ) )();
	    }
	    console.error( "Invalid JSON: " + data );
	}


	/**
	 * domReady for IE6+
	 * @param  {Function} callback Callback
	 *
	 * @author http://beeker.io/jquery-document-ready-equivalent-vanilla-javascript
	 * @date   2016-10-04
	 */
	var domReady = function(callback) {
	    var ready = false;

	    var detach = function() {
	        if(document.addEventListener) {
	            document.removeEventListener("DOMContentLoaded", completed);
	            window.removeEventListener("load", completed);
	        } else {
	            document.detachEvent("onreadystatechange", completed);
	            window.detachEvent("onload", completed);
	        }
	    }
	    var completed = function() {
	        if(!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
	            ready = true;
	            detach();
	            callback();
	        }
	    };

	    if(document.readyState === "complete") {
	        callback();
	    } else if(document.addEventListener) {
	        document.addEventListener("DOMContentLoaded", completed);
	        window.addEventListener("load", completed);
	    } else {
	        document.attachEvent("onreadystatechange", completed);
	        window.attachEvent("onload", completed);

	        var top = false;

	        try {
	            top = window.frameElement == null && document.documentElement;
	        } catch(e) {}

	        if(top && top.doScroll) {
	            (function scrollCheck() {
	                if(ready) return;

	                try {
	                    top.doScroll("left");
	                } catch(e) {
	                    return setTimeout(scrollCheck, 50);
	                }

	                ready = true;
	                detach();
	                callback();
	            })();
	        }
	    }
	};



//********************************** Script **********************************//


/**
 * [luhn description]
 * @type {Object
 */
luhn = {
	calculate : function(string){

		var i, sum=0, delta=[0,1,2,3,4,-4,-3,-2,-1,0],
		deltaIndex, deltaValue;

		for (i=0; i<string.length; i++ ){
			sum += parseInt(string.substring(i,i+1), 10);
		}

		for (i=string.length-1; i>=0; i-=2){
			sum += delta[parseInt(string.substring(i,i+1), 10)];
		}

		if (10-(sum%10)===10){ return 0; }
		return 10-(sum%10);
	},

	validate : function(number, digit){
		return (luhn.calculate(number) === parseInt(digit, 10));
	}
};




domReady(function() {

    var self = this;
    console.log("PH.JS!");

	var CDN_URL = "https://victornpb.github.io/test/shipper/";
	var CONTENT_ROOT_PATH = "content/{ACCOUNT}/{CONTENT-ID}/iframe/";
	var META_PATH = "meta.json";
	var SHEET_PATH = "index.html";


    var account = {
		id: 'PH-XXXXXXXXXX-X',
		number: 0,
		digit: 0,
		valid: false,
	};


    var Ph = {
        setAccount: function(id) {
            console.log('setAccount');

			// account.id = id;
			//
            // //parse account ID
            // var parsedId = id.match(/PH\-(\d{1,16})\-(\d)/);
			//
			// if(id){
			// 	account.number = parsedId[1] || null;
			// 	account.digit = parsedId[2] || null;
			// }
			//
			// if(parsedId && luhn.validate(account.number, account.digit)){
			// 	console.log("Valid Account entered!");
			// 	account.valid = true;
			// }
			// else{
			// 	console.error("Invalid Account", account);
			// }

			account = id;
        },

        showContent: function(contentId, version, containerId) {
            console.log('showProduct');
            console.log(contentId, version, containerId);

			var container = document.getElementById(containerId);
			if(!account) {
				container.innerHTML = "Invalid AccountID! ("+account+")";
				return;
			}

			//build content url
        	CONTENT_ROOT_PATH = CONTENT_ROOT_PATH.replace('{ACCOUNT}', account);
    		CONTENT_ROOT_PATH = CONTENT_ROOT_PATH.replace('{CONTENT-ID}', contentId);

			var iframe;
			if(container){

	            iframe = document.createElement('iframe');
				iframe.width = "100%";
				iframe.height = "100%";

				iframe.onload = function() {
					//origin violation
					//console.log(ifr.contentWindow.document.body.scrollHeight);
					//ifr.height = ifr.contentWindow.document.body.scrollHeight;
				};

				//request meta.json
				requestPageMeta(CDN_URL+CONTENT_ROOT_PATH+META_PATH, function(r){
					if(r){
						iframe.height = r.size[0][1];  //TODO: implement breakpoints
					}
					else{
						console.error('Invalid response.', r);
					}
				});

				//enable communication with iframe
				addEvent(window, 'message', receiveMessage, false);
				function receiveMessage(e){
					var data = e.data;
					if(data && typeof data === "object"){

						//TODO: implement message origin handling.
						//if (e.origin === 'http://sendingdomain.com') {

						if(data.key === 'height'){

							console.log("height received", data);
							iframe.height = data.value;
						}

					}
				}

				//set iframe source
				iframe.src = CDN_URL+CONTENT_ROOT_PATH+SHEET_PATH;

				//append iframe to document
				container.appendChild(iframe);  //TODO: check IE support
			}
			else{
				console.error('conteinerID not found!');
			}
        },
    };

	function requestPageMeta(url, cb){
		ajax(url, null, function(response){
			var r;
			try{
				r = parseJSON(response);
				console.log(r);
			}
			catch(err){
				console.error('Could not parse response to JSON', err, response);
				r = null;
			}
			cb(r);
		});
	}


    var ns = window['LettPlaceholderObject'];
    var o = window[ns];

	//execute queue
	for(var cmd, i = 0; i<o.q.length; i++){
		cmd = o.q[i];
		cmd = Array.prototype.slice.call(cmd);  //transform arguments in array TODO: check IE

		var method = cmd[0]; //get method name
		var args = cmd.slice(1);
		if(typeof Ph[method]==='function'){
			Ph[method].apply(Ph, args); //execute method name with parameters
		}
		else{
			console.error("Invalid method!", method);
		}
	}

});
