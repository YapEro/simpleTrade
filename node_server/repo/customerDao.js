"use strict";
const baseDao_1 = require("./baseDao");
class customerDao extends baseDao_1.baseDao {
    login(req, res) {
        let uName = req.body.uname;
        let pwd = req.body.pwd;
        if (!uName || !pwd) {
            this.handlerErr(new Error("user name and password are require!"));
        }
        this.dataHandle(`select * from customer where c_id=${uName} and c_pwd='${pwd}'`, (data) => {
        });
    }
}
exports.customerDao = customerDao;
//# sourceMappingURL=customerDao.js.map