(function (window, undefined) {

    function Protest() {
        this.initialize();
    }

    Protest.prototype = new Sprite();
    Protest.prototype.spriteInitialize = Protest.prototype.initialize;
    Protest.prototype.initialize = function () {

        this.spriteInitialize(null);

        var textures = [PIXI.utils.TextureCache['protest1'], PIXI.utils.TextureCache['protest2']];
        this.anim = new PIXI.extras.AnimatedSprite(textures);
        this.addChild(this.anim);
        
        this.anim.loop = true;
        this.anim.animationSpeed = 0.005;
        
        this.anim.play();
        
        this.scale.set(1.9);

    };

    Protest.prototype.update = function (dt) {

    };

    Protest.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
    };

    Protest.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.Protest = Protest;

}(window));