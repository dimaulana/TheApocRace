	var socket = io();
	//making menu builder here as it will be used to pass socket to player creation
	var menuBuilder = new MenuBuilder(socket);

	var buttonClicked;

	$("button").click(function() {
		buttonClicked = $(this).attr("id");
	});



	function validate() {
		var user = $('#account-username').val();
		var pw = $('#account-password').val();

		switch (buttonClicked) {
			case "signIn":
				socket.emit('signIn', {username: user, password: pw});
				break;

			case "signUp":
				socket.emit('signUp', {username: user, password: pw});
				break;

			case "forgotPass":
				showHideResetPassword(true);
				break;

			case "resetPass":
				socket.emit('resetPassword', {username: user, password: pw});
				break;

		}
	}

	function showHideResetPassword(show) {

		var display;
		var resetDisplay;
		var placeholder;

		var passElement  = document.getElementById("account-password");
		if (show) {
			placeholder = "New Password";
			passElement.value = "";

			display = "none";
			resetDisplay = "inline";
		}

		else {
			placeholder = "Password";
			display = "inline";
			resetDisplay = "none";
		}

		passElement.placeholder = placeholder;

		document.getElementById("signIn").style.display = display;
		document.getElementById("signUp").style.display = display;
		document.getElementById("forgotPass").style.display = display;
		document.getElementById("resetPass").style.display = resetDisplay;
	}


	socket.on('signInResponse', function(data) {
		if (data.success) {
			$('#account').hide();
			$('.paused').hide();
			generateMenus("mainMenu");
		}
		else
			alert("Sign in failed.");
	});

	socket.on('signUpResponse', function(data) {
		if (data.success) {
			alert("Sign up successful.");
		}
		else
			alert("Sign up unsuccessful.");
	});

	socket.on('resetPassResponse', function(data) {
		if (data.success) {
			alert("Password reset successful");
			showHideResetPassword(false);
		}
		else
			alert("Password reset failed");
	});
