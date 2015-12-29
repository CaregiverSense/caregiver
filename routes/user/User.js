/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../../routes/dao/db");
var User = (function () {
    function User(row) {
        this.userId = row.userId;
        this.tagId = row.tagId;
        this.name = row.name;
        this.email = row.email;
        this.fbId = row.fbId;
        this.fbLink = row.fbLink;
        this.role = row.role;
        this.first_name = row.first_name;
        this.last_name = row.last_name;
        this.locale = row.locale;
        this.timezone = row.timezone;
    }
    User.prototype.hasAccessTo = function (c, userId) {
        var _this = this;
        return new Promise(function (yes, no) {
            if (_this.userId == userId) {
                yes(true);
            }
            else {
                return db_1["default"].query(c, "");
            }
        });
    };
    /**
     * Make this user a supervisor of the given one.
     *
     * @param c         The connection
     * @param userId    The user to be supervised by this user
     * @returns {Promise<TResult>|Promise<U>} to allow chaining
     */
    User.prototype.makeSupervisorOf = function (c, userId) {
        var _this = this;
        return this.isSupervisorOf(c, userId).
            then(function (isSupervisor) {
            if (!isSupervisor) {
                return db_1["default"].query(c, "insert into user_patient (userId, patientId) values (?,?)", [_this.userId, userId]);
            }
        }).then(function () { });
    };
    /**
     * True if and only if this user is a supervisor of the given user
     *
     * @param c         The connection
     * @param userId    The id of the given user
     * @returns {Promise<TResult>|Promise<U>} to allow chaining
     */
    User.prototype.isSupervisorOf = function (c, userId) {
        return db_1["default"].query(c, "select * from user_patient where userId = ? and patientId = ?", [this.userId, userId]).then(function (results) {
            console.log('user patients for userId: ', results.length);
            return (results.length == 1);
        });
    };
    return User;
})();
exports.__esModule = true;
exports["default"] = User;
var UserService = (function () {
    function UserService() {
    }
    /**
     * Adds the given user and decorates it with the generated userId
     *
     * @param c     The connection
     * @param user  The user to add
     * @returns {Promise<T>|Promise} to allow chaining
     */
    UserService.addUser = function (c, user) {
        console.log("UserService.addUser: Adding ", JSON.stringify(user));
        return db_1["default"].query(c, "insert into user (" +
            "tagId," +
            "name," +
            "email," +
            "fbId," +
            "fbLink," +
            "role," +
            "first_name," +
            "last_name," +
            "locale," +
            "timezone" +
            ") values (?,?,?,?,?,?,?,?,?,?)", [
            user.tagId,
            user.name,
            user.email,
            user.fbId,
            user.fbLink,
            user.role,
            user.first_name,
            user.last_name,
            user.locale,
            user.timezone
        ]).
            then(function (results) {
            user.userId = results.insertId;
            console.log("Added user ", user.name, " with id ", user.userId);
        });
    };
    UserService.loadUserByFbId = function (c, fbId) {
        console.log("UserService.loadUserByFbId: Loading user with fbId " + fbId);
        return db_1["default"].queryOne(c, "select * from user where fbId = ?", [fbId]).
            then(function (row) {
            console.log("Have row");
            console.dir(row);
            return new User(row);
        });
    };
    return UserService;
})();
exports.UserService = UserService;
//# sourceMappingURL=User.js.map