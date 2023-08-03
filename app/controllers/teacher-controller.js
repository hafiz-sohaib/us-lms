exports.dashboard = (request, response) => {
    const path = request.path;
    response.render('teacher/pages/dashboard/dashboard', {title: "Dashboard", path});
}


exports.profile = (request, response) => {
    const path = request.path;
    response.render('teacher/pages/profile/profile', {title: "Profile", path});
}


exports.send_notification = (request, response) => {
    const path = request.path;
    response.render('teacher/pages/notification/notification', {title: "Send Notification", path});
}