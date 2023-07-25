$('#teacher_form').submit(event => {
    event.preventDefault();

    const type = (event.target.teacher_id.value!=="") ? "PUT" : "POST";
    const url = (event.target.teacher_id.value!=="") ? `/api/v1/teachers?id=${event.target.teacher_id.value}` : "/api/v1/teachers";

    $('#teacher_form .btn').html(`<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>`);
    $('#teacher_form .btn').attr('disabled', 'disabled');

    $.ajax({
        type,
        url,
        data: $('#teacher_form').serialize(),
        success: function (response) {
            $('.text-danger').html("");

            if (response.errors) {
                $('#roll_error').html(response.errors.teacher_roll_number);
                $('#name_error').html(response.errors.teacher_name);
                $('#email_error').html(response.errors.teacher_email);
                $('#phone_error').html(response.errors.teacher_phone);
                $('#cnic_error').html(response.errors.teacher_cnic);
                $('#year_error').html(response.errors.teacher_year);
                $('#address_error').html(response.errors.teacher_address);

                $('#teacher_form .btn').html('Update teacher');
                $('#teacher_form .btn').removeAttr('disabled');
            }

            if (response.success_message) {
                if (type === "POST") {
                    $.post("/api/v1/auth/sign-up", response.auth_data, result => {
                        show_success_popup(response.success_message);
                        $('#teacher_form')[0].reset();
                        event.target.teacher_id.value = ""
                        $('#teacher_roll_number').attr('readonly', false);
                        $('#teacher_email').attr('readonly', false);
                        $('#teacher_form .btn').html('Add teacher');
                        $('#teacher_form .btn').removeAttr('disabled');
                    });
                }else{
                    show_success_popup(response.success_message);
                    $('#teacher_form')[0].reset();
                    event.target.teacher_id.value = ""
                    $('#teacher_roll_number').attr('readonly', false);
                    $('#teacher_email').attr('readonly', false);
                    $('#teacher_form .btn').html('Add teacher');
                    $('#teacher_form .btn').removeAttr('disabled');
                }

                get_teachers();
                get_teachers_credentials();
            }
        }
    });
});





function get_teachers() {
    $('#display_teachers').html(teacher_loader());

    $.get("/api/v1/teachers", response => {
        let output = "";

        if (response.teachers.length > 0) {
            response.teachers.map((teacher, index) => {
                output += `<tr class="align-middle">
                    <td>${index+1}</td>
                    <td>${teacher.teacher_name}</td>
                    <td>${teacher.teacher_email}</td>
                    <td>${teacher.teacher_roll_number}</td>
                    <td>${teacher.teacher_year}</td>
                    <td>${teacher.teacher_phone}</td>
                    <td>${teacher.teacher_cnic}</td>
                    <td>
                        <button type="button" onclick="edit_teacher('${teacher._id}')" class="btn btn-gray-800">Edit</button>
                        <button type="button" onclick="delete_teacher('${teacher._id}')" class="btn btn-gray-800 me-2">Delete</button>
                    </td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="8" class="text-center">No teacher Found</td>
            </tr>`;
        }

        $('#display_teachers').html(output);
    });
}





function get_teachers_credentials() {
    $('#display_teachers_auth').html(teacher_loader());

    $.get("/api/v1/teachers-cred", response => {
        let output = "";
        
        if (response.credentials.length > 0) {
            response.credentials.map((credentials, index) => {
                output += `<tr class="align-middle text-center">
                    <td>${index+1}</td>
                    <td>${credentials.full_name}</td>
                    <td>${credentials.username}</td>
                    <td>${credentials.email}</td>
                    <td>${credentials.password}</td>
                    <td>
                        <button type="button" onclick="send_credentials('${credentials.id}')" class="btn btn-gray-800 me-2">Send to teacher</button>`;

                        if ((response.auth[index]._id == credentials.id)) {
                            if (response.auth[index].isBlocked === true) {
                                output += `<button type="button" onclick="unblock_teacher('${credentials.id}')" class="btn btn-gray-800 me-2">Unblock</button>`;
                            }else{
                                output += `<button type="button" onclick="block_teacher('${credentials.id}')" class="btn btn-gray-800 me-2">Block</button>`;
                            }
                        }

                    output +=`</td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="8" class="text-center">No Credentials Found</td>
            </tr>`;
        }

        $('#display_teachers_auth').html(output);
    });
}





function edit_teacher(id) {
    const form = document.getElementById('teacher_form');

    $.get(`/api/v1/teachers?_id=${id}`, response => {
        if (response.teachers.length > 0) {
            response.teachers.map(teacher => {
                form.teacher_id.value = teacher._id;
                form.teacher_roll_number.value = teacher.teacher_roll_number;
                form.teacher_name.value = teacher.teacher_name;
                form.teacher_email.value = teacher.teacher_email;
                form.teacher_phone.value = teacher.teacher_phone;
                form.teacher_cnic.value = teacher.teacher_cnic;
                form.teacher_year.value = teacher.teacher_year;
                form.teacher_address.value = teacher.teacher_address;

                $('#teacher_name').focus();
                $('#teacher_roll_number').attr('readonly', true);
                $('#teacher_email').attr('readonly', true);
                $('#teacher_form .btn').html("Update teacher");
            })
        }
    });
}





function delete_teacher(id) {
    const confirmed = confirm('Are you sure to delete this teacher?');

    if (confirmed) {
        $.ajax({
            type: "DELETE",
            url: `/api/v1/teachers/${id}`,
            success: function (response) {
                show_success_popup(response.message);
                get_teachers();
                get_teachers_credentials();
            }
        });
    }
}





function send_credentials(id) {
    const confirmed = confirm('Are you sure to send to teacher?');

    if (confirmed) {
        $.ajax({
            type: "POST",
            url: `/api/v1/teachers-cred-send`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_teachers();
                get_teachers_credentials();
            }
        });
    }
}





function block_teacher(id) {
    const confirmed = confirm('Are you sure to block this teacher?');

    if (confirmed) {
        $.ajax({
            type: "PUT",
            url: `/api/v1/auth/block`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_teachers();
                get_teachers_credentials();
            }
        });
    }
}





function unblock_teacher(id) {
    const confirmed = confirm('Are you sure to unblock this teacher?');

    if (confirmed) {
        $.ajax({
            type: "PUT",
            url: `/api/v1/auth/unblock`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_teachers();
                get_teachers_credentials();
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
get_teachers_credentials();