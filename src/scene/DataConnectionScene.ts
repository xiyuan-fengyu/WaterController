/**
 * Created by xiyuan_fengyu on 2017/4/17.
 */
class DataConnectionScene extends eui.UILayer {

    private ui: DataConnectionUI;

    private dataConnectionColor = 0xd1f3ff;

    private dataNodeCircles: Array<DataNodeCircle> = [];

    private dataNodeLines: Array<DataNodeLine> = [];

    private dataConnectionCircle: DataConnectionCircle;

    private dialogTest: eui.Image;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new DataConnectionUI();
        this.addChild(this.ui);

        let background = <eui.Group> this.ui["background"];
        background.touchEnabled = true;
        background.addEventListener(egret.TouchEvent.TOUCH_TAP, event => {
            event.stopPropagation();
            FadeUtil.fadeOut(this.dialogTest, 300);
        }, this);

        let foreground = <eui.Group> this.ui["foreground"];

        let connectionPoint = <eui.Group>this.ui["dataConnection"];
        connectionPoint.touchEnabled = true;
        connectionPoint.addEventListener(egret.TouchEvent.TOUCH_TAP, event => {
            event.stopPropagation();
            FadeUtil.fadeIn(this.dialogTest);
        }, this);

        Object.keys(this.ui).filter(key => key.indexOf("dataNode_") == 0).forEach(key => {
            let point = <eui.Group>this.ui[key];

            let dataNodeLine = new DataNodeLine(point.x, point.y, connectionPoint.x, connectionPoint.y, this.dataConnectionColor);
            background.addChild(dataNodeLine);
            this.dataNodeLines.push(dataNodeLine);

            let dataNodeCircle = new DataNodeCircle(point.x, point.y, 6, this.dataConnectionColor);
            background.addChild(dataNodeCircle);
            this.dataNodeCircles.push(dataNodeCircle);
        });

        this.dataConnectionCircle = new DataConnectionCircle(connectionPoint.x, connectionPoint.y, connectionPoint.width / 2, this.dataConnectionColor, 0.9);
        background.addChild(this.dataConnectionCircle);

        this.dialogTest = <eui.Image> this.ui["dialog_test"];
        FadeUtil.fadeOut(this.dialogTest, 0);
    }

}