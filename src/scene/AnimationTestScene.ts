/**
 * Created by xiyuan_fengyu on 2017/4/11.
 */
class AnimationTestScene extends eui.UILayer {

    private ui: AnimationTestUI;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new AnimationTestUI();
        this.addChild(this.ui);

        let bioPool = DragonBonesUtil.getAnimatureDisplay("bio_pool");
        this.ui.addChild(bioPool);
        bioPool.scaleX = 2;
        bioPool.scaleY = 2;
        bioPool.anchorOffsetX = bioPool.width / 2;
        bioPool.anchorOffsetY = bioPool.height / 2;
        bioPool.x = this.stage.stageWidth / 2;
        bioPool.y = this.stage.stageHeight / 2;
        bioPool.animation.timeScale = 0.5;
        bioPool.animation.play("newAnimation", 0);
    }

}