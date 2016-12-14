/**
 * change menu active
 */
var changeMainMenus =  function(index){
  var listMenu = document.getElementsByClassName('li-list-menu-main');
    if(listMenu.length > 0 ){
    for(var i = 0 ; i< listMenu.length; i++){
      listMenu[i].className ="li-list-menu-main";
    }
    listMenu[index].className = "li-list-menu-main li-active-menu";
}
}
