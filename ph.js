(function(fn){var d=document;(d.readyState=='loading')?d.addEventListener('DOMContentLoaded',fn):fn();})(function(){ //ready IE9



var self = this;
    
    console.log("PLACEHOLDER!");
    
    var Ph = {
        setAccount : function(str){
            console.log('setAccount');
            
            str = str.match(/PH\-(\d{0,11})\-(\d)/);
            console.log(str);
            account = str;
            
            
        },
        showProduct : function(id, ver, container){
            console.log('showProduct');
            console.log(id, ver, container);
            
            var ifr = document.createElement('iframe');
            ifr.src = 'https://victornpb.github.io/test/'+account[1]+'/'+id;
            ifr.width = "100%";
            
            var c = document.querySelector(container);
            if(c) c.appendChild(ifr);
            else console.log('c is null');
            
            c.onload = function(){
                c.height = c.contentWindow.document.body.scrollHeight;
            
            }
        },
    };
    
    
    
    var ns = window['LettPlaceholderObject'];
    var o = window[ns];
    
    var account;
    
    o.q.forEach(function(cmd){
        cmd = Array.prototype.slice.call(cmd);
        
        var fn = cmd.splice(0,1);
        Ph[fn].apply(Ph, cmd);
    });
   

});
