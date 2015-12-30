/// <reference path="../../typings/tsd.d.ts" />
"use strict"

import db from "../dao/db";
import l from "../util/log";
import path = require('path');
import jade = require("jade");
let nodemailer = require("nodemailer");

// TODO Take this from an env var.
var generator = require('xoauth2').createXOAuth2Generator({
    user: 'caregiversense@gmail.com',
    clientId: "679587739404-cqdbea7632tfm23aj19pbl3ep8dq7335.apps.googleusercontent.com",
    clientSecret: "aD8yiMA45TPHjx5trJSirZlX",
    refreshToken: "1/XxYUYGi8w3vW7n3ZXbjPtnNnyxhAdVum1zcosk6CRhA"
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});



export default class MailService {

    static sendMail(c, headers : MailHeaders, template : MailTemplate) {

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { xoauth2 :generator }
        });

        var renderedEmail = jade.renderFile(template.path, template.binds);

        console.log("Sending email: %s", renderedEmail);

        transporter.sendMail({
            from : {
                name: 'Caregiver Sense',
                address: 'caregiversense@gmail.com'
            },
            to          : headers.to,
            subject     : headers.subject,
            priority    : 'high',
            html : renderedEmail,
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent');
                console.dir(response);
                // TODO remember to mark the wasEmailed flag!
            }
        });
    }
}

export class MailHeaders {

    constructor(
        public to : string,         // The email address
        public subject : string     // The subject
    ){}
}

export class MailTemplate {

    constructor(
        public path     : string,   // The path to the jade template
        public binds    : any       // Values to bind to the template
    ){}
}
