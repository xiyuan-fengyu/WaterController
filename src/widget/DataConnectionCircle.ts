/**
 * Created by xiyuan_fengyu on 2017/4/17.
 */
class DataConnectionCircle extends eui.Rect {

    private fadeInDely: number = 600;

    private fadeInDuration: number = 600;

    private loopDuration: number = 800;

    private radius: number;

    private progress: number;

    private prevProgress: number;

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

        setTimeout(() => {
            this.$invalidate(false);

            let tween = egret.Tween.get(this, {
                loop: false
            });
            tween.to({
                progress: 0.6
            }, this.fadeInDuration).call(() => {
                tween = egret.Tween.get(this, {
                    loop: true
                });
                tween.to({
                    progress: 1
                }, this.loopDuration).to({
                    progress: 0.5
                }, this.loopDuration);
            });
        }, this.fadeInDely);
    }

    $update(dirtyRegionPolicy: string, bounds?: egret.Rectangle): boolean {
        let flag = false;
        if (this.progress != this.prevProgress) {
            this.prevProgress = this.progress;
            this.drawCircle();
            flag = true;
        }
        if (this.progress < 1) {
            setTimeout(() => {
                this.$invalidate(false);
            }, 20);
        }
        return flag;
    }

    private drawCircle() {
        this.graphics.clear();
        this.graphics.beginFill(this.circleColor, this.circleAlpha * this.progress);
        this.graphics.drawCircle(this.centerX, this.centerY, this.radius * this.progress);
        this.graphics.endFill();
    }

}