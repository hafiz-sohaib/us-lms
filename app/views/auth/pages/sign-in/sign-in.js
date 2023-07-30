const form = document.getElementById('signin_form');
const btn = document.querySelector('#signin_form .btn');


form.addEventListener('submit', async event => {
    event.preventDefault();
    btn.innerHTML = loader();
    btn.setAttribute('disabled', 'disabled');

    const response = await fetch("/api/v1/auth/sign-in", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    const result = await response.json();

    if (result.error_message) {
        show_error_popup(result.error_message);
        form.reset();
        btn.innerHTML = 'Sign Up';
        btn.removeAttribute('disabled');
    }else{
        location.reload();
    }
});






function loader() {
    return `<div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>`;
}