"use strict";
const logUtils_1 = require("./logUtils");
class commUtils {
    static handlerErr(owner, err) {
        let logger = new logUtils_1.logUtils(owner);
        logger.logError(err);
        throw err;
    }
}
exports.commUtils = commUtils;
//# sourceMappingURL=commUtils.js.map