/**
 * Created by xiyuan_fengyu on 2017/4/10.
 */
class PointToDialogLine extends eui.Rect {

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.width = this.parent.width;
        this.height = this.parent.height;
        this.touchEnabled = false;
        this.visible = false;
    }

    redraw(fromX: number, fromY: number, toX: number, toY: number, color: number, alpha?: number) {
        this.graphics.clear();
        this.graphics.lineStyle(5, color, alpha);
        this.graphics.moveTo(fromX, fromY);
        this.graphics.curveTo(toX * 0.9 + fromY * 0.2, -50, toX, toY);
    }

    fadeIn(duration = 300, callback = null) {
        let doCallback = typeof callback == "function";
        if (this.visible) {
            doCallback && callback();
        }
        else {
            this.alpha = 0;
            this.visible = true;
            egret.Tween.get(this).to({
                alpha: 1
            }, duration).call(function () {
                doCallback && callback();
            });
        }
    }

    fadeOut(duration = 300, callback = null) {
        let doCallback = typeof callback == "function";
        if (this.visible) {
            this.alpha = 1;
            egret.Tween.get(this).to({
                alpha: 0
            }, duration).call(function () {
                this.visible = false;
                doCallback && callback();
            });
        }
        else {
            doCallback && callback();
        }
    }

}