(function (window, undefined) {

    function Coin(pool) {
        this.initialize(pool);
    }

    Coin.prototype = new Sprite();
    Coin.prototype.spriteInitialize = Coin.prototype.initialize;
    Coin.prototype.initialize = function (pool) {

        this.spriteInitialize('coin');

        this.pool = pool;
        this.isFree = true;

        this.centered();
        this.scale.set(0.45);

        this.velocity = new V();
        this.duration = 2000;
        this.time = 0;

        this.gravity = new V(0, 0.002);
        this.direction = new V(1, 1);

        this.direction.setAngle(Math.degreesToRadians(Math.randomInt(0, 360)));

        this.points = [];
        
        
        

        this.resetValues();

    };
    
    Coin.prototype.calculateRoad = function (points) {
        this.points = points;
        
        this.move();
        
    };
    
    Coin.prototype.move = function () {
        
        if(this.points.length > 1){
            var to = this.points[1];
            var that = this;
            this.points.removeElement(to);
            new TweenMoveTo(this,new V().copy(to),null,1500,function(){
                that.move();
            }).run();
        } else {
            this.reset();
            this.removeFromParent();            
        }
        
    };
    
    Coin.prototype.resetValues = function () {
        
        this.tag = null;
        this.visible = true;

//        this.rotation = Math.random() * 360;

    };

    Coin.prototype.reset = function () {
        this.isFree = true;
        this.pool.add(this);

        this.resetValues();

    };

    Coin.prototype.update = function (dt) {

        

    };

    Coin.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
    };

    Coin.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.Coin = Coin;

}(window));