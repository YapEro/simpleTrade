"use strict";
const baseDao_1 = require("./baseDao");
const response_1 = require("../../models/response");
class customerDao extends baseDao_1.baseDao {
    login(req, res) {
        let uName = req.body.uname;
        let pwd = req.body.pwd;
        if (!uName || !pwd) {
            this.handlerErr(new Error("user name and password are require!"));
        }
        this.sqlExec(`select * from customer where c_no=${uName} and c_pwd='${pwd}'`, (data) => {
            if (data) {
                req.session["user_no"] = data["c_no"];
                res.json(new response_1.response(true, "Successful for login!", data));
            }
            else {
                res.json(new response_1.response(false, `Failed for login, has no [${uName}] or password error!`));
            }
        });
    }
}
exports.customerDao = customerDao;
//# sourceMappingURL=customerDao.js.map