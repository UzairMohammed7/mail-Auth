import {transporter} from "./Email.config.js";
import { 
    Verification_Email_Template, 
    Welcome_Email_Template, 
    Password_Reset_Request_Template,
    Password_Reset_Success_Template 
} from "./EmailTemplate.js";

export const sendEmailVerification = async(email, verificationToken) => {
    try {
        const response = await transporter.sendMail({
            from: '"Uzair" <uzairmohammed.777@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Verify Your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationToken}",verificationToken)
          });
          console.log("Email Sent Successfully", response);
    } catch (error) {
        console.log("Email Sent Error: " + error)
    }
}

export const sendWelcomeEmail = async(email, name) => {
    try {
        const response = await transporter.sendMail({
            from: '"Uzair" <uzairmohammed.777@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome", // Subject line
            text: "Welcome", // plain text body
            html: Welcome_Email_Template.replace("{name}", name), // html body
          });
          console.log("Email Sent Successfully", response);
    } catch (error) {
        console.log("Email Sent Error: " + error)
    }
}

export const sendResetPasswordEmail = async(email, resetURL) => {
    try {
        const response = await transporter.sendMail({
            from: '"Uzair" <uzairmohammed.777@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Password Reset Request", // Subject line
            text: "Password Reset Request", // plain text body
            html: Password_Reset_Request_Template.replace("{resetURL}", resetURL) // html body
            // html: `Click on the following link to reset your password: <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>` // html body
          });
          console.log("Email Sent Successfully", response);
    } catch (error) {
        console.log("Email Sent Error: " + error)
    }
}

export const sendPasswordResetSuccessEmail = async(email) => {
    try {
    const response = await transporter.sendMail({
       from: '"Uzair" <uzairmohammed.777@gmail.com>', // sender address
       to: email, // list of receivers
       subject: "Password Reset Successful", // Subject line
       text: "Password Reset Successful", // plain text body
       html: Password_Reset_Success_Template // html body
    });
      console.log("Email Sent Successfully", response);
    } catch (error) {
    console.log("Email Sent Error: " + error)
    }
}