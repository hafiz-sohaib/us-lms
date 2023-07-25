const jwt = require('jsonwebtoken');
const Auth = require('../models/auth-model');


exports.isLoggedIn = async (request, response, next) => {
    try {
        const token = request.cookies.lms_access_token;
        if (!token) return response.redirect('/auth/sign-in');

        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.log(error)
        return response.redirect('/auth/sign-in');
    }
}




exports.getLoggedinUser = async (request, response, next) => {
    try {
        const token = request.cookies.lms_access_token;
        if (!token) {
            response.locals.user = null;
            next();
        }else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await Auth.findById(decoded.id);
            if (!user) {
                response.clearCookie('lms_access_token', { httpOnly: true, secure: true });
                return response.redirect('/auth/sign-in');
            }else{
                response.locals.user = user;
                next();
            }
        }
    } catch (error) {
        response.locals.user = null;
        next();
    }
}




exports.isAdmin = async (request, response, next) => {
    const { email } = response.locals.user;
    const findAdmin = await Auth.findOne({email});
    if (findAdmin.role !== '¥admin¥') return response.redirect('/error');
    next();
}




exports.isTeacher = async (request, response, next) => {
    const { email } = response.locals.user;
    const findAdmin = await Auth.findOne({email});
    if (findAdmin.role !== '¥teacher¥') return response.redirect('/error');
    next();
}




exports.isStudent = async (request, response, next) => {
    const { email } = response.locals.user;
    const findAdmin = await Auth.findOne({email});
    if (findAdmin.role !== '¥student¥') return response.redirect('/error');
    next();
}