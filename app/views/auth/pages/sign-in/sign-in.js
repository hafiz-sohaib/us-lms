$('#signin_form').submit(event => { 
    event.preventDefault();
    const form = $('#signin_form');

    $('#signin_form .btn').html(`<div class="spinner-border spinner-border-sm text-light" role="status"><span class="visually-hidden">Loading...</span></div>`);
    $('#signin_form .btn').attr('disabled', 'disabled');

    $.post("/api/v1/auth/sign-in", form.serialize(), response => {
        if (response.error_message) {
            show_error_popup(response.error_message);

            $('#signin_form .btn').html('Sign Up');
            $('#signin_form .btn').removeAttr('disabled');
        }else{
            location.reload();
        }
    });
});