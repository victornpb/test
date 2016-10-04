/**
 * [description]
 * @return {TYPE}     ___________
 *
 * @author Victor N. wwww.victorborges.com
 * @date   2016-10-03
 */
(function(){

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
	 * @param {String} trigger	Trigger to fire action eg:load,click,mouseover,etc;
	 * @param {Function} action	A pointer to a function to be called on trigger;
	 */
	function addEvent(element, trigger, action){
		if(typeof element==="string"){element=document.getElementById(element);}
		if(element.addEventListener){
			element.addEventListener(trigger,action,false);
			return true;
		}
		else if(element.attachEvent){
			element['e'+trigger+action] = action;
			element[trigger+action] = function() { element['e'+trigger+action](window.event); };
			var r = element.attachEvent('on'+trigger, element[trigger+action]);
			return r;
		}
		else{
			element['on'+trigger] = action;
			return true;
		}
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

	function sendMsg(key, value){
		console.log("sending message to host", key, value);
		window.parent.postMessage({
			key: key,
			value: value
		}, '*');
	}

	domReady(function(){

		console.log('FRAME.JS');
		return;


		setTimeout(function(){
			var height = document.body.scrollHeight
			sendMsg('height', height);

		}, 0);

		addEvent(window, 'resize', function(e){

			//TODO: implement fucking debouncing
			// console.log(e);
			var height = document.body.scrollHeight
			sendMsg('height', height);

		});


	});
})();
