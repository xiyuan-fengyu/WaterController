/**
 * Created by xiyuan_fengyu on 2017/4/11.
 */
class DragonBonesUtil {

    private static dragonBonesFactory: dragonBones.EgretFactory;

    static getAnimatureDisplay(dbName: string): dragonBones.EgretArmatureDisplay {
        if (!DragonBonesUtil.dragonBonesFactory) {
            DragonBonesUtil.dragonBonesFactory = new dragonBones.EgretFactory();
        }

        let data = DragonBonesUtil.dragonBonesFactory.getDragonBonesData(dbName);
        if (!data) {
            data = DragonBonesUtil.dragonBonesFactory.parseDragonBonesData(RES.getRes(dbName + "_ske_json"));
            DragonBonesUtil.dragonBonesFactory.addDragonBonesData(data, dbName);
            DragonBonesUtil.dragonBonesFactory.parseTextureAtlasData(RES.getRes(dbName + "_tex_json"), RES.getRes(dbName + "_tex_png"))
        }

        return DragonBonesUtil.dragonBonesFactory.buildArmatureDisplay(data.armatureNames[0], data.name);
    }

}