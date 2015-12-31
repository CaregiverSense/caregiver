/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../../routes/dao/db");
var jsonMask = require("json-mask");
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
        this.patientId = row.patientId;
    }
    User.prototype.hasAccessTo = function (c, userId) {
        if (this.userId == userId) {
            return new Promise(function (y) { return y(true); });
        }
        else {
            return this.isSupervisorOf(c, userId);
        }
    };
    /**
     * Returns a promise that resolves iff the user is an admin.
     * @param userId
     */
    User.prototype.ifAdmin = function () {
        var _this = this;
        return new Promise(function (y, n) { return (_this.role == 'admin' ? y() : n()); });
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
                return db_1.default.query(c, "insert into user_patient (userId, patientId) values (?,?)", [_this.userId, userId]);
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
        return db_1.default.query(c, "select * from user_patient where userId = ? and patientId = ?", [this.userId, userId]).then(function (results) {
            console.log('user patients for userId: ', results.length);
            return (results.length == 1);
        });
    };
    /**
     * Unassign a patient from the given user
     *
     * @param c         The connection
     * @param userId    The userId of the patient to unassign from this user
     * @returns {Promise<any>}
     */
    User.prototype.unassignPatient = function (c, userId) {
        return db_1.default.query(c, "delete from user_patient where userId = ? and patientId = ?", [this.userId, userId]);
    };
    return User;
})();
exports.User = User;
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
        return db_1.default.query(c, "insert into user (" +
            "tagId," +
            "name," +
            "email," +
            "fbId," +
            "fbLink," +
            "role," +
            "first_name," +
            "last_name," +
            "locale," +
            "timezone," +
            "patientId" +
            ") values (?,?,?,?,?,?,?,?,?,?,?)", [
            user.tagId,
            user.name,
            user.email,
            user.fbId,
            user.fbLink,
            user.role,
            user.first_name,
            user.last_name,
            user.locale,
            user.timezone,
            user.patientId
        ]).
            then(function (results) {
            user.userId = results.insertId;
            console.log("Added user with name ", user.name, " with id ", user.userId);
        });
    };
    UserService.loadUserByFbId = function (c, fbId) {
        console.log("UserService.loadUserByFbId: Loading user with fbId " + fbId);
        return db_1.default.queryOne(c, "select * from user where fbId = ?", [fbId]).
            then(function (row) {
            return new User(row);
        });
    };
    UserService.loadUserByUserId = function (c, userId) {
        console.log("UserService.loadUserByUserId: Loading user with userId " + userId);
        return db_1.default.queryOne(c, "select * from user where userId = ?", [userId]).
            then(function (row) {
            return new User(row);
        });
    };
    // TODO Add communityId
    UserService.loadUsersByRole = function (c, role) {
        return db_1.default.
            query(c, "select * from user where role = ? order by name", [role]).
            then(function (results) {
            console.log("Loaded users for role " + role);
            console.dir(results);
            return results.map(function (row) { return new User(row); });
        });
    };
    UserService.loadCaregiversForPatient = function (c, patientId) {
        return db_1.default.
            query(c, "select u.* from user u, user_patient up where " +
            "u.userId = up.userId and up.patientId = ?", [patientId]).
            then(function (results) {
            return results.map(function (row) { return new User(row); });
        });
    };
    UserService.loadPatientsForCaregiver = function (c, caregiverId) {
        return db_1.default.
            query(c, "select u.* from user u, user_patient up where u.userId = up.patientId and up.userId = ?", [caregiverId]).
            then(function (results) {
            return results.map(function (row) { return new User(row); });
        });
    };
    /**
     * Loads all non-admin users, ordered by name.
     * A json-mask can be specified to return only specific properties.
     *
     * TODO Add support for a community id.
     *
     * @param c
     * @param projection
     */
    UserService.loadAllMasked = function (c, mask) {
        return db_1.default.
            query(c, "select * from user where role <> 'admin' order by name", []).
            then(function (results) {
            console.dir(results);
            return mask ? results.map(function (row) { return jsonMask(new User(row), mask); }) : results;
        });
    };
    return UserService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserService;
//# sourceMappingURL=User.js.map