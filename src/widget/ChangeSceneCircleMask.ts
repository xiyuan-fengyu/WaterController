/**
 * Created by xiyuan_fengyu on 2017/4/24.
 */
class ChangeSceneCircleMask extends eui.Rect {

    private centerX: number;

    private centerY: number;

    private maxRadius: number;

    private progress: number = 0;

    private duration: number;

    private finishTarget: any;

    private finishCallback: () => void;

    constructor(x: number, y: number, duration: number = 600) {
        super(0, 0, 0xffffff);
        this.fillAlpha = 0;

        this.centerX = x;
        this.centerY = y;
        this.duration = duration;
    }

    addFinishListener(callback: () => void, target) {
        this.finishCallback = callback;
        this.finishTarget = target;
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let maxRadius = Math.abs(this.centerX) + Math.abs(this.centerY);
        let maxRadiusIndex = 0;

        let temp = Math.abs(this.centerX - stageW) + Math.abs(this.centerY);
        if (temp > maxRadius) {
            maxRadius = temp;
            maxRadiusIndex = 1;
        }

        temp = Math.abs(this.centerX - stageW) + Math.abs(this.centerY - stageH);
        if (temp > maxRadius) {
            maxRadius = temp;
            maxRadiusIndex = 2;
        }

        temp = Math.abs(this.centerX) + Math.abs(this.centerY - stageH);
        if (temp > maxRadius) {
            maxRadiusIndex = 3;
        }

        switch (maxRadiusIndex) {
            case 0: {
                maxRadius = Vector.distance(this.centerX, this.centerY, 0, 0);
                break;
            }
            case 1: {
                maxRadius = Vector.distance(this.centerX, this.centerY, stageW, 0);
                break;
            }
            case 2: {
                maxRadius = Vector.distance(this.centerX, this.centerY, stageW, stageH);
                break;
            }
            case 3: {
                maxRadius = Vector.distance(this.centerX, this.centerY, 0, stageH);
                break;
            }
        }

        this.maxRadius = maxRadius;
        this.width = this.maxRadius * 2;
        this.height = this.maxRadius * 2;
        this.x = this.centerX - maxRadius;
        this.y = this.centerY - maxRadius;

        egret.Tween.get(this, {
            loop: false
        }).to({
            progress: 1
        }, this.duration, egret.Ease.sineInOut).call(() => {
            if (this.finishTarget && this.finishCallback) {
                this.finishCallback.call(this.finishTarget);
            }
        });
        this.invalidateDisplayList();
    }

    protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        this.draw();

        setTimeout(() => {
            this.invalidateDisplayList();
        }, 30);
    }

    private draw() {
        let innerRadius = this.maxRadius * this.progress;
        this.graphics.clear();
        this.graphics.beginFill(0xffffff);
        this.graphics.drawArc(this.maxRadius, this.maxRadius, innerRadius, 0, Math.PI, true);
        this.graphics.lineTo(0, this.maxRadius);
        this.graphics.drawArc(this.maxRadius, this.maxRadius, this.maxRadius, Math.PI, Math.PI * 2);
        this.graphics.lineTo(this.maxRadius + innerRadius, this.maxRadius);
        this.graphics.drawArc(this.maxRadius, this.maxRadius, innerRadius, 0, Math.PI);
        this.graphics.lineTo(0, this.maxRadius);
        this.graphics.drawArc(this.maxRadius, this.maxRadius, this.maxRadius, Math.PI, 0, true);
        this.graphics.lineTo(this.maxRadius + innerRadius, this.maxRadius);
        this.graphics.endFill();
    }

}