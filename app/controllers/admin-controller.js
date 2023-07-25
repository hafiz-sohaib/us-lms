exports.dashboard = (request, response) => {
    const path = request.path;
    response.render('admin/pages/dashboard/dashboard', {title: "Dashboard", path});
}

exports.profile = (request, response) => {
    const path = request.path;
    response.render('admin/pages/account/profile', {title: "Profile", path});
}




exports.students = async (request, response) => {
    const path = request.path;
    response.render('admin/pages/students/students', {title: "Manage Students", path});
}

exports.teachers = async (request, response) => {
    const path = request.path;
    response.render('admin/pages/teachers/teachers', {title: "Manage Teachers", path});
}