routerApp.controller('LoginController', function(ChangeInfor,toastr, ShowLog, URLServices, $scope, $state, $http, $cookies, $cookieStore) {
    /*
     * INIT
     */
    // id
    $scope.id = '';
    // pass
    $scope.password = '';
    // button
    $scope.btnLogin = true;
    // show error
    $scope.showIDError = false;
    $scope.showPasswordError = false;
    // chagne infor

    ChangeInfor.change('login');
    toastr.warning('Waiting for update...');
    $state.go('main.home');

    //===============================
    // change input
    $scope.change = function() {
            if ($scope.id.length > 0 && $scope.password.length > 0) {
                $scope.btnLogin = false;
                // hide error
                $scope.showIDError = false;
                $scope.showPasswordError = false;
            } else {
                if ($scope.id.length == 0) {
                    $scope.showIDError = true;
                } else {
                    $scope.showIDError = false;
                }

                if ($scope.password.length == 0) {
                    $scope.showPasswordError = true;
                } else {
                    $scope.showPasswordError = false;
                }
                $scope.btnLogin = true;
            }
        }
        // login
    $scope.login = function() {
        $http
            .post(URLServices.getURL('admin'), {
                name: $scope.id,
                pass: $scope.password
            })
            .success(function(response) {
                var user = response;
                $cookieStore.put('userLogin', user);
                //console.log(user.nameqưe);
                $scope.$emit('loginAdmin', {
                    userName : user.name

                });
                $state.go('main.admin.profile');
            })
            .error(function(status) {
                BootstrapDialog.alert(status.Error);
            });
    }
});
