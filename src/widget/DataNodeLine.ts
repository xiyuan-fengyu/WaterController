/**
 * Created by xiyuan_fengyu on 2017/4/17.
 */
class DataNodeLine extends eui.Rect {

    private fromX: number;

    private fromY: number;

    private toX: number;

    private toY: number;

    private animationDuration: number = 800;

    private prevProgress: number = -1;

    public progress: number = 0;

    private lineWidth: number;

    private lineColor: number;

    private lineAlpha: number;

    private lineItemLen = 8;

    private lineDividerLen = 8;

    private lineOffset = 0;

    private lineOffsetDelta = 0.1;

    constructor(fromX: number, fromY: number, toX: number, toY: number, lineColor: number, lineWidth: number = 2, lineAlpha: number = 1) {
        super(0, 0);
        this.fillAlpha = 0;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.lineAlpha = lineAlpha;

        this.fromX = fromX;
        this.fromY = fromY;
        this.toX = toX;
        this.toY = toY;
        this.x = 0;
        this.y = 0;
    }


    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.$invalidate(false);

        let tween = egret.Tween.get(this, {
            loop: false
        });
        tween.to({
            progress: 1
        }, this.animationDuration);
    }

    $update(dirtyRegionPolicy: string, bounds?: egret.Rectangle): boolean {
        let flag = false;
        if ((this.lineDividerLen > 0 && this.progress == 1) || this.progress != this.prevProgress) {
            this.prevProgress = this.progress;
            this.drawLine();
            setTimeout(() => {
                this.$invalidate(false);
            }, 20);
            flag = true;
        }
        return flag;
    }

    private drawLine() {
        this.graphics.clear();
        this.graphics.lineStyle(this.lineWidth, this.lineColor, this.lineAlpha);

        let endX = this.fromX + (this.toX - this.fromX) * this.progress;
        let endY = this.fromY + (this.toY - this.fromY) * this.progress;
        if (this.lineDividerLen <= 0) {
            this.graphics.moveTo(this.fromX, this.fromY);
            this.graphics.lineTo(endX, endY);
        }
        else {
            if (this.progress == 1) {
                this.lineOffset += this.lineOffsetDelta;
                if (this.lineOffset > 1) {
                    this.lineOffset -= 1;
                }
            }

            let lineNum = Math.pow(Math.pow(this.fromX - endX, 2) + Math.pow(this.fromY - endY, 2), 0.5) / (this.lineDividerLen + this.lineItemLen);
            let lineLen = this.lineDividerLen + this.lineItemLen;
            let simplizeV = [this.fromX - this.toX, this.fromY - this.toY];
            let simplizeLen = Math.pow(Math.pow(simplizeV[0], 2) + Math.pow(simplizeV[1], 2), 0.5);
            simplizeV[0] /= simplizeLen;
            simplizeV[1] /= simplizeLen;

            this.graphics.moveTo(endX, endY);
            let firstLineItemPercent = this.lineItemLen / lineLen - this.lineOffset;
            if (firstLineItemPercent > 0) {
                this.graphics.lineTo(endX + simplizeV[0] * lineLen * firstLineItemPercent, endY + simplizeV[1] * lineLen * firstLineItemPercent);
            }
            endX += simplizeV[0] * lineLen * (1 - this.lineOffset);
            endY += simplizeV[1] * lineLen * (1 - this.lineOffset);

            for (let num = lineNum - 1; num > 0; num--) {
                this.graphics.moveTo(endX, endY);
                if (num >= 1) {
                    this.graphics.lineTo(endX + simplizeV[0] * this.lineItemLen, endY + simplizeV[1] * this.lineItemLen);
                }
                else {
                    let percent = Math.min(this.lineItemLen / lineLen, num);
                    this.graphics.lineTo(endX + simplizeV[0] * lineLen * percent, endY + simplizeV[1] * lineLen * percent);
                }
                endX += simplizeV[0] * lineLen;
                endY += simplizeV[1] * lineLen;
            }
        }
    }

}