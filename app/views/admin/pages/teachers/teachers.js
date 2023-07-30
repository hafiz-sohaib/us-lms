const teacher_form = document.getElementById('teacher_form');
const credential_form = document.getElementById('credential_form');
const display_teachers = document.getElementById('display_teachers');
const display_credentials = document.getElementById('display_credentials');
const teacher_btn = document.querySelector('#teacher_form .btn');
const credential_btn = document.querySelector('#credential_form .btn');



// ==================== Add New Student ====================
teacher_form.addEventListener('submit', async event => {
    event.preventDefault();
    teacher_btn.innerHTML = loader();
    teacher_btn.setAttribute('disabled', 'disabled');

    const type = (teacher_form.teacher_id.value !== "") ? "PUT" : "POST";
    const url = (teacher_form.teacher_id.value !== "") ? `/api/v1/teachers?id=${teacher_form.teacher_id.value}` : "/api/v1/teachers";

    const response = await fetch(url, {
        method: type,
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(teacher_form)))
    });

    const result = await response.json();
    document.querySelector('.text-danger').innerHTML = "";

    if (result.errors) {
        document.getElementById('name_error').innerHTML = result.errors.teacher_name;
        document.getElementById('email_error').innerHTML = result.errors.teacher_email;
        document.getElementById('phone_error').innerHTML = result.errors.teacher_phone;
        document.getElementById('cnic_error').innerHTML = result.errors.teacher_cnic;
        document.getElementById('scale_error').innerHTML = result.errors.teacher_scale;
        document.getElementById('qualification_error').innerHTML = result.errors.teacher_qualification;

        teacher_btn.innerHTML = "Add Teacher";
        teacher_btn.removeAttribute('disabled');
    }

    if (result.error_message) {
        show_error_popup(result.error_message);
        teacher_btn.innerHTML = "Add Teacher";
        teacher_btn.removeAttribute('disabled');
    }

    if (result.success_message) {
        show_success_popup(result.success_message);

        teacher_form.reset();
        teacher_form.teacher_id.value = ""
        document.getElementById('teacher_email').removeAttribute('readonly');

        teacher_btn.innerHTML = "Add Teacher";
        teacher_btn.removeAttribute('disabled');
        $('#teacher-modal').modal('hide');

        get_teachers();
        get_teacher_for_cred();
        get_teachers_credentials();
    }
});





// ==================== Get Students ====================
async function get_teachers(name = "", value = "") {
    display_teachers.innerHTML = table_loader(8);

    const url = (name != "" && value != "") ? `/api/v1/teachers?${name}=${value}` : "/api/v1/teachers";
    const response = await fetch(url);
    const result = await response.json();
    let output = "";

    if (result.teachers.length > 0) {
        result.teachers.map((teacher, index) => {
            output += `<tr class="align-middle text-center">
                <td>${index+1}</td>
                <td>${teacher.teacher_name}</td>
                <td>${teacher.teacher_email}</td>
                <td>${teacher.teacher_phone}</td>
                <td>${teacher.teacher_cnic}</td>
                <td>${teacher.teacher_scale}</td>
                <td>${teacher.teacher_qualification}</td>
                <td>
                    <button type="button" onclick="edit_teacher('${teacher._id}')" class="btn p-0 me-3"><i class="fa-solid fa-pen-to-square" style="font-size: 18px"></i></button>
                    <button type="button" onclick="view_teacher('${teacher._id}')" class="btn p-0 me-3"><i class="fa-solid fa-eye" style="font-size: 18px"></i></button>
                    <button type="button" onclick="delete_teacher('${teacher._id}')" class="btn p-0"><i class="fa-solid fa-trash" style="font-size: 18px"></i></button>
                </td>
            </tr>`;
        })
    }else{
        output += `<tr>
            <td colspan="8" class="text-center fw-bold">No Teacher Found</td>
        </tr>`;
    }

    display_teachers.innerHTML = output;
}





// ==================== Search Student ====================
document.getElementById('search_box').addEventListener('keyup', async event => {
    get_teachers("search", event.target.value);
});





// ==================== Edit Student ====================
async function edit_teacher(id) {
    const response = await fetch(`/api/v1/teachers?_id=${id}`);
    const result = await response.json();

    if (result.teachers.length > 0) {
        result.teachers.map(teacher => {
            teacher_form.teacher_id.value = teacher._id;
            teacher_form.teacher_name.value = teacher.teacher_name;
            teacher_form.teacher_email.value = teacher.teacher_email;
            teacher_form.teacher_phone.value = teacher.teacher_phone;
            teacher_form.teacher_cnic.value = teacher.teacher_cnic;
            teacher_form.teacher_scale.value = teacher.teacher_scale;
            teacher_form.teacher_qualification.value = teacher.teacher_qualification;
        });

        document.getElementById('teacher_email').setAttribute('readonly', true);
        teacher_btn.innerHTML = "Update Teacher";
        $('#teacher-modal').modal('show');
    }
}





// ==================== View Student ====================
async function view_teacher(id) {
    const response = await fetch(`/api/v1/teachers?_id=${id}`);
    const result = await response.json();

    if (result.teachers.length > 0) {
        result.teachers.map(teacher => {
            document.getElementById('v_teacher_name').value = teacher.teacher_name;
            document.getElementById('v_teacher_email').value = teacher.teacher_email;
            document.getElementById('v_teacher_phone').value = teacher.teacher_phone;
            document.getElementById('v_teacher_cnic').value = teacher.teacher_cnic;
            document.getElementById('v_teacher_scale').value = teacher.teacher_scale;
            document.getElementById('v_teacher_qualification').value = teacher.teacher_qualification;
        });

        $('#teacher-view-modal').modal('show');
    }
}





