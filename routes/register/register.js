/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var db_1 = require("../dao/db");
var User_1 = require("../user/User");
var RegisterService = (function () {
    function RegisterService() {
    }
    /**
     * A promise of the registration corresponding to the given registrationId
     */
    RegisterService.loadRegistration = function (c, registrationId) {
        return db_1.default.queryOne(c, "select * from registration where registrationId = ?", [registrationId]);
    };
    // Adds a registration entry for the new user and returns the registration link.
    RegisterService.addRegistration = function (c, name, email, phoneNumber) {
        return db_1.default.query(c, "select md5(uuid()) as id", []).
            then(function (rs) {
            var registrationId = rs[0].id;
            var registrationLink = "http://52.88.50.116:7000/register?id=" + registrationId;
            return c.query("insert into registration (registrationId, registrationDate, name, " +
                "email, phoneNumber, registrationLink) values (?,?,?,?,?,?)", [registrationId, new Date(), name, email, phoneNumber, registrationLink]).
                then(function () { return registrationLink; });
        });
    };
    /*
     Example auth object:
     {
     "id":"10153162607041397",       // The facebook id
     "first_name":"Dave",
     "gender":"male",
     "last_name":"MacDonald",
     "link":"https://www.facebook.com/app_scoped_user_id/10153162607041397/",
     "locale":"en_GB",
     "name":"Dave MacDonald",
     "timezone":-5,
     "updated_time":"2015-11-17T17:23:11+0000",
     "verified":true
     }

     */
    RegisterService.registerUser = function (c, auth, registrationId, role) {
        // Load the registration
        return db_1.default.queryOne(c, "select * from registration where registrationId = ?", [registrationId]).then(function (registration) {
            // Insert the user
            return User_1.default.addUser(c, {
                tagId: '',
                name: auth.name,
                email: registration.email,
                fbId: auth.id,
                fbLink: auth.link,
                role: role,
                first_name: auth.first_name,
                last_name: auth.last_name,
                locale: auth.locale,
                timezone: auth.timezone,
                patientId: null
            });
        }).then(function () {
            // Mark the registration as complete
            return db_1.default.query(c, "update registration set hasRegistered = 'Y', registrationDate = ? where registrationId = ?", [new Date(), registrationId]);
        });
    };
    return RegisterService;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterService;
//# sourceMappingURL=register.js.map