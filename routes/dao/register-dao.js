var db = require("./db");

module.exports = {

    /**
     * A promise of the registration corresponding to the given registrationId
     */
    loadRegistration: (c, registrationId) => {
        return db.queryOne(c, "select * from registration where registrationId = ?", [registrationId]);
    },

    // Adds a registration entry for the new user and returns the registration link.
    addRegistration: (c, name, email, phoneNumber, cb) => {
        c.query("select md5(uuid()) as id", [], db.wrap(rs => {
            /*
             create table registration (
             regId integer auto_increment primary key,
             registrationDate datetime not null,
             name varchar(100) not null,
             email varchar(100) not null,
             phoneNumber varchar(100) not null,
             wasEmailed char(1) not null default 'N',
             hasRegistered char(1) not null default 'N',
             registrationLink varchar(200) not null
             )
             */

            var registrationId = rs[0].id;
            var registrationLink = "http://52.88.50.116:7000/register?id=" + registrationId;

            c.query("insert into registration (registrationId, registrationDate, name, email, phoneNumber, registrationLink) values (?,?,?,?,?,?)",
                // TODO: The link needs to either dynamically determined or via configuraiton.
                [registrationId, new Date(), name, email, phoneNumber, registrationLink], db.wrap(rs => {
                    cb(registrationLink);
                })
            );
        }));
    },

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
    registerUser : function(c, auth, registrationId, role) {

        // Load the registration

        return db.queryOne(c,
                "select * from registration where registrationId = ?",
                [registrationId]

            ).then((registration) => {
                // Insert the user

                return db.query(c,
                    "insert into user (tagId, name, email, fbId, fbLink, role, first_name, last_name, locale, timezone) " +
                    "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    ['', auth.name, registration.email, auth.id, auth.link, role, auth.first_name, auth.last_name, auth.locale, auth.timezone]
                );

            }).then(() => {
                // Mark the registration as complete

                return db.query(c,
                    "update registration set hasRegistered = 'Y', registrationDate = ? where registrationId = ?", [new Date(), registrationId]
                );
            });
    }


};