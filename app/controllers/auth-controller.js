exports.sign_up = (request, response) => {
    if (request.cookies.lms_access_token) {
        if (response.locals.user.role === '¥admin¥') return response.redirect('/admin/dashboard');
        if (response.locals.user.role === '¥teacher¥') return response.redirect('/teacher/dashboard');
        return response.redirect('/student/dashboard');
    }else{
        response.render('auth/pages/sign-up/sign-up', {title: "Sign Up"});
    }
}



exports.sign_in = (request, response) => {
    if (request.cookies.lms_access_token) {
        if (response.locals.user.role === '¥admin¥') return response.redirect('/admin/dashboard');
        if (response.locals.user.role === '¥teacher¥') return response.redirect('/teacher/dashboard');
        return response.redirect('/student/dashboard');
    }else{
        response.render('auth/pages/sign-in/sign-in', {title: "Sign In"});
    }
}