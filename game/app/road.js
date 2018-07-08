(function (window, undefined) {

    function Road() {
        this.initialize();
    }

    Road.prototype = new Sprite();
    Road.prototype.spriteInitialize = Road.prototype.initialize;
    Road.prototype.initialize = function () {

        this.spriteInitialize(null);
        this.points = [];

        this.spawnTime = 200;

        this.isAnimating = false;

        this.spawnTimer = 0;

        this.poolCoins = new Pool('Coin', 300);

    };

    Road.prototype.startAnimation = function () {
        this.isAnimating = true;

    };

    Road.prototype.stopAnimation = function () {
        this.isAnimating = false;

        var coins = this.findByTag(this.id);
        if (coins) {
            for (var i = 0; i < coins.length; i++) {
                var coin = coins[i];
                coin.visible = false;
            }
        }


    };

    Road.prototype.update = function (dt) {
        this.spawnTimer -= dt;

        if (this.spawnTimer <= 0 && this.isAnimating) {
            this.spawnTimer = this.spawnTime;
            var coin = this.poolCoins.getItem();
            coin.tag = this.id;
            coin.position = this.points[0];
            coin.calculateRoad(this.points.slice());
            this.addChild(coin);
        }
    };

    Road.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
        for (var i = 0; i < data.points.length; i++) {
            var p = new V(data.points[i].x, data.points[i].y);
            this.points.push(p);
        }
    };

    Road.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.Road = Road;

}(window));