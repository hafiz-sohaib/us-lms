exports.dashboard = (request, response) => {
    const path = request.path;
    response.render('student/pages/dashboard/dashboard', {title: "Dashboard", path});
}



exports.assignments = (request, response) => {
    const path = request.path;
    response.render('pages/student/assignments/assignments', {title: "Assignments", path});
}



exports.notes = (request, response) => {
    const path = request.path;
    response.render('pages/student/notes/notes', {title: "Notes", path});
}



exports.opportunities = (request, response) => {
    const path = request.path;
    response.render('pages/student/opportunities/opportunities', {title: "Opportunities", path});
}



exports.timetable = (request, response) => {
    const path = request.path;
    response.render('pages/student/timetable/timetable', {title: "Timetable", path});
}



exports.notice_board = (request, response) => {
    const path = request.path;
    response.render('pages/student/notice-board/notice-board', {title: "Notice Board", path});
}



exports.chat = (request, response) => {
    const path = request.path;
    response.render('pages/student/chat/chat', {title: "Chat", path});
}