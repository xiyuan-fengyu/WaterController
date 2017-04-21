import Group = eui.Group;
class StartScene extends eui.UILayer {

	private ui: StartUI;

	private dialog0: eui.Group;

	private pointToDialogLine: PointToDialogLine;

	private warns: any = {};

	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);

		mouse.enable(this.stage);

		this.ui = new StartUI();
		this.addChild(this.ui);

		this.dialog0 = this.ui["dialog0"];
		this.hideDialog(this.dialog0, 0);

		this.pointToDialogLine = new PointToDialogLine();
		this.ui.addChild(this.pointToDialogLine);

		for (let i = 0; i < 3; i++) {
			let id = "btn" + i;
			let btn = this.ui[id];
			btn.touchEnabled = true;
			btn["id"] = id;

			this.warns[id] = [];

			if (i == 0) {
				this.ui.setChildIndex(this.pointToDialogLine, this.ui.getChildIndex(btn));
			}

			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
				event.stopPropagation();
				this.pointToDialogLine.fadeOut(300);
				this.hideDialog(this.dialog0, 300);

				let btnId = event.currentTarget["id"];
				Object.keys(this.warns).forEach(key => {
					let show = key == btnId;
					this.warns[key].forEach(warn => {
						(<eui.Component>warn).visible = show;
					});
				});
			}, this);
		}

		let warnsGroup = <eui.Group>this.ui["warns"];
		Object.keys(this.ui).filter(key => key.match("warn_btn[0-9]+_[0-9]+")).forEach(key => {
			let btnId = key.split("_")[1];
			let warn = this.ui[key];
			warn.touchEnabled = true;
			warn.visible = false;
			warn["id"] = key;
			warn.addEventListener(mouse.MouseEvent.MOUSE_OVER, (event: mouse.MouseEvent) => {
				// event.stopPropagation();
				// this.dialog0.x = event.currentTarget.x;
				this.pointToDialogLine.redraw(warn.x + warn.width / 2, warn.y + warn.height / 2, this.dialog0.x + 10, this.dialog0.y + 18, 0x3AB9E4, 0.8);
				this.pointToDialogLine.fadeIn(300);
				this.showDialog(this.dialog0, 300);
			}, this);
			this.warns[btnId].push(warn);
		});

		this.ui.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
			this.pointToDialogLine.fadeOut(300);
			this.hideDialog(this.dialog0, 300);
		}, this);
	}

	private showDialog(dialog: egret.DisplayObject, duration = 300, callback = null) {
		let doCallback = typeof callback == "function";
		if (dialog.visible) {
			doCallback && callback();
		}
		else {
			dialog.parent.setChildIndex(dialog, dialog.parent.numChildren);
			dialog.alpha = 0;
			dialog.visible = true;
			egret.Tween.get(dialog).to({
				alpha: 1
			}, duration).call(function () {
				doCallback && callback();
			});
		}
	}

	private hideDialog(dialog: egret.DisplayObject, duration = 300, callback = null) {
		let doCallback = typeof callback == "function";
		if (dialog.visible) {
			dialog.alpha = 1;
			egret.Tween.get(dialog).to({
				alpha: 0
			}, duration).call(function () {
				dialog.visible = false;
				doCallback && callback();
			});
		}
		else {
			doCallback && callback();
		}
	}


}