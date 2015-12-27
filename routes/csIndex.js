var db = require('./dao/db')
var express = require('express')
var router = express.Router()
var extend = require("extend");

var l = console.log
var d = console.dir
var j = JSON.stringify;

var dao = {};
extend(dao,
    require("./dao/user-dao"),
    {
        // Demo purposes only, toggles a user between a caregiver and a patient
        switchRole: function (c, userId, cb) {
            c.query("select u.role from user u where u.userId = ?", [userId], db.wrap((rs)=> {
                if (rs.length == 1) {
                    var newRole = 'caregiver';
                    var view = '/caregiver';
                    if (rs[0].role == 'caregiver') {
                        newRole = null;
                        view = '/self';
                    }
                    c.query("update user set role = ? where userId = ?", [newRole, userId], db.wrap(() => {
                        cb({view, newRole});
                    }))
                }
            }));
        },

        loadTag: function (c, tagId, cb) {
            l("select * from tag where tagId = ?", [tagId])
            c.query("select * from tag where tagId = ?", [tagId], db.wrap((rs) => {
                l("Loaded tag: " + j(rs));
                if (rs.length > 0) {
                    cb(rs[0]);
                }
            }));
        },


        getPatientForUser: function (c, userId, cb) {
            c.query("select u.* from user u, user_patient up where u.userId = up.patientId and up.userId = ?", [userId], db.wrap((rs) => {
                l("Loaded patient", j(rs));
                if (rs.length > 0) {
                    cb(rs[0]);
                } else {
                    cb(null);
                }
            }));
        }
    }
);



// TODO remove this
router.post('/switchRole', (req, res) => dao.switchRole(req.c, req.session.userId, (rs) => res.send(rs)));


router.post('/loginUser', (req, res) => {
    // TODO register user if necessary.
    d(req.body);

    // TODO verify the fbId with facebook.
    l(`/loginUser fbId is ${req.body.fbId}`)
    dao.loadUserByFbId(req.c, req.body.fbId).then((user) => {
        console.log(`User for fbId ${req.body.fbId} is ${JSON.stringify(user)}`)
        if (user != null) {
            req.session.userId = user.userId;

            // Get the current patient for the user.
            dao.getPatientForUser(req.c, user.userId, (patient) => {
                req.session.patientId = user.patientId;
                res.status(200).send({ patient, user });
            });
        }
    });
});


router.post('/tap', function (req, res) {
   var tagId = req.body.tagId
   console.log('tap post tagId: ', tagId)

   tagId ?
       dao.loadTag(req.c, tagId, function (tags) {
           console.log("tag loaded: ", tags)
           res.status(200).send({ tags: tags })
       })
       :
       res.status(200).send({ error: 'tag is undefined' })

})

router.get('/self', (req, res) =>
    res.render('template/self', { fbId: req.query.fbId })       // TODO fbId shouldn't need to be passed to the client.
)

router.get('/',                     (req, res) => res.render('index'))
router.get('/tag',                  (req, res) => res.render('index'))
router.get('/other',                (req, res) => res.render('template/other'))
router.get('/dial',                 (req, res) => res.render('template/dial'))
router.get('/directions',           (req, res) => res.render('template/directions'))
router.get('/caregiver',            (req, res) => res.render('template/caregiver'))
router.get('/notes',                (req, res) => res.render('template/notes'))
router.get('/profile',              (req, res) => res.render('template/profile'))
router.get('/laundry',              (req, res) => res.render('template/laundry'))
router.get('/schedule',             (req, res) => res.render('template/schedule'))
router.get('/moca',                 (req, res) => res.render('template/moca'))


module.exports = router