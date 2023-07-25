exports.dashboard = (request, response) => {
    const path = request.path;
    response.render('teacher/pages/dashboard/dashboard', {title: "Dashboard", path});
}