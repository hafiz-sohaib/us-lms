const student_form = document.getElementById('student_form');
const credential_form = document.getElementById('credential_form');
const display_students = document.getElementById('display_students');
const display_credentials = document.getElementById('display_credentials');
const student_btn = document.querySelector('#student_form .btn');
const credential_btn = document.querySelector('#credential_form .btn');



// ==================== Add New Student ====================
student_form.addEventListener('submit', async event => {
    event.preventDefault();
    student_btn.innerHTML = loader();
    student_btn.setAttribute('disabled', 'disabled');

    const type = (student_form.student_id.value !== "") ? "PUT" : "POST";
    const url = (student_form.student_id.value !== "") ? `/api/v1/students?id=${student_form.student_id.value}` : "/api/v1/students";

    const response = await fetch(url, {
        method: type,
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(student_form)))
    });

    const result = await response.json();
    document.querySelector('.text-danger').innerHTML = "";

    if (result.errors) {
        document.getElementById('roll_error').innerHTML = result.errors.student_roll_number;
        document.getElementById('name_error').innerHTML = result.errors.student_name;
        document.getElementById('email_error').innerHTML = result.errors.student_email;
        document.getElementById('phone_error').innerHTML = result.errors.student_phone;
        document.getElementById('cnic_error').innerHTML = result.errors.student_cnic;
        document.getElementById('year_error').innerHTML = result.errors.student_year;
        document.getElementById('address_error').innerHTML = result.errors.student_address;

        student_btn.innerHTML = "Add Student";
        student_btn.removeAttribute('disabled');
    }

    if (result.error_message) {
        show_error_popup(result.error_message);
        student_btn.innerHTML = "Add Student";
        student_btn.removeAttribute('disabled');
    }

    if (result.success_message) {
        show_success_popup(result.success_message);

        student_form.reset();
        student_form.student_id.value = ""
        document.getElementById('student_roll_number').removeAttribute('readonly');
        document.getElementById('student_email').removeAttribute('readonly');

        student_btn.innerHTML = "Add Student";
        student_btn.removeAttribute('disabled');
        $('#student-modal').modal('hide');

        get_students();
        get_student_for_cred();
        get_students_credentials();
    }
});





// ==================== Get Students ====================
async function get_students(name = "", value = "") {
    display_students.innerHTML = table_loader(8);

    const url = (name != "" && value != "") ? `/api/v1/students?${name}=${value}` : "/api/v1/students";
    const response = await fetch(url);
    const result = await response.json();
    let output = "";

    if (result.students.length > 0) {
        result.students.map((student, index) => {
            output += `<tr class="align-middle text-center">
                <td>${index+1}</td>
                <td>${student.student_name}</td>
                <td>${student.student_email}</td>
                <td>${student.student_roll_number}</td>
                <td>${student.student_year}</td>
                <td>${student.student_phone}</td>
                <td>${student.student_cnic}</td>
                <td>
                    <button type="button" onclick="edit_student('${student._id}')" class="btn p-0 me-3"><i class="fa-solid fa-pen-to-square" style="font-size: 18px"></i></button>
                    <button type="button" onclick="view_student('${student._id}')" class="btn p-0 me-3"><i class="fa-solid fa-eye" style="font-size: 18px"></i></button>
                    <button type="button" onclick="delete_student('${student._id}')" class="btn p-0"><i class="fa-solid fa-trash" style="font-size: 18px"></i></button>
                </td>
            </tr>`;
        })
    }else{
        output += `<tr>
            <td colspan="8" class="text-center fw-bold">No Student Found</td>
        </tr>`;
    }

    display_students.innerHTML = output;
}





// ==================== Search Student ====================
document.getElementById('search_box').addEventListener('keyup', async event => {
    get_students("search", event.target.value);
});





