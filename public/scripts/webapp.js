$(document).ready(function () {
    // Test for session data
    var session = Lockr.get('session', null);
    if (session) {
        console.log('You are logged in');
    } else {
        console.warn('You are not logged in');
        var username = window.prompt("Please enter your mookit username");
        if (username) {
            console.log('You said your username is: ' + username);
            $.ajax({
                method: "POST",
                url: "/api/auth",
                data: {username: username}
            }).done(function (data) {
                if (data.code === 0) {
                    Lockr.set('session', data.msg);
                    console.log('Session set');
                } else {
                    console.error(data.msg);
                }
            });
        } else {
            console.warn("Please tell your mookit username to continue. Refresh to re-start");
        }
    }
});