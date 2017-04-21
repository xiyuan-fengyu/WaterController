/**
 * Created by xiyuan_fengyu on 2017/4/17.
 */
class DataNodeCircle extends eui.Rect {

    private radius: number;

    private centerX: number;

    private centerY: number;

    private circleColor: number;

    private circleAlpha: number;

    constructor(x: number, y: number, radius: number, circleColor: number, circleAlpha: number = 1) {
        super(0, 0);
        this.fillAlpha = 0;
        this.circleColor = circleColor;
        this.circleAlpha = circleAlpha;

        this.radius = radius;
        this.centerX = x;
        this.centerY = y;
        this.x = 0;
        this.y = 0;
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        this.$invalidate(false);
    }

    $update(dirtyRegionPolicy: string, bounds?: egret.Rectangle): boolean {
        this.drawCircle();
        return true;
    }

    private drawCircle() {
        this.graphics.clear();
        this.graphics.beginFill(this.circleColor, this.circleAlpha);
        this.graphics.drawCircle(this.centerX, this.centerY, this.radius);
        this.graphics.endFill();
    }

}