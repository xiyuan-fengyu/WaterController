class ClosingScene extends eui.UILayer {

	private ui: ClosingUI;

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);

		this.ui = new ClosingUI();
		this.addChild(this.ui);

		let allImg = <eui.Image> this.ui["closing"];
		egret.Tween.get(allImg).to({
			scaleX: 2,
			scaleY: 2,
			x: allImg.width * (1 - 2) * 0.5,
			y: allImg.height * (1 - 2) * 0.1
		}, 2000);
	}

}