routerApp.controller('AdminController',  function(ChangeInfor, ShowLog, $scope, $http, $state, $cookieStore){

  // change acitve menu when customer edit
  // changeMainMenus(6);
  //change infor
  ChangeInfor.change('admin');
  // $scope.$on('$stateChangeSuccess', function (event, toState) {
  //     // $scope.show = false;
  //     // console.log($scope.show);
  //   if (toState.name === 'main.admin.profile') {
  //     changeActiveMenu('profile');
  //     // $scope.show = true;
  //   }
  //   if (toState.name === 'main.admin.event') {
  //     changeActiveMenu('event');
  //     // $scope.show = true;
  //   }
  //   if (toState.name === 'main.admin.user') {
  //     changeActiveMenu('user');
  //     // $scope.show = true;
  //   }
  //
  // });
  function checkAdmin() {
       if ($scope.checkAdmin == 0) {
           $state.go('main.home');
       } else {
           $state.go('main.admin.profile');
       }
   }
   checkAdmin();
});
