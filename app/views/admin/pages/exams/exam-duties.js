$('#exam_form').submit(event => {
    event.preventDefault();
    if ($('#exam_teacher').val() === "No Teacher Found") return show_error_popup("No Teacher Selected");

    $.ajax({
        type: "POST",
        url: "/api/v1/exams",
        data: $('#exam_form').serialize(),
        success: function (response) {
            if (response.message) {
                show_success_popup(response.message);
                $('#exam-modal').modal('hide');
                get_teachers();
                get_exam_duties();
            }

            if (response.errors) {
                show_error_popup(`
                    ${response.errors.exam_teacher ? response.errors.exam_teacher+`<br>` : ''}
                    ${response.errors.exam_shift ? response.errors.exam_shift+`<br>` : ''}
                    ${response.errors.exam_room ? response.errors.exam_room : ''}
                `);
            }
        }
    });
});





function get_teachers() {
    $('#exam_teacher').attr('disabled', 'disabled');

    $.get("/api/v1/teachers", response => {
        let output = "";

        if (response.teachers.length > 0) {
            response.teachers.map(teacher => {
                output += `<option value="${teacher.teacher_name}">${teacher.teacher_name}</option>`;
            })
        }else{
            output += `<option>No Teacher Found</option>`;
        }

        $('#exam_teacher').removeAttr('disabled');
        $('#exam_teacher').html(output);
    });
}





function get_exam_duties() {
    $('#display_exam_duties').html(teacher_loader());

    $.get("/api/v1/exams", response => {
        let output = "";

        if (response.exams.length > 0) {
            response.exams.map((exam, index) => {
                output += `<tr class="align-middle text-center">
                    <td>${index+1}</td>
                    <td>${exam.exam_teacher}</td>
                    <td>${exam.exam_shift}</td>
                    <td>${exam.exam_room}</td>
                    <td>
                        <button type="button" onclick="delete_duty('${exam._id}')" class="btn p-0"><i class="fa-solid fa-trash" style="font-size: 18px"></i></button>
                    </td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="5" class="text-center">No Duty Found</td>
            </tr>`;
        }

        $('#display_exam_duties').html(output);
    });
}





function delete_duty(id) {
    const confirmed = confirm('Are you sure to delete this duty?');

    if (confirmed) {
        $.ajax({
            type: "DELETE",
            url: `/api/v1/exams/${id}`,
            success: function (response) {
                show_success_popup(response.message);
                get_teachers();
                get_exam_duties();
            }
        });
    }
}





function teacher_loader() {
    return `<tr>
        <td colspan="8">
            <div class="d-flex justify-content-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        <td>
    </tr>`;
}



get_teachers();
get_exam_duties();