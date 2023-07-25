const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


exports.errorHandler = (error, model_name) => {
    let errors = {};

    if (error.code === 11000) {
        Object.keys(error.keyValue).forEach(elem=> {
            errors[elem] = `This ${elem} is taken`;
        })
        return errors;
    }

    if (error.message.includes(`${model_name} validation failed`)) {
        Object.values(error.errors).map(({properties}) => {
            errors[properties.path] = properties.message;
        })
        return errors;
    }
}




exports.generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}




exports.sendEmail = async (data, request, response) => {
    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        // secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transport.sendMail(data);
}