/// <reference path="../../typings/tsd.d.ts" />
"use strict";
var jade = require("jade");
var nodemailer = require("nodemailer");
// TODO Take this from an env var.
var generator = require('xoauth2').createXOAuth2Generator({
    user: 'caregiversense@gmail.com',
    clientId: "679587739404-cqdbea7632tfm23aj19pbl3ep8dq7335.apps.googleusercontent.com",
    clientSecret: "aD8yiMA45TPHjx5trJSirZlX",
    refreshToken: "1/XxYUYGi8w3vW7n3ZXbjPtnNnyxhAdVum1zcosk6CRhA"
});
// listen for token updates
// you probably want to store these to a db
generator.on('token', function (token) {
    console.log('New token for %s: %s', token.user, token.accessToken);
});
var MailService = (function () {
    function MailService() {
    }
    MailService.sendMail = function (c, headers, template) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { xoauth2: generator }
        });
        var renderedEmail = jade.renderFile(template.path, template.binds);
        console.log("Sending email: %s", renderedEmail);
        transporter.sendMail({
            from: {
                name: 'Caregiver Sense',
                address: 'caregiversense@gmail.com'
            },
            to: headers.to,
            subject: headers.subject,
            priority: 'high',
            html: renderedEmail
        }, function (error, response) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Message sent');
                console.dir(response);
            }
        });
    };
    return MailService;
})();
exports.__esModule = true;
exports["default"] = MailService;
var MailHeaders = (function () {
    function MailHeaders(to, // The email address
        subject // The subject
        ) {
        this.to = to;
        this.subject = subject;
    }
    return MailHeaders;
})();
exports.MailHeaders = MailHeaders;
var MailTemplate = (function () {
    function MailTemplate(path, // The path to the jade template
        binds // Values to bind to the template
        ) {
        this.path = path;
        this.binds = binds;
    }
    return MailTemplate;
})();
exports.MailTemplate = MailTemplate;
//# sourceMappingURL=mail.js.map