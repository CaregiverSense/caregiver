var db = require("./db.js");



var d = console.dir;
var l = console.log;
var j = JSON.stringify;

module.exports = {

    loadUserByUserId : function(c, userId, cb) {
        c.query("select * from user where userId = ?", [fbId], db.wrap((rs) => {
            l("Loaded user:" + j(rs));
            if (rs.length > 0) {
                cb(rs[0]);
            }
        }));
    },

    loadUserByFbId : function(c, fbId) {
        console.log("user-dao.loadUserByFbId: Loading user with fbId " + fbId);

        return db.queryOne(c, "select * from user where fbId = ?", [fbId]);
    },

/*
    return db.query(c,
        "insert into user (tagId, name, email, fbId, fbLink, role, first_name, last_name, locale, timezone) " +
        "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        ['', auth.name, registration.email, auth.id, auth.link, role, auth.first_name, auth.last_name, auth.locale, auth.timezone]
    );
*/


}