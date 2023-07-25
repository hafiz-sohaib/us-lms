const quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: 'Post Description...'
});

quill.on('text-change', function (delta, oldDelta, source) {
    $('[name="notice_content"]').val(quill.root.innerHTML);
});


$('#notice_form').submit(event => {
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "/api/v1/notices",
        data: $('#notice_form').serialize(),
        success: function (response) {
            get_student_notices();
            get_teacher_notices();
            show_success_popup(response.message);
            $('#notice-modal').modal('hide');
        }
    });
});





function get_student_notices() {
    $('#display_student_notices').html(teacher_loader());

    $.get("/api/v1/notices?notice_roll=for-students", response => {
        let output = "";

        if (response.notices.length > 0) {
            response.notices.map((notice, index) => {
                output += `<tr class="align-middle text-center">
                    <td>${index+1}</td>
                    <td>${notice.notice_title}</td>
                    <td>${notice.notice_roll}</td>
                    <td>`;

                    if (notice.notice_periority === "high") {
                        output += `<span class="badge bg-danger py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }else if (notice.notice_periority === "normal") {
                        output += `<span class="badge bg-warning py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }else if (notice.notice_periority === "low") {
                        output += `<span class="badge bg-info py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }

                    output += `</td>
                    <td>${truncateFormattedText(notice.notice_content, 2)}...</td>
                    <td>
                        <button type="button" onclick="delete_notice('${notice._id}')" class="btn btn-gray-800 me-2">Delete</button>
                    </td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="8" class="text-center">No Notice Found</td>
            </tr>`;
        }

        $('#display_student_notices').html(output);
    });
}





function get_teacher_notices() {
    $('#display_teacher_notices').html(teacher_loader());

    $.get("/api/v1/notices?notice_roll=for-teachers", response => {
        let output = "";

        if (response.notices.length > 0) {
            response.notices.map((notice, index) => {
                output += `<tr class="align-middle text-center">
                    <td>${index+1}</td>
                    <td>${notice.notice_title}</td>
                    <td>${notice.notice_roll}</td>
                    <td>`;

                    if (notice.notice_periority === "high") {
                        output += `<span class="badge bg-danger py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }else if (notice.notice_periority === "normal") {
                        output += `<span class="badge bg-warning py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }else if (notice.notice_periority === "low") {
                        output += `<span class="badge bg-info py-1 px-3" style="margin: 0 !important; font-size: .875rem !important;">${notice.notice_periority}</span>`;
                    }

                    output += `</td>
                    <td>${truncateFormattedText(notice.notice_content, 2)}...</td>
                    <td>
                        <button type="button" onclick="delete_notice('${notice._id}')" class="btn btn-gray-800 me-2">Delete</button>
                    </td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="8" class="text-center">No Notice Found</td>
            </tr>`;
        }

        $('#display_teacher_notices').html(output);
    });
}





function delete_notice(id) {
    const confirmed = confirm('Are you sure to delete this notice?');

    if (confirmed) {
        $.ajax({
            type: "DELETE",
            url: `/api/v1/notices/${id}`,
            success: function (response) {
                show_success_popup(response.message);
                get_student_notices();
                get_teacher_notices();
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



get_student_notices();
get_teacher_notices();