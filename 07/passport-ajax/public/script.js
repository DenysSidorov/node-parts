window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');

  if (!form) return;

  form.onsubmit = function(event) {
    event.preventDefault();

    fetch("/login", {
      method: "POST",
      credentials: "include", // "omit" by default, for cookies to work
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email: this.email.value,
        password: this.password.value,
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        alert(response.error.message);
      } else if (response.displayName) {
        alert("Welcome, " + response.displayName);
        window.location.reload(true);
      } else {
        throw new Error("Invalid response from the server");
      }
    })
    .catch(function(err) {
      alert("Error: " + err.message);
    });
  }

});
