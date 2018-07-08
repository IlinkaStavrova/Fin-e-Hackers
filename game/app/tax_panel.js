(function (window, undefined) {

    function TaxPanel() {
        this.initialize();
    }

    TaxPanel.prototype = new Sprite();
    TaxPanel.prototype.spriteInitialize = TaxPanel.prototype.initialize;
    TaxPanel.prototype.initialize = function () {

        this.spriteInitialize('tax_panel');
        
        this.upBtn = new Button('',{imageNormal:'up_button'});
        this.upBtn.position.set(-70,-30);
        this.upBtn.centered();
        this.addChild(this.upBtn);
        
        this.downBtn = new Button('',{imageNormal:'down_button'});
        this.downBtn.centered();
        this.downBtn.position.set(-70,30);
        this.addChild(this.downBtn);
        
        this.upBtn.onMouseUp = this.onUpBtn.bind(this);
        this.downBtn.onMouseUp = this.onDownBtn.bind(this);
        
        this.title = new Label();
        this.title.txt = "Даночни \nПриходи";
        this.title.anchor.set(0,0.5);
        this.title.position.set(-10,-30);
        this.addChild(this.title);
        
        this.hasPercentage = true;
        
        this.taxValue = new Label();
        this.taxValue.txt = "0%";
        this.taxValue.centered();
        this.taxValue.style.fontSize = 40;
        this.taxValue.position.set(50,30);
        this.addChild(this.taxValue);
        
        this.tax = 0;
        this.increment = 2;
        
        this.centered();
        
        this.hide();
        
        this.delegate = null;
        

    };
    
    TaxPanel.prototype.onUpBtn = function () {
        
        this.tax += this.increment;
        this.tax = Math.clamp(this.tax, 0, 100);
        
        
        if(this.delegate && this.delegate.onTaxUp){
            this.delegate.onTaxUp(this);
        }
    };
    
    TaxPanel.prototype.onDownBtn = function () {
        
        this.tax -= this.increment;
        this.tax = Math.clamp(this.tax, 0, 100);
        
        if(this.delegate && this.delegate.onTaxDown){
            this.delegate.onTaxDown(this);
        }
    };
    
    TaxPanel.prototype.show = function () {
        this.visible = true;
        app.input.add(this.upBtn);
        app.input.add(this.downBtn);
    };
    
    TaxPanel.prototype.hide = function () {
        
        this.visible = false;
        app.input.remove(this.upBtn);
        app.input.remove(this.downBtn);

    };

    TaxPanel.prototype.update = function (dt) {
        this.taxValue.txt = this.tax + (this.hasPercentage ? "%" : '' );
    };

    TaxPanel.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
    };

    TaxPanel.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.TaxPanel = TaxPanel;

}(window));