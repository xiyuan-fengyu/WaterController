/**
 * Created by xiyuan_fengyu on 2017/4/17.
 */
class FadeUtil {

    public static fadeIn(component: egret.DisplayObject, callback = null, duration = 300) {
        let doCallback = typeof callback == "function";
        if (component.visible) {
            doCallback && callback();
        }
        else {
            component.alpha = 0;
            component.visible = true;
            egret.Tween.get(component).to({
                alpha: 1
            }, duration).call(function () {
                egret.Tween.removeTweens(component);
                doCallback && callback();
            });
        }
    }

    public static fadeOut(component: egret.DisplayObject, callback = null, duration = 300) {
        let doCallback = typeof callback == "function";
        if (component.visible) {
            egret.Tween.get(component).to({
                alpha: 0
            }, duration).call(function () {
                component.visible = false;
                egret.Tween.removeTweens(component);
                doCallback && callback();
            });
        }
        else {
            doCallback && callback();
        }
    }

}