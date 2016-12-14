routerApp.controller('AdminProfileController',  function(URLServices, $scope, $http, $state, $cookieStore){

     $scope.admin = $cookieStore.get('userLogin');
     var admin = $cookieStore.get('userLogin');
     $scope.changePassword = function() {
         if (!$scope.oldPass || !$scope.newPass || !$scope.confirm) {
             BootstrapDialog.alert('Please input password');
         } else if ($scope.newPass != $scope.confirm) {
             BootstrapDialog.alert('Confirm password incorect');
         } else {
             $http
                 .put(URLServices.getURL('admin'), {
                     name: admin.name,
                     oldpass: $scope.oldPass,
                     newpass: $scope.confirm
                 })
                 .success(function(response) {
                     BootstrapDialog.alert(response.Success);
                 })
                 .error(function(status) {
                     BootstrapDialog.alert(status.Error);
                     //console.log('loi' + $scope.oldPass);
                 });
         }
     };

});
