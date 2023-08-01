const form = document.getElementById('admin_form');
const display_admins = document.getElementById('display_admins');
const btn = document.querySelector('#admin_form .btn');



// ==================== Add New Student ====================
form.addEventListener('submit', async event => {
    event.preventDefault();
    btn.innerHTML = loader();
    btn.setAttribute('disabled', 'disabled');

    const type = (form.admin_id.value !== "") ? "PUT" : "POST";
    const url = (form.admin_id.value !== "") ? `/api/v1/auth/admin/${form.admin_id.value}` : "/api/v1/auth/admin";

    const response = await fetch(url, {
        method: type,
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const result = await response.json();
    document.querySelector('.text-danger').innerHTML = "";

    if (result.errors) {
        document.getElementById('name_error').innerHTML = result.errors.full_name;
        document.getElementById('username_error').innerHTML = result.errors.username;
        document.getElementById('email_error').innerHTML = result.errors.email;
        document.getElementById('password_error').innerHTML = result.errors.password;

        btn.innerHTML = "Add Admin";
        btn.removeAttribute('disabled');
    }

    if (result.error_message) {
        show_error_popup(result.error_message);
        btn.innerHTML = "Add Admin";
        btn.removeAttribute('disabled');
    }

    if (result.success_message) {
        show_success_popup(result.success_message);

        form.reset();
        form.admin_id.value = ""

        btn.innerHTML = "Add Admin";
        btn.removeAttribute('disabled');
        $('#admin-modal').modal('hide');
        get_admins();
    }
});





// ==================== Get Students ====================
async function get_admins(name = "", value = "") {
    display_admins.innerHTML = table_loader(7);

    const url = (name != "" && value != "") ? `/api/v1/auth/credentials?role=¥admin¥&&${name}=${value}` : "/api/v1/auth/credentials?role=¥admin¥";
    const response = await fetch(url);
    const result = await response.json();

    let output = "";
    let ind;

    for (let index = 0; index < result.credentials.length; index++) {
        const response_1 = await fetch(`/api/v1/auth/pass/${result.credentials[index]._id}`);
        ind = await response_1.json();
    }

    if (result.credentials.length > 0) {
        result.credentials.map((credential, index) => {
            output += `<tr class="align-middle text-center">
                <td>${index+1}</td>
                <td>${credential.full_name}</td>
                <td>${credential.username}</td>
                <td>${credential.email}</td>
                <td>${ind.pass.password}</td>`;

                if (credential.role === '¥admin¥') {
                    output += `<td><span class="badge badge-lg bg-info m-0">Admin</span></td>`;
                }

                output += `<td>`;

                if (index > 0) {
                    if (credential.isBlocked === true) {
                        output += `<button type="button" onclick="unblock_admin('${credential._id}')" class="btn p-0 me-3"><i class="fa-solid fa-user-slash" style="font-size: 18px"></i></button>`;
                    }else{
                        output += `<button type="button" onclick="block_admin('${credential._id}')" class="btn p-0 me-3"><i class="fa-solid fa-user" style="font-size: 18px"></i></button>`;
                    }

                    output += `<button type="button" onclick="delete_admin('${credential._id}')" class="btn p-0"><i class="fa-solid fa-trash" style="font-size: 18px"></i></button>`;
                }

                output +=`</td>
            </tr>`;
        })
    }else{
        output += `<tr>
            <td colspan="7" class="text-center fw-bold">No Credentials Found</td>
        </tr>`;
    }

    display_admins.innerHTML = output;
}





// ==================== Block Student ====================
async function block_admin(id) {
    const confirmed = confirm('Are you sure to block this admin?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/block/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_admins();
    }
}





// ==================== Unblock Student ====================
async function unblock_admin(id) {
    const confirmed = confirm('Are you sure to unblock this admin?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/unblock/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json'}
        });

        const result = await response.json();

        show_success_popup(result.message);
        get_admins();
    }
}





// ==================== Delete Student ====================
async function delete_admin(id) {
    const confirmed = confirm('Are you sure to delete this admin?');

    if (confirmed) {
        const response = await fetch(`/api/v1/auth/admin/${id}`, { method: "DELETE"});
        const result = await response.json();
        show_success_popup(result.message);
        get_admins();
    }
}





// ==================== Search Student Credentials ====================
document.getElementById('search_box').addEventListener('keyup', async event => {
    get_admins("search", event.target.value)
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





get_admins();