// ==================== Block Student ====================
async function block_teacher(id) {
    const confirmed = confirm('Are you sure to block this teacher?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/block/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_teachers();
        get_teachers_credentials();
        get_teacher_for_cred();
    }
}





// ==================== Unblock Student ====================
async function unblock_teacher(id) {
    const confirmed = confirm('Are you sure to unblock this teacher?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/unblock/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_teachers();
        get_teachers_credentials();
        get_teacher_for_cred();
    }
}





// ==================== Delete Student ====================
async function delete_teacher(id) {
    const confirmed = confirm('Are you sure to delete this teacher?');

    if (confirmed) {
        const response = await fetch(`/api/v1/teachers/${id}`, { method: "DELETE"});
        const result = await response.json();
        show_success_popup(result.message);
        get_teachers();
        get_teacher_for_cred();
        get_teachers_credentials();
    }
}





// ==================== Get Students Name for Credentials ====================
async function get_teacher_for_cred() {
    const full_name = document.getElementById('full_name');
    const response = await fetch("/api/v1/c-teachers");
    const result = await response.json();
    let output = "";

    if (result.teachers.length > 0) {
        output += `<option selected disabled>Select Teacher</option>`;
        result.teachers.map(teacher => {
            output += `<option value="${teacher._id}">${teacher.teacher_name}</option>`;
        });
    }else{
        output += `<option>No Teacher Found</option>`;
    }

    full_name.innerHTML = output;
}





// ==================== Select Student Name ====================
document.getElementById('full_name').addEventListener('change', async event => {
    const response = await fetch(`/api/v1/teachers?_id=${event.target.value}`);
    const result = await response.json();

    if (result.teachers.length > 0) {
        result.teachers.map(teacher => {
            document.querySelector('[name="full_name"]').value = teacher.teacher_name;
            document.getElementById('email').value = teacher.teacher_email;
        });
    }else{
        document.getElementById('email').value = "";
    }
})





// ==================== Create Credentials for Student ====================
credential_form.addEventListener('submit', async event => {
    event.preventDefault();
    credential_btn.innerHTML = loader();
    credential_btn.setAttribute('disabled', 'disabled');

    const response = await fetch("/api/v1/auth/sign-up", {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(credential_form)))
    });

    const result = await response.json();
    document.querySelector('.text-danger').innerHTML = "";

    if (result.errors) {
        document.getElementById('full_name_error').innerHTML = result.errors.full_name;
        document.getElementById('username_error').innerHTML = result.errors.username;
        document.getElementById('emaill_error').innerHTML = result.errors.email;
        document.getElementById('password_error').innerHTML = result.errors.password;

        credential_btn.innerHTML = "Create Credentials";
        credential_btn.removeAttribute('disabled');
    }

    if (result.error_message) {
        show_error_popup(result.error_message);
        credential_btn.innerHTML = "Create Credentials";
        credential_btn.removeAttribute('disabled');
    }

    if (result.success_message) {
        show_success_popup("Credentials successfully created");

        credential_form.reset();
        credential_btn.innerHTML = "Create Credentials";
        credential_btn.removeAttribute('disabled');
        $('#credentials-modal').modal('hide');
        get_teachers_credentials();
        get_teacher_for_cred();
    }
});





// ==================== Get Students Credentials ====================
async function get_teachers_credentials(name = "", value = "") {
    display_credentials.innerHTML = table_loader(7);

    const url = (name != "" && value != "") ? `/api/v1/auth/credentials?role=¥teacher¥&&${name}=${value}` : "/api/v1/auth/credentials?role=¥teacher¥";
    const response = await fetch(url);
    const result = await response.json();
    let output = "";

    if (result.credentials.length > 0) {
        result.credentials.map((credential, index) => {
            output += `<tr class="align-middle text-center">
                <td>${index+1}</td>
                <td>${credential.full_name}</td>
                <td>${credential.username}</td>
                <td>${credential.email}</td>
                <td>${credential.role}</td>
                <td>`;

                if (credential.isBlocked === true) {
                    output += `<button type="button" onclick="unblock_teacher('${credential._id}')" class="btn p-0"><i class="fa-solid fa-user-slash" style="font-size: 18px"></i></button>`;
                }else{
                    output += `<button type="button" onclick="block_teacher('${credential._id}')" class="btn p-0"><i class="fa-solid fa-user" style="font-size: 18px"></i></button>`;
                }

                output +=`</td>
            </tr>`;
        })
    }else{
        output += `<tr>
            <td colspan="6" class="text-center fw-bold">No Credentials Found</td>
        </tr>`;
    }

    display_credentials.innerHTML = output;
}





// ==================== Search Student Credentials ====================
document.getElementById('cred_search_box').addEventListener('keyup', async event => {
    get_teachers_credentials("search", event.target.value)
});





function table_loader(columns) {
    return `<tr>
        <td colspan="${columns}">
            <div class="d-flex justify-content-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        <td>
    </tr>`;
}





function loader() {
    return `<div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
}





get_teachers();
get_teacher_for_cred();
get_teachers_credentials();