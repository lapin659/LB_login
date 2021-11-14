function onSignIn(googleUser) {
  // get user profile information
  var profile = googleUser.getBasicProfile();
  
  console.log("ID: " + profile.getId());
  console.log("Full Name: " + profile.getName());
  console.log("Email: " + profile.getEmail());

  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
  //window.location.href('https://www.google.com');
  //document.location.href = "https://calendar-version-2-3.glitch.me/main.html";
  //document.location.href = "main.html";
}