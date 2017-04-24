/**
 * Created by xiyuan_fengyu on 2017/4/24.
 */
class Vector {

    static distanceSquare(x1: number, y1: number, x2: number, y2: number): number {
        let disX = x1 - x2;
        let disY = y1 - y2;
        return disX * disX + disY * disY;
    }

    static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Vector.distanceSquare(x1, y1, x2, y2));
    }



}