class MaskTestScene extends eui.UILayer {

	private ui: MaskTestUI;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        mouse.enable(this.stage);

        this.ui = new MaskTestUI();
        this.addChild(this.ui);

        let testHighlight = ChildrenFinder.find<eui.Rect>(this.ui, "testHighlight")[0];
        testHighlight.mask = ChildrenFinder.find<eui.Image>(this.ui, "testHighlightMask")[0];

        let testImg = ChildrenFinder.find<eui.Image>(this.ui, "testImg")[0];
        testImg.mask = ChildrenFinder.find<eui.Image>(this.ui, "testMask")[0];

        egret.Tween.get(testImg, {
            loop: false
        }).to({
            y: 0
        }, 1000).call(() => {
            testImg.mask = null;
            testImg.touchEnabled = true;

            testImg.addEventListener(mouse.MouseEvent.MOUSE_OVER, (event: mouse.MouseEvent) => {
                testHighlight.visible = true;
                testHighlight.alpha = 0;
                egret.Tween.get(testHighlight, {
                    loop: true
                }).to({
                    alpha: 1
                }, 600).to({
                    alpha: 0
                }, 600);
            }, this);
            testImg.addEventListener(mouse.MouseEvent.MOUSE_OUT, (event: mouse.MouseEvent) => {
                egret.Tween.removeTweens(testHighlight);
                FadeUtil.fadeOut(testHighlight);
            }, this);

            testImg.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
                event.stopPropagation();

                let uiMask = new ChangeSceneCircleMask(event.stageX, event.stageY);

                let newScence = new DataConnectionScene();
                this.parent.addChildAt(newScence, 0);
                uiMask.addFinishListener(() => {
                    this.parent.removeChild(this);
                }, this);

                this.ui.addChild(uiMask);
                this.ui.mask = uiMask;
            }, this);
        });
    }
}