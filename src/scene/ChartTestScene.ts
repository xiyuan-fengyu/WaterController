/**
 * Created by xiyuan_fengyu on 2017/4/18.
 */
class ChartTestScene extends eui.UILayer {

    private ui: ChartTestUI;

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);

        this.ui = new ChartTestUI();
        this.addChild(this.ui);

        let diagram = <ChartDiagram>this.ui["diagram"];
        diagram.pointXSize = 10;
        diagram.pointYSize = 8;
        diagram.addGroups([
            {
                group: "predict",
                lineColor: 0x1296DB
            },
            {
                group: "real",
                lineColor: 0x5CB85C
            }
        ]);
        let index = 20;
        for (let i = 0, realMax = index - 5; i < index; i++) {
            diagram.addPoint("predict", [i, Math.random() * 5]);
            if (i < realMax) {
                diagram.addPoint("real", [i, Math.random() * 5]);
            }
        }

        setInterval(() => {
            diagram.addPoint("predict", [index, Math.random() * 5]);
            diagram.addPoint("real", [index - 4, Math.random() * 5]);
            index++;
        }, 1000);
    }

}