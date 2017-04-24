class MaskTestScene extends eui.UILayer {

	private ui: MaskTestUI;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new MaskTestUI();
        this.addChild(this.ui);

        let testImg = ChildrenFinder.find<eui.Image>(this.ui, "testImg")[0];
        let testMask = ChildrenFinder.find<eui.Image>(this.ui, "testMask")[0];
        testImg.mask = testMask;

        egret.Tween.get(testMask, {
            loop: false
        }).to({
            width: testImg.width
        }, 1500);
    }
}