

// change active class
changeActiveMenu = function(name){
   var profile  = document.getElementById('li-profile');
   var eventt   = document.getElementById('li-add-event');
   var user     = document.getElementById('li-user');
   var train    = document.getElementById('li-train');
   var coach    = document.getElementById('li-coach');
   profile.className  = " a";
   user.className     = " a";
   eventt.className   = " a";
   train.className    = " a";
   coach.className    = " a";
   switch (name) {
     case "profile":
      profile.className = "active";
       break;
     case "event":
      eventt.className  = "active";
       break;
     case "user":
      user.className    = "active";
       break;
     case "train":
       train.className  = "active";
       break;
     case "coach":
       coach.className  = "active";
       break;
     default:
      console.log('none');
   }


}
