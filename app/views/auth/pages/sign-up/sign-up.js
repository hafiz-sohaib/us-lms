$('#signup_form').submit(event => { 
    event.preventDefault();
    const form = $('#signup_form');

    $('#signup_form .btn').html(`<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>`);
    $('#signup_form .btn').attr('disabled', 'disabled');

    $.post("/api/v1/auth/sign-up", form.serialize(), response => {
        if (response.success_message) {
            show_success_popup(response.success_message);
            form[0].reset(0);
        }

        if (response.errors) {
            show_error_popup(`
                ${response.errors.full_name ? response.errors.full_name+`<br>` : ''}
                ${response.errors.username ? response.errors.username+`<br>` : ''}
                ${response.errors.email ? response.errors.email+`<br>` : ''}
                ${response.errors.password ? response.errors.password+`<br>` : ''}
            `);
        }

        $('#signup_form .btn').html('Sign Up');
        $('#signup_form .btn').removeAttr('disabled');
    });
});