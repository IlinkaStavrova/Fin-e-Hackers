(function (window, undefined) {

    function Gauge(foreground, background, padding) {
        this.initialize(foreground, background, padding);
    }

    Gauge.prototype = new Sprite();
    Gauge.prototype.spriteInitialize = Gauge.prototype.initialize;

    Gauge.prototype.initialize = function (foreground, background, padding) {

        foreground = foreground ? foreground : 'bar-foreground';
        background = background ? background : 'bar-background';

        this.spriteInitialize(null); // your image name

        this.padding = padding === undefined ? 0 : padding;

        this.percentage = 0;

        this.toPercentage = 1;
        this.isAnimating = false;

        this.background = new Sprite(background);
        this.addChild(this.background);
        this.setSensorSize(this.background.width, this.background.height);

        this.foreground = new Sprite(foreground);
        this.foreground.position.set(this.padding, this.padding);
        this.addChild(this.foreground);
      
        this.totalWidth = 0;
       


        var mask = new PIXI.Graphics();
        this.maskPadding = this.padding;
        this.speed = -0.05;
        this.maskWidth = this._width - this.maskPadding * 2;
        this.maskHeight = this._height;
        this.foreground.mask = mask;
        this.foreground.addChild(mask);


        this.timeout = 0;
        this.duration = 600; // the speed at which the bar is animating changes

        this.xScale = 1;
        this.yScale = 1;

        this.isAutoHiding = false;
        // this.set_alpha(0);

        this.looper = new Looper([
            {name: 'fade_in', duration: 100},
            {name: 'still', duration: 800},
            {name: 'fade_out', duration: 200},
            {name: 'end', duration: 100}
        ], true);

        this.looper.isFinished = true; // to prevent it from running

    };

    Gauge.prototype.setBarScale = function (x, y) {
        this.xScale = x;
        this.yScale = y;

        this.scale.x = x;
        this.scale.y = y;
    };

    Gauge.prototype.setPercent = function (percent, animated) {

        this.isAnimating = animated === undefined ? true : false;

        if (!this.isAnimating) {
            this.percentage = percent;
            this.drawMask(percent);
        } else {
            this.toPercentage = percent;
        }

        this.timeout = this.duration;

        if (this.isAutoHiding) {
            this.looper.restart();
        }

    };

    Gauge.prototype.update = function (dt) {


        if (this.isAnimating && this.timeout > 0) {

            this.timeout -= dt;

            var p = (this.duration - this.timeout) / this.duration;
            var d = this.toPercentage - this.percentage;

            this.drawMask(this.percentage + d * p);

            if (this.timeout <= 0) {
                this.isAnimating = false;
                this.percentage = this.toPercentage;
            }
        }

    };

    Gauge.prototype.drawMask = function (percent) {
        var mask = this.foreground.mask;

        this.percentage = Math.clamp(percent, 0, 1);

        if (mask) {
            mask.clear();
            mask.beginFill(0xffffff, 1);
            mask.drawRect(0, 0, this.maskWidth * this.percentage, this.maskHeight);
            mask.endFill();
        }
    };

    window.Gauge = Gauge;

}(window));