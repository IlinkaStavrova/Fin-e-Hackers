(function (window, undefined) {

    function Institution(name) {
        this.initialize();
    }

    Institution.prototype = new Sprite();
    Institution.prototype.spriteInitialize = Institution.prototype.initialize;
    Institution.prototype.initialize = function () {

        this.spriteInitialize();



        this.building = new Sprite();
        this.building.centered();
        this.addChild(this.building);

        this.delegate = null;

        this.optionsPanel = null;

        this.back = new Sprite('white');
        this.back.width = 70;
        this.back.height = 40;
        this.back.tint = 0x333333;
        this.back.anchor.set(0, 0.5);
        this.addChild(this.back);

        this.moneyLabel = new Label();
        this.moneyLabel.anchor.set(0, 0.5);
        this.moneyLabel.style.fontSize = 30;
        this.moneyLabel.style.fontFamily = 'Impact';
        this.moneyLabel.style.fill = "#ffffff";

        this.addChild(this.moneyLabel);
        this.moneyLabel.position.set(50, 80);
        this.back.position.set(40, 80);

        this.isBlinking = false;

        this.money = 300;

        this.outcomeRate = 20;

    };

    Institution.prototype.blink = function () {
        
        if(!this.isBlinking){
              if (this.delegate && this.delegate.onInstitutionProtest) {
                this.delegate.onInstitutionProtest(this, true);
            }
        }

        if (this.isBlinking && (this.building.alpha === 1 || this.building.alpha === 0.5) || !this.isBlinking) {
            this.building.blendMode = PIXI.BLEND_MODES.ADD;

            var alpha = (this.building.alpha === 1) ? 0.5 : 1;
            var that = this;
            new TweenAlpha(this.building, alpha, null, 100, function () {
                that.blink(true);
            }).run(this.id + 'blink');

            this.isBlinking = true;

          

        }


    };

    Institution.prototype.stopBlink = function () {
        this.building.blendMode = PIXI.BLEND_MODES.NORMAL;
        Actions.stopByTag(this.id + 'blink');
        this.building.alpha = 1;

        this.isBlinking = false;

        if (this.delegate && this.delegate.onInstitutionProtest) {
            this.delegate.onInstitutionProtest(this, false);
        }
    };

    Institution.prototype.onMouseUp = function (event, sender) {
        if (this.optionsPanel) {
            if (this.optionsPanel.visible) {
                this.optionsPanel.hide();
            } else {
                this.optionsPanel.show();
            }

        }
    };

    Institution.prototype.setPanel = function (panel) {
        this.optionsPanel = panel;
        this.addChild(panel);
        panel.position.set(-200, -50);
    };

    Institution.prototype.update = function (dt) {
        this.moneyLabel.txt = Math.round(this.money) + '';
    };

    Institution.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        this.building.setTexture(data.imageName);
        // var sensor = new SAT.Box(new V(),this.building.width,this.building.height).toPolygon();
        this.setSensorSize(this.building.width, this.building.height);
        // this.setCustomSensor(sensor);
    };

    Institution.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.Institution = Institution;

}(window));