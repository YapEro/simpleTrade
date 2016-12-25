import {logUtils} from "./logUtils";
export class commUtils{
    public static handlerErr(owner:string, err:Error){
        let logger = new logUtils(owner);
        logger.logError(err);
        throw err;
    }
}