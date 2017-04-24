/**
 * Created by xiyuan_fengyu on 2017/4/19.
 */
class ChildrenFinder {

    static find<T extends egret.DisplayObject>(from: egret.DisplayObjectContainer, regex: string): Array<T> {
        if (from && regex) {
            return Object.keys(from).filter(key => key.match(regex)).map(key => {
                let item = from[key];
                item.id = key;
                return <T> item;
            });
        }
        else return [];
    }

    static findById<T extends egret.DisplayObject>(from: egret.DisplayObjectContainer, id: string): T {
        return from && id ? <T>from[id] : null;
    }

}