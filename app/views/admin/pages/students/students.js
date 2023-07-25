$('#student_form').submit(event => {
    event.preventDefault();

    const type = (event.target.student_id.value!=="") ? "PUT" : "POST";
    const url = (event.target.student_id.value!=="") ? `/api/v1/students?id=${event.target.student_id.value}` : "/api/v1/students";

    $('#student_form .btn').html(`<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>`);
    $('#student_form .btn').attr('disabled', 'disabled');

    $.ajax({
        type,
        url,
        data: $('#student_form').serialize(),
        success: function (response) {
            $('.text-danger').html("");

            if (response.errors) {
                $('#roll_error').html(response.errors.student_roll_number);
                $('#name_error').html(response.errors.student_name);
                $('#email_error').html(response.errors.student_email);
                $('#phone_error').html(response.errors.student_phone);
                $('#cnic_error').html(response.errors.student_cnic);
                $('#year_error').html(response.errors.student_year);
                $('#address_error').html(response.errors.student_address);

                $('#student_form .btn').html('Update Student');
                $('#student_form .btn').removeAttr('disabled');
            }

            if (response.success_message) {
                if (type === "POST") {
                    $.post("/api/v1/auth/sign-up", response.auth_data, result => {
                        show_success_popup(response.success_message);
                        $('#student_form')[0].reset();
                        event.target.student_id.value = ""
                        $('#student_roll_number').attr('readonly', false);
                        $('#student_email').attr('readonly', false);
                        $('#student_form .btn').html('Add Student');
                        $('#student_form .btn').removeAttr('disabled');
                    });
                }else{
                    show_success_popup(response.success_message);
                    $('#student_form')[0].reset();
                    event.target.student_id.value = ""
                    $('#student_roll_number').attr('readonly', false);
                    $('#student_email').attr('readonly', false);
                    $('#student_form .btn').html('Add Student');
                    $('#student_form .btn').removeAttr('disabled');
                }

                get_students();
                get_students_credentials();
            }
        }
    });
});





function get_students() {
    $('#display_students').html(student_loader());

    $.get("/api/v1/students", response => {
        let output = "";

        if (response.students.length > 0) {
            response.students.map((student, index) => {
                output += `<tr class="align-middle">
                    <td>${index+1}</td>
                    <td>${student.student_name}</td>
                    <td>${student.student_email}</td>
                    <td>${student.student_roll_number}</td>
                    <td>${student.student_year}</td>
                    <td>${student.student_phone}</td>
                    <td>${student.student_cnic}</td>
                    <td>
                        <button type="button" onclick="edit_student('${student._id}')" class="btn btn-gray-800">Edit</button>
                        <button type="button" onclick="delete_student('${student._id}')" class="btn btn-gray-800 me-2">Delete</button>
                    </td>
                </tr>`;
            })
        }else{
            output += `<tr>
                <td colspan="8" class="text-center">No Student Found</td>
            </tr>`;
        }

        $('#display_students').html(output);
    });
}





function get_students_credentials() {
    $('#display_students_auth').html(student_loader());

    $.get("/api/v1/students-cred", response => {
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
                        <button type="button" onclick="send_credentials('${credentials.id}')" class="btn btn-gray-800 me-2">Send to Student</button>`;

                        if ((response.auth[index]._id == credentials.id)) {
                            if (response.auth[index].isBlocked === true) {
                                output += `<button type="button" onclick="unblock_student('${credentials.id}')" class="btn btn-gray-800 me-2">Unblock</button>`;
                            }else{
                                output += `<button type="button" onclick="block_student('${credentials.id}')" class="btn btn-gray-800 me-2">Block</button>`;
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

        $('#display_students_auth').html(output);
    });
}





function edit_student(id) {
    const form = document.getElementById('student_form');

    $.get(`/api/v1/students?_id=${id}`, response => {
        if (response.students.length > 0) {
            response.students.map(student => {
                form.student_id.value = student._id;
                form.student_roll_number.value = student.student_roll_number;
                form.student_name.value = student.student_name;
                form.student_email.value = student.student_email;
                form.student_phone.value = student.student_phone;
                form.student_cnic.value = student.student_cnic;
                form.student_year.value = student.student_year;
                form.student_address.value = student.student_address;

                $('#student_name').focus();
                $('#student_roll_number').attr('readonly', true);
                $('#student_email').attr('readonly', true);
                $('#student_form .btn').html("Update Student");
            })
        }
    });
}





function delete_student(id) {
    const confirmed = confirm('Are you sure to delete this student?');

    if (confirmed) {
        $.ajax({
            type: "DELETE",
            url: `/api/v1/students/${id}`,
            success: function (response) {
                show_success_popup(response.message);
                get_students();
                get_students_credentials();
            }
        });
    }
}





function send_credentials(id) {
    const confirmed = confirm('Are you sure to send to student?');

    if (confirmed) {
        $.ajax({
            type: "POST",
            url: `/api/v1/students-cred-send`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_students();
                get_students_credentials();
            }
        });
    }
}





function block_student(id) {
    const confirmed = confirm('Are you sure to block this student?');

    if (confirmed) {
        $.ajax({
            type: "PUT",
            url: `/api/v1/auth/block`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_students();
                get_students_credentials();
            }
        });
    }
}





function unblock_student(id) {
    const confirmed = confirm('Are you sure to unblock this student?');

    if (confirmed) {
        $.ajax({
            type: "PUT",
            url: `/api/v1/auth/unblock`,
            data: {id},
            success: function (response) {
                show_success_popup(response.message);
                get_students();
                get_students_credentials();
            }
        });
    }
}





function student_loader() {
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



get_students();
get_students_credentials();