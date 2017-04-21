class WaterController extends eui.UILayer {
	
	public constructor() {
		super();
	}

	private ui: WaterControllerUI;

	private optionPanel: eui.Group;

    $onAddToStage(stage: egret.Stage, nestLevel: number) {
		super.$onAddToStage(stage, nestLevel);
		
		this.ui = new WaterControllerUI();
		this.ui["bg"].touchEnabled = true;
		this.ui["bg"].addEventListener(egret.TouchEvent.TOUCH_TAP, event => {
			this.hideGameOver(300);
		}, this);
		this.addChild(this.ui);

		this.optionPanel = <eui.Group>this.ui["optionPanel"];
		this.hideGameOver(0);
		
		let optionPanelClose = <egret.DisplayObject>this.ui["optionPanelClose"];
		optionPanelClose.touchEnabled = true;
		optionPanelClose.addEventListener(egret.TouchEvent.TOUCH_TAP, event => {
			this.hideGameOver(300);
		}, this);

		this.findAllWaterItems();
		this.findAllClickAreas();
	}

	private findAllWaterItems() {
		let waterItem: eui.Image;
		let waterItemIndex = 0;
		while ((waterItem = <eui.Image>this.ui["waterItem" + waterItemIndex]) != null) {
			waterItem["index"] = waterItemIndex;
			let tween = egret.Tween.get(waterItem, {
				loop: true
			});
			tween
			.to({
				y: waterItem.y + 30
			}, 800, egret.Ease.sineInOut)
			.to({
				y: waterItem.y
			}, 800, egret.Ease.sineInOut);
			waterItemIndex ++;
		}
	}

	private findAllClickAreas() {
		let clickArea: eui.Group;
		let clickAreaIndex = 0;
		while ((clickArea = <eui.Group>this.ui["clickArea" + clickAreaIndex]) != null) {
			clickArea["index"] = clickAreaIndex;
			clickArea.touchEnabled = true;
			clickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
			clickAreaIndex ++;
		}
	}

	private onClick(event: egret.TouchEvent) {
		this.ui["optionPanel"].title = "控制面板-" + (event.currentTarget.index + 1);
		this.showOptionPanel();
	}

	private showOptionPanel(duration = 300, callback = null) {
		let doCallback = typeof callback == "function";
		if (this.optionPanel.visible) {
			doCallback && callback();
		}
		else {
			this.optionPanel.parent.setChildIndex(this.optionPanel, this.optionPanel.parent.numChildren);
			this.optionPanel.alpha = 0;
			this.optionPanel.visible = true;
			egret.Tween.get(this.optionPanel).to({
				alpha: 1
			}, duration).call(function () {
				doCallback && callback();
			});
		}
	}

	private hideGameOver(duration = 300, callback = null) {
		let that = this;
		let doCallback = typeof callback == "function";
		if (this.optionPanel.visible) {
			this.optionPanel.alpha = 1;
			egret.Tween.get(this.optionPanel).to({
				alpha: 0
			}, duration).call(function () {
				that.optionPanel.visible = false;
				doCallback && callback();
			});
		}
		else {
			doCallback && callback();
		}
	}

}