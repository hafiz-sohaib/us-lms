const form = document.getElementById('signup_form');
const btn = document.querySelector('#signup_form .btn');


form.addEventListener('submit', async event => {
    event.preventDefault();
    btn.innerHTML = loader();
    btn.setAttribute('disabled', 'disabled');

    const response = await fetch("/api/v1/auth/sign-up", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const result = await response.json();

    if (result.success_message) {
        show_success_popup(result.success_message);
        form.reset();
        btn.innerHTML = 'Sign Up';
        btn.removeAttribute('disabled');
    }

    if (result.errors) {
        show_error_popup(`
            ${result.errors.full_name ? result.errors.full_name+`<br>` : ''}
            ${result.errors.username ? result.errors.username+`<br>` : ''}
            ${result.errors.email ? result.errors.email+`<br>` : ''}
            ${result.errors.password ? result.errors.password+`<br>` : ''}
        `);

        btn.innerHTML = 'Sign Up';
        btn.removeAttribute('disabled');
    }
});






function loader() {
    return `<div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
}