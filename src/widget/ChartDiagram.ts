/**
 * Created by xiyuan_fengyu on 2017/4/18.
 */
type ChartDiagramData = {
    group: string;
    lineWidth?: number;
    lineColor?: number;
    lineAlpha?: number;
    points?: number[][];
    pointRedius?: number;
};

class ChartDiagram extends eui.Rect {

    private datas: ChartDiagramData[];

    public dataLenLimit: number = 10;

    private defaultLineWidth = 2;

    private defaultLineColor = 0xffffff;

    private defaultLineAlpha = 1;

    private defaultPointRedius = 3;

    private pointScaleX = 0;

    private pointScaleY = 0;

    private pointOffsetX = 0;

    public pointXSize = 10;

    public pointYSize = 10;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        this.mask = new egret.Rectangle(this.x, this.y, this.width, this.height);

        this.pointScaleX = this.width / this.pointXSize;
        this.pointScaleY = this.height / this.pointYSize;

        let lastTimestamp: number = null;
        egret.startTick(timestamp => {
            if (lastTimestamp) {
                this.pointOffsetX += (timestamp - lastTimestamp) / 1000;
            }
            lastTimestamp = timestamp;
            return true;
        }, this);
    }

    addGroups(groups: ChartDiagramData[]) {
        this.datas = groups;
        this.checkDatas();
    }

    addPoint(group: string, point: number[]) {
        if (this.datas == null) {
            return;
        }

        let existedGroup: ChartDiagramData = null;
        for (let i = 0, len = this.datas.length; i < len; i++) {
            let item = this.datas[i];
            if (item.group == group) {
                existedGroup = item;
            }
        }

        if (existedGroup) {
            if (existedGroup.points == null) {
                existedGroup.points = [];
            }
            existedGroup.points.push(point);
            this.checkDatas();
        }
    }

    private checkDatas() {
        let minX = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        for (let i = 0, len = this.datas.length; i < len; i++) {
            let data = this.datas[i];
            let removeIndex = 0;
            if (data.points) {
                while (data.points[removeIndex][0] - this.pointOffsetX < 0) {
                    removeIndex++;
                }
                if (removeIndex > 1) {
                    data.points = data.points.slice(removeIndex - 1);
                }
            }
        }
        this.invalidateDisplayList();
    }

    protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        if (!this.datas) {
            return ;
        }

        this.graphics.clear();

        //绘制贝塞尔曲线
        this.graphics.beginFill(this.fillColor, 0);
        for (let i = 0, len = this.datas.length; i < len; i++) {
            let item = this.datas[i];
            this.graphics.lineStyle(item.lineWidth || this.defaultLineWidth, item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
            let lenP = item.points.length;
            if (lenP == 2) {
                this.graphics.moveTo((item.points[0][0] - this.pointOffsetX) * this.pointScaleX, item.points[0][1] * this.pointScaleY);
                this.graphics.curveTo((item.points[0][0] - this.pointOffsetX) * this.pointScaleX, item.points[1][1] * this.pointScaleY, (item.points[1][0] - this.pointOffsetX) * this.pointScaleX, item.points[1][1] * this.pointScaleY);
            }
            else if (lenP >= 3) {
                //计算所有的控制点
                let controls = [];
                for (let i = 2; i < lenP; i++) {
                    let p0 = item.points[i - 2];
                    let p1 = item.points[i - 1];
                    let p2 = item.points[i];
                    p0 = [p0[0] - this.pointOffsetX, p0[1]];
                    p1 = [p1[0] - this.pointOffsetX, p1[1]];
                    p2 = [p2[0] - this.pointOffsetX, p2[1]];

                    let p3 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
                    let p4 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
                    let p5 = [(p3[0] + p4[0]) / 2, (p3[1] + p4[1]) / 2];
                    let delta = [p1[0] - p5[0], p1[1] - p5[1]];

                    p3[0] += delta[0];
                    p3[1] += delta[1];
                    p4[0] += delta[0];
                    p4[1] += delta[1];
                    controls.push(p3);
                    controls.push(p4);
                }

                this.graphics.moveTo((item.points[0][0] - this.pointOffsetX) * this.pointScaleX, item.points[0][1] * this.pointScaleY);
                for (let i = 1; i < lenP; i++) {
                    //两端的曲线段是二阶贝塞尔曲线， 其他段是三阶
                    if (i == 1) {
                        this.graphics.curveTo(controls[0][0] * this.pointScaleX, controls[0][1] * this.pointScaleY, (item.points[i][0] - this.pointOffsetX) * this.pointScaleX, item.points[i][1] * this.pointScaleY);
                    }
                    else if (i + 1 == lenP) {
                        let control = controls[controls.length - 1];
                        this.graphics.curveTo(control[0] * this.pointScaleX, control[1] * this.pointScaleY, (item.points[i][0] - this.pointOffsetX) * this.pointScaleX, item.points[i][1] * this.pointScaleY);
                    }
                    else {
                        let control0 = controls[i * 2 - 3];
                        let control1 = controls[i * 2 - 2];
                        this.graphics.cubicCurveTo(control0[0] * this.pointScaleX, control0[1] * this.pointScaleY, control1[0] * this.pointScaleX, control1[1] * this.pointScaleY, (item.points[i][0] - this.pointOffsetX) * this.pointScaleX, item.points[i][1] * this.pointScaleY)
                    }
                }
            }
        }
        this.graphics.endFill();

        //绘制节点
        for (let i = 0, len = this.datas.length; i < len; i++) {
            let item = this.datas[i];
            let lenP = item.points.length;
            this.graphics.beginFill(item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
            this.graphics.lineStyle(item.lineWidth || this.defaultLineWidth, item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
            for (let i = 0; i < lenP; i++) {
                this.graphics.drawCircle((item.points[i][0] - this.pointOffsetX) * this.pointScaleX, item.points[i][1] * this.pointScaleY, item.pointRedius || this.defaultPointRedius);
            }
            this.graphics.endFill();
        }

        setTimeout(() => {
            this.invalidateDisplayList();
        }, 16);
    }


    // protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
    //     if (!this.datas) {
    //         return ;
    //     }
    //
    //     this.graphics.clear();
    //
    //     //绘制贝塞尔曲线
    //     this.graphics.beginFill(this.fillColor, 0);
    //     for (let i = 0, len = this.datas.length; i < len; i++) {
    //         let item = this.datas[i];
    //         this.graphics.lineStyle(item.lineWidth || this.defaultLineWidth, item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
    //         let lenP = item.points.length;
    //         if (lenP == 2) {
    //             this.graphics.moveTo(item.points[0][0] * this.pointScaleX, item.points[0][1] * this.pointScaleY);
    //             this.graphics.curveTo(item.points[0][0] * this.pointScaleX, item.points[1][1] * this.pointScaleY, item.points[1][0] * this.pointScaleX, item.points[1][1] * this.pointScaleY);
    //         }
    //         else if (lenP >= 3) {
    //             //计算所有的控制点
    //             let controls = [];
    //             for (let i = 2; i < lenP; i++) {
    //                 let p0 = item.points[i - 2];
    //                 let p1 = item.points[i - 1];
    //                 let p2 = item.points[i];
    //
    //                 let p3 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    //                 let p4 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    //                 let p5 = [(p3[0] + p4[0]) / 2, (p3[1] + p4[1]) / 2];
    //                 let delta = [p1[0] - p5[0], p1[1] - p5[1]];
    //
    //                 p3[0] += delta[0];
    //                 p3[1] += delta[1];
    //                 p4[0] += delta[0];
    //                 p4[1] += delta[1];
    //                 controls.push(p3);
    //                 controls.push(p4);
    //             }
    //
    //             this.graphics.moveTo(item.points[0][0] * this.pointScaleX, item.points[0][1] * this.pointScaleY);
    //             for (let i = 1; i < lenP; i++) {
    //                 //两端的曲线段是二阶贝塞尔曲线， 其他段是三阶
    //                 if (i == 1) {
    //                     this.graphics.curveTo(controls[0][0] * this.pointScaleX, controls[0][1] * this.pointScaleY, item.points[i][0] * this.pointScaleX, item.points[i][1] * this.pointScaleY);
    //                 }
    //                 else if (i + 1 == lenP) {
    //                     let control = controls[controls.length - 1];
    //                     this.graphics.curveTo(control[0] * this.pointScaleX, control[1] * this.pointScaleY, item.points[i][0] * this.pointScaleX, item.points[i][1] * this.pointScaleY);
    //                 }
    //                 else {
    //                     let control0 = controls[i * 2 - 3];
    //                     let control1 = controls[i * 2 - 2];
    //                     this.graphics.cubicCurveTo(control0[0] * this.pointScaleX, control0[1] * this.pointScaleY, control1[0] * this.pointScaleX, control1[1] * this.pointScaleY, item.points[i][0] * this.pointScaleX, item.points[i][1] * this.pointScaleY)
    //                 }
    //             }
    //         }
    //     }
    //     this.graphics.endFill();
    //
    //     //绘制节点
    //     for (let i = 0, len = this.datas.length; i < len; i++) {
    //         let item = this.datas[i];
    //         let lenP = item.points.length;
    //         this.graphics.beginFill(item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
    //         for (let i = 0; i < lenP; i++) {
    //             // this.graphics.beginFill(this.fillColor, 0);
    //             // this.graphics.drawCircle(item.points[i][0] * this.pointScaleX, item.points[i][1] * this.pointScaleY, item.pointRedius || this.defaultPointRedius);
    //             this.graphics.lineStyle(item.lineWidth || this.defaultLineWidth, item.lineColor || this.defaultLineColor, item.lineAlpha || this.defaultLineAlpha);
    //             this.graphics.drawCircle(item.points[i][0] * this.pointScaleX, item.points[i][1] * this.pointScaleY, item.pointRedius || this.defaultPointRedius);
    //         }
    //         this.graphics.endFill();
    //     }
    // }



}