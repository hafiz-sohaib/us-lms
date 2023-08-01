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

exports.manage_admin = async (request, response) => {
    const path = request.path;
    response.render('admin/pages/manage-admin/manage-admin', {title: "Manage Admin", path});
}

exports.upload_notices = async (request, response) => {
    const path = request.path;
    response.render('admin/pages/notices/notices', {title: "Upload Notices", path});
}

exports.exam_duties = async (request, response) => {
    const path = request.path;
    response.render('admin/pages/exams/exam-duties', {title: "Exam Duties", path});
}