(function(){
    var self = this;
    
    console.log("PLACEHOLDER!");
    var ns = window['LettPlaceholderObject'];
    
    var o = window[ns];
    
    
    var account;
    o.q.forEach(function(cmd){
        cmd = Array.prototype.slice.call(cmd);
        
        var fn = cmd.splice(0,1);
        Ph[fn].apply(Ph, cmd);
    });
    
    var Ph = {
        setAccount : function(str){
            console.log('setAccount');
            console.log(str)
            account = str;
        },
        showProduct : function(id, ver, container){
            console.log('showProduct');
            console.log(id, ver, container);
        },
    };
    
})();
