/// <reference path="../typings/tsd.d.ts" />
"use strict"
import {User} from "./user/User"
import UserService from "./user/User"
import db from "./dao/db"
import l from "./util/log"
import express = require('express')
import {sendResults, error} from "./util/util"
let jsonMask = require("json-mask")
let router = express.Router()

router.use(require("./middleware/setIsAPIFlag"))
router.use(require("./middleware/checkIsLoggedIn"))


/**
 * Loads all users within the community, except other admins, ordered by name.
 * Restricted to admins.
 *
 * // TODO add community id
 */
router.post("/loadAll", function(req, res) {

    let user = req.session["user"]

    l("users: " + l(user) + "\n" + l(user.ifAdmin))

    db.getConnection(c => {
        let mask = "userId,fbId,name,role";

        return new User(user).ifAdmin().
            then(()=> UserService.loadAllMasked(c, mask)).
            then((users) => {
                return UserService.loadUserByUserId(c, user.userId).
                    then((self) => {
                        users.push(jsonMask(self, mask))
                        return users;
                    })
            })
    })
    .then(sendResults(res))
    .catch(error(res))

});

export default router