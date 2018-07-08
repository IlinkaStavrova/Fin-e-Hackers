(function (window, undefined) {


    function Pool(className,size) {
        this.initialize(className,size);
    }
    
    Pool.prototype.initialize = function (className,size) {
        this.items = [];
        this.className = className;
        
        if(size){
            for (var i = 0; i < size; i++) {
                this.items.push(new window[this.className](this));
            }
        }
    };
    
    Pool.prototype.add = function(item){
        item.isFree = true;
        this.items.push(item);
    };
    
    Pool.prototype.getItem = function(){
        
        var item = this.items.pop();
        if(!item){
            item = new window[this.className](this);
        }
        item.isFree = false;
        return item;
        
    };
    
    Pool.prototype.getItems = function(n){
        var items = [];
        for (var i = 0; i < n; i++) {
            items.push(this.getItem());
        }        
        return items;
    };

    window.Pool = Pool;

}(window));