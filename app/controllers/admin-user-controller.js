routerApp.controller('AdminUserController', function($scope, $http, $state, URLServices, $rootScope, ChangeInfor) {
  //
  $scope.updateCus = function() {
    if (!$scope.txtIdTicket || !$scope.txtId || !$scope.txtCustomer) {
      BootstrapDialog.alert({
        title: 'Warrning',
        message: 'Please type id and name'
      });
    } else {
      var method = "updateCustomer";
      $rootScope.showLoad = "show-load";
      // $http.put(URLServices.getURL('customer'), {
      //   method: method,
      //   id_customer: $scope.txtId,
      //   name: $scope.txtCustomer,
      //   id_ticket: $scope.txtIdTicket
      // }
      $http.put(URLServices.getURL('customer'), {
        // method: method,
        id_customer: $scope.txtId,
        name: $scope.txtCustomer,
        id_ticket: $scope.txtIdTicket
      }).success(function(response) {
        $rootScope.showLoad = "hide-load";
        BootstrapDialog.show({
          title: 'Sucessed',
          message: 'You have edited information customer success '
        });
      }).error(function(response) {
        $rootScope.showLoad = "hide-load";
        BootstrapDialog.show({
          title: 'Warrning',
          message: 'No ticket was found'
        });
      });
    }
  }

  $scope.changeState = function(){
    if (!$scope.txtStateTicket) {
      BootstrapDialog.alert({
        title: 'Warrning',
        message: 'Please type id ticket to change state'
      });
    }else {
      var method = "updateStateticket";
      $rootScope.showLoad = "show-load";
      $http.put(URLServices.getURL('customer'), {
        // method: method,
        id_ticket: $scope.txtStateTicket
      }).success(function(response) {
        $rootScope.showLoad = "hide-load";
        BootstrapDialog.show({
          title: 'Sucessed',
          message: 'Change state success '
        });
      }).error(function(response) {
        $rootScope.showLoad = "hide-load";
        BootstrapDialog.show({
          title: 'Warrning',
          message: 'No ticket was found'
        });
      });
    }
  }

});
