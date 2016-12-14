routerApp.controller('GuideController',  function(ChangeInfor, ShowLog, $scope, $http, $state){
  // change infor
  ChangeInfor.change('guide');
  // change acitve menu when customer edit
  changeMainMenus(4);
});
