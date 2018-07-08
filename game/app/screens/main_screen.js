(function (window, undefined) {

    function MainScreen() {
        this.initialize();
    }

    MainScreen.prototype = new HScreen();
    MainScreen.prototype.screenInitialize = MainScreen.prototype.initialize;

    MainScreen.prototype.initialize = function () {
        this.screenInitialize();

        this.setBackgroundColor('#93ad40');

        this.content = new Layer();
        this.addChild(this.content);
        this.importer = new Importer(this);
        this.importer.importObjects(ContentManager.jsons.main.objects, this.content);
        
        this.default = this.findByName('default');
        this.default.x += 200;

        this.budgetMeter = new Gauge();
        this.budgetMeter.position.set(50, 500);
        this.budgetMeter.rotation = Math.degreesToRadians(-90);
        this.default.addChild(this.budgetMeter);
        
        this.winLayer = this.findById('win');
        this.winLayer.visible = false;
        
        this.moreBtn = this.findById('more-btn');
        this.moreBtn.isTouchable = false;
        this.moreBtn.onMouseUp = this.onMore.bind(this);

        this.balanceTime = 15 * 1000;
        this.balanceTimer = this.balanceTime;
        this.isGameOver = false;

        this.timerLabel = this.findById('timer');

        this.isTaxLock = true;
        this.isBudgetLocked = true;
        this.taxTimer = 1000;

        this.budgetMeter.setPercent(0.5);

        this.govBuilding = this.findById('government');
        this.govBuilding.money = 0;

        this.budgetProjection = 100;

        this.govBuilding.visible = false;

        this.budgetMeter.visible = false;

        this.healthBuilding = this.findById('health');
        this.healthBuilding.delegate = this;
        this.healthBuilding.visible = false;

        this.roads = this.findById('roads');
        this.roads.visible = false;

        this.tutorials = this.findByTag('tutorial');

        for (var i = 0; i < this.tutorials.length; i++) {
            var tut = this.tutorials[i];
            tut.visible = false;
        }

        var tut = this.findById('tutorial1');
        tut.visible = true;
        this.showLayer(tut);

        this.tutCounter = 0;

        this.addTouchable(this);

        var insts = this.findByType(Institution);
        for (var i = 0; i < insts.length; i++) {
            var inst = insts[i];
            this.addTouchable(inst);
        }

        this.freeMarket = this.findById('free-market');
        this.freeMarket.delegate = this;
        this.freeMarket.setPanel(new TaxPanel());
        this.freeMarket.optionsPanel.delegate = this;
        this.freeMarket.optionsPanel.tag = 0;
        this.freeMarket.isTouchable = false;

        this.healthBuilding.setPanel(new TaxPanel());
        this.healthBuilding.optionsPanel.delegate = this;
        this.healthBuilding.optionsPanel.delegate = this;
        this.healthBuilding.optionsPanel.increment = 10;
        this.healthBuilding.optionsPanel.hasPercentage = false;
        this.healthBuilding.optionsPanel.title.txt = "Буџет";
        this.healthBuilding.optionsPanel.tag = 1;
        this.healthBuilding.money = 0;
        this.healthBuilding.isTouchable = false;

        this.budgetLabel = this.findById('budget-label');
        this.budgetLabel.visible = false;

        this.roadFreeMarketTax = this.findById('tax-road');
        this.roadFreeMarketTax.visible = false;
        this.pathFreeMarketTax = this.findById('tax-road-path');

        this.roadHealthIncome = this.findById('health-path');
        this.roadHealthIncome.visible = false;

        this.pathHealthIncome = this.findById('health-tax-path');
        this.pathHealthIncome.spawnTime = 360;

        this.roadHealthOutcome = this.findById('health-outcome-road');
        this.roadHealthOutcome.visible = false;
        this.pathHealthOutcome = this.findById('health-outcome-path');
        this.pathHealthOutcome.spawnTime = 360;


    };

    MainScreen.prototype.onInstitutionProtest = function (institution,isProtesting) {
        log(institution);
        log(isProtesting);
        if(isProtesting){
            this.balanceTimer = this.balanceTime;
            new TweenPop(this.timerLabel,1.1,null,900).run();
        }
    };

    MainScreen.prototype.onTaxUp = function (object) {

        if (object.tag === 0) {

            if (object.tax) {
                //  this.roadFreeMarketTax.visible = true;
                this.pathFreeMarketTax.startAnimation();
              //  this.animateRoadCoins(this.pathFreeMarketTax);

                if (this.isTaxLock) {
                    this.isTaxLock = false;
                    this.freeMarket.optionsPanel.hide();
                    var tutorialOld = this.tutorials[this.tutCounter];
                    if (tutorialOld) {
                        tutorialOld.visible = false;
                    }
                }
            }

            this.isBudgetLocked = false;

        } else if (object.tag === 1) {

            if (object.tax) {

                //  this.roadHealthIncome.visible = true;

                this.pathHealthIncome.startAnimation();
              //  this.animateRoadCoins(this.pathHealthIncome);

                //  this.roadHealthOutcome.visible = true;
                this.pathHealthOutcome.startAnimation();
              //  this.animateRoadCoins(this.pathHealthOutcome);
                this.healthBuilding.stopBlink();
                //this.healthBuilding.protest.visible = false;

            }

        }


    };

    MainScreen.prototype.onTaxDown = function (object) {

        if (object.tag === 0 && object.tax <= 0) {
            this.pathFreeMarketTax.stopAnimation();
            //  this.roadFreeMarketTax.visible = false;
            var tutorialOld = this.tutorials[this.tutCounter];
            if (tutorialOld) {
                tutorialOld.visible = false;
            }



        } else if (object.tag === 1 && object.tax <= 0) {
            this.pathHealthIncome.stopAnimation();
            //  this.roadHealthIncome.visible = false;

            //   this.roadHealthOutcome.visible = false;
            this.pathHealthOutcome.stopAnimation();
            // this.healthBuilding.protest.visible = true;
            this.healthBuilding.blink();
        }

    };

    MainScreen.prototype.update = function (dt) {
        
        if(this.isGameOver){
            return;
        }
        
        if(this.balanceTimer <= 0 && !this.isGameOver){
            this.isGameOver = true;
            this.onGameOver();
        }

        if (!this.isBudgetLocked) {

            this.taxTimer -= dt;
        }
        
        if(!this.freeMarket.isBlinking && !this.healthBuilding.isBlinking){
            if(this.pathFreeMarketTax.isAnimating && this.pathHealthIncome.isAnimating){
                this.balanceTimer -= dt;
                
            }
        }
        
        this.timerLabel.txt = toMMSS(Math.ceil(this.balanceTimer / 1000));

        if (this.taxTimer <= 0) {
            this.taxTimer += 1000;

            // collect tax

            if (this.freeMarket.money < 250) {

                //this.freeMarket.protest.visible = true;
                //  this.roadFreeMarketTax.visible = false;
                this.freeMarket.blink();

                this.pathFreeMarketTax.stopAnimation();

            } else {

                if (this.freeMarket.isBlinking) {
                    this.freeMarket.stopBlink();
                    //  this.freeMarket.protest.visible = false;
                    //   this.roadFreeMarketTax.visible = true;
                    this.pathFreeMarketTax.startAnimation();
                }


            }

            ///////////

            if (!this.freeMarket.isBlinking) {
                var tax = this.freeMarket.money * (this.freeMarket.optionsPanel.tax / 100);
                this.freeMarket.money -= tax;
                this.govBuilding.money += tax;
            }


            this.budgetMeter.setPercent(this.govBuilding.money / this.budgetProjection);



            if (this.healthBuilding.money > this.healthBuilding.outcomeRate) {
                this.freeMarket.money += this.healthBuilding.outcomeRate;
                this.healthBuilding.money -= this.healthBuilding.outcomeRate;


            }

            if (this.healthBuilding.optionsPanel.tax && this.govBuilding.money > this.healthBuilding.optionsPanel.tax) {
                this.govBuilding.money -= this.healthBuilding.optionsPanel.tax;
                this.healthBuilding.money += this.healthBuilding.optionsPanel.tax;

                if (this.healthBuilding.isBlinking) {
                    //  this.roadHealthIncome.visible = true;

                    this.pathHealthIncome.startAnimation();
                  //  this.animateRoadCoins(this.pathHealthIncome);

                    //  this.roadHealthOutcome.visible = true;
                    this.pathHealthOutcome.startAnimation();
                   // this.animateRoadCoins(this.pathHealthOutcome);

                    // this.healthBuilding.protest.visible = false;
                    this.healthBuilding.stopBlink();
                }

            } else if (this.healthBuilding.optionsPanel.tax) {

                this.pathHealthIncome.stopAnimation();
                //   this.roadHealthIncome.visible = false;

                //    this.roadHealthOutcome.visible = false;
                this.pathHealthOutcome.stopAnimation();
                // this.healthBuilding.protest.visible = true;
                this.healthBuilding.blink();

            }





        }

    };

    MainScreen.prototype.onShow = function () {

    };

    MainScreen.prototype.onHide = function () {

    };

    MainScreen.prototype.showLayer = function (layer) {
        layer.alpha = 0;
        new TweenAlpha(layer, 1, null, 200).run();
        layer.scale.set(0.8);

        new TweenScale(layer, 1, new Bezier(.17, .67, .59, 1.29), 200).run();
    };

    MainScreen.prototype.onMouseUp = function (event, element) {

        if (this.tutCounter === 6 && this.isTaxLock) {
            this.freeMarket.optionsPanel.show();
            this.freeMarket.isTouchable = true;
            this.healthBuilding.isTouchable = true;
            return;
        }

        var tutorialOld = this.tutorials[this.tutCounter];

        if (tutorialOld) {
            tutorialOld.visible = false;
        }

        this.tutCounter++;

        var newTutorial = this.tutorials[this.tutCounter];

        if (newTutorial) {
            this.showLayer(newTutorial);
            newTutorial.visible = true;
        }



        if (this.tutCounter === 1) {
            this.govBuilding.visible = true;
            this.roadFreeMarketTax.visible = true;
        } else if (this.tutCounter === 2) {
            this.budgetLabel.visible = true;
            this.budgetMeter.visible = true;
        } else if (this.tutCounter === 3) {
            this.budgetMeter.setPercent(0);
        } else if (this.tutCounter === 4) {
            this.healthBuilding.visible = true;
            this.roadHealthIncome.visible = true;
        } else if (this.tutCounter === 5) {
            this.roadHealthOutcome.visible = true;
        }

    };

    MainScreen.prototype.onGameOver = function () {
        this.winLayer.visible = true;
        new TweenPop(this.winLayer,1.1,null,900).run();
        
        this.moreBtn.isTouchable = true;
    };

    MainScreen.prototype.onNote = function (name, data, sender) {

    };

    MainScreen.prototype.onResize = function () {

    };
    
    MainScreen.prototype.onMore = function () {
        //TOOD link
        log("link")
    };

    window.MainScreen = MainScreen; // make it available in the main scope

}(window));