// ==================== Edit Student ====================
async function edit_student(id) {
    const response = await fetch(`/api/v1/students?_id=${id}`);
    const result = await response.json();

    if (result.students.length > 0) {
        result.students.map(student => {
            student_form.student_id.value = student._id;
            student_form.student_roll_number.value = student.student_roll_number;
            student_form.student_name.value = student.student_name;
            student_form.student_email.value = student.student_email;
            student_form.student_phone.value = student.student_phone;
            student_form.student_cnic.value = student.student_cnic;
            student_form.student_year.value = student.student_year;
            student_form.student_address.value = student.student_address;
        });

        document.getElementById('student_roll_number').setAttribute('readonly', true);
        document.getElementById('student_email').setAttribute('readonly', true);
        student_btn.innerHTML = "Update Student";
        $('#student-modal').modal('show');
    }
}





// ==================== View Student ====================
async function view_student(id) {
    const response = await fetch(`/api/v1/students?_id=${id}`);
    const result = await response.json();

    if (result.students.length > 0) {
        result.students.map(student => {
            document.getElementById('v_student_roll_number').value = student.student_roll_number;
            document.getElementById('v_student_name').value = student.student_name;
            document.getElementById('v_student_email').value = student.student_email;
            document.getElementById('v_student_phone').value = student.student_phone;
            document.getElementById('v_student_cnic').value = student.student_cnic;
            document.getElementById('v_student_year').value = student.student_year;
            document.getElementById('v_student_address').value = student.student_address;
        });

        $('#student-view-modal').modal('show');
    }
}





// ==================== Block Student ====================
async function block_student(id) {
    const confirmed = confirm('Are you sure to block this student?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/block/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_students();
        get_students_credentials();
        get_student_for_cred();
    }
}





// ==================== Unblock Student ====================
async function unblock_student(id) {
    const confirmed = confirm('Are you sure to unblock this student?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/unblock/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_students();
        get_students_credentials();
        get_student_for_cred();
    }
}





// ==================== Delete Student ====================
async function delete_student(id) {
    const confirmed = confirm('Are you sure to delete this student?');

    if (confirmed) {
        const response = await fetch(`/api/v1/students/${id}`, { method: "DELETE"});
        const result = await response.json();
        show_success_popup(result.message);
        get_students();
        get_student_for_cred();
        get_students_credentials();
    }
}





// ==================== Get Students Name for Credentials ====================
async function get_student_for_cred() {
    const full_name = document.getElementById('full_name');
    const response = await fetch("/api/v1/c-students");
    const result = await response.json();
    let output = "";

    if (result.students.length > 0) {
        output += `<option selected disabled>Select Student</option>`;
        result.students.map(student => {
            output += `<option value="${student._id}">${student.student_name}</option>`;
        });
    }else{
        output += `<option>No Student Found</option>`;
    }

    full_name.innerHTML = output;
}





// ==================== Select Student Name ====================
document.getElementById('full_name').addEventListener('change', async event => {
    const response = await fetch(`/api/v1/students?_id=${event.target.value}`);
    const result = await response.json();
    
    if (result.students.length > 0) {
        result.students.map(student => {
            document.querySelector('[name="full_name"]').value = student.student_name;
            document.getElementById('email').value = student.student_email;
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
        get_students_credentials();
        get_student_for_cred();
    }
});





// ==================== Get Students Credentials ====================
async function get_students_credentials(name = "", value = "") {
    display_credentials.innerHTML = table_loader(7);

    const url = (name != "" && value != "") ? `/api/v1/auth/credentials?role=¥student¥&&${name}=${value}` : "/api/v1/auth/credentials?role=¥student¥";
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
                    output += `<button type="button" onclick="unblock_student('${credential._id}')" class="btn p-0"><i class="fa-solid fa-user-slash" style="font-size: 18px"></i></button>`;
                }else{
                    output += `<button type="button" onclick="block_student('${credential._id}')" class="btn p-0"><i class="fa-solid fa-user" style="font-size: 18px"></i></button>`;
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
    get_students_credentials("search", event.target.value)
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





get_students();
get_student_for_cred();
get_students_credentials();