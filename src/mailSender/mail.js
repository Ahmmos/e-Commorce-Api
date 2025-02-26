

import { createTransport } from "nodemailer";
import { emailHtml } from "./emailHTML.js";
import jwt from "jsonwebtoken";



export const sendEmail = async (email) => {
    const transporter = createTransport({
        service: "gmail",
        auth: {
            user: "mrahmmos@gmail.com",
            pass: "muubzkzrsxmerhzu",
        },
    });

    jwt.sign({ email }, process.env.JWT_SECRET_KEY, async (err, token) => {
        if (err) throw new Error("error in jwt.sign");
        const info = await transporter.sendMail({
            from: '"Ahmeos e-commerce webApp" <mrahmmos@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "sign up email confirmation", // Subject line
            html: await emailHtml(token), // html body
        });

        console.log("confirmation e-mail sent", info.messageId)
    });

}



