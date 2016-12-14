/*
*	Event click menus
*/
// active div coach
changeActiveDivTrain =  function(index){
  var listTrain = document.getElementsByClassName('select-train');
  for(var i =0 ; i< listTrain.length; i++){
    listTrain[i].className = 'select-train';
  }
  listTrain[index].className = "select-train select-train-active";

}
// Coach's menus
changeActiveCoachMenus =  function (index){
	// console.log(index);
	// console.log(index + "out");
	var listLiMenus = document.getElementsByClassName('li-menu-coach');
	// console.log(index + "out" + listLiMenus[0]);
	for( var i = 0; i < listLiMenus.length; i++){
		if( index == i ){
			// console.log(index);
			listLiMenus[index].className = "li-menu-coach active";
		}
		else
			listLiMenus[i].className ="li-menu-coach";
	}
}
// train's menus
changeActiveTrainMenus =  function (index){
	var listLiMenus = document.getElementsByClassName('li-menu-train');
	for( var i = 0; i < listLiMenus.length; i++){
		listLiMenus[i].className ="li-menu-train";
	}
	listLiMenus[index].className ="li-menu-train active";
}
// test get $scope
// getScope = function($scope){
// 	alert($scope);
// 	console.log($scope.seat);
// }
