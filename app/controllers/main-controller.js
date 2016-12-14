
routerApp.controller('MainController',  function(URLServices, ChangeInfor, ShowLog, $scope, $rootScope, $cookieStore, $http, $state, toastr){

  var envi =  'product';
  //menu
  $scope.activeHome = "li-active-menu";
  $scope.activeInfor = "";
  $scope.activeEvent = "";
  $scope.activeTimetable = "";
  $scope.activeGuide = "";
  $scope.activeContact= "";
  $scope.listTickets = [];
  $scope.listEvent = [];
  $rootScope.showLoad = "hide-load";
  var getUser = $cookieStore.get('userLogin');
  $scope.checkAdmin = '';
  // time hide toastr
  var timOutToastr = 10000;
  // ShowLog.show('showLoad',envi);
  // $scope.backgroundPage ="master-page";
  // $rootScope.pageTitle = "TrainTickets";
  ChangeInfor.change('main');
  // listen list when the postion-seat return
  $scope.$on('eventListTicketsFromPosition', function (event, args) {
    $scope.listTickets = args.listTickets;
   });
   $scope.$on('eventList', function (event, args) {
    $scope.listEvent = args.listEvent;
    });

  // check connect to server
  var autoCheckServer = function(){
    ShowLog.show(URLServices.getURL('train'), envi);
    $http.get(URLServices.getURL('train'))
            .success(function(response, status) {

            }).error(function (data, status, header, config) {
              ShowLog.show(data+", "+status+", "+header+", ", envi );
              ShowLog.show( config, envi);
              if(data == null){
                toastr.error('Cannot connect to the server. Please try again after few minutes. Thanks',
                            'Error',{timeOut:timOutToastr});
              }
          });
  }
  // run when app run
  autoCheckServer();
  // ShowLog.show('call main', envi);
  if (typeof getUser == 'undefined') {
        $scope.checkAdmin = 0;
    } else {
        $scope.checkAdmin = 1;
    }
    //check amdin and set style for button login
    function showAdminLogin() {
        if ($scope.checkAdmin == 0) {
            styleLog('Login', 'fa fa-sign-in', false);
        } else {
            styleLog('Logout', 'fa fa-sign-out', true);
        }
    }
    showAdminLogin();

    function deleteCookie() {
        if ($scope.checkAdmin != 1) {
            // $(window).unload(function() {
            //     $cookieStore.remove('userLogin');
            // });
            setTimeout(function() {
                $cookieStore.remove('userLogin');
                $scope.checkAdmin = 0;
                styleLog('Login', 'fa fa-sign-in', false);
            }, 300000);
        }
    }
    deleteCookie();
    // disable auto delete cookies
    // $scope.$on('changeTitleLog', function(event, args) {
    //     $scope.switchLog = args.css;
    //     $scope.titleLog = args.title;
    //     $scope.showAdmin = args.showAdmin;
    // });
    // tets modal login
    $scope.loginUser = function() {
            $http
                .post(URLServices.getURL('admin'), {
                    name: $scope.userName,
                    pass: $scope.userPass
                })
                .success(function(response) {
                    var user = response;
                    $cookieStore.put('userLogin', user);
                    $scope.checkAdmin = 1;
                    styleLog('Logout', 'fa fa-sign-out', true);
                    $("#formLogin").modal('hide');
                    $state.go('main.admin.profile');
                })
                .error(function(status, data) {
                    if (data == null) {
                        toastr.error("Systems are error! Please you come back later");
                    } else {
                        toastr.error(status.Error);
                    }
                });
        }
        //  set style for button login, Logout
    function styleLog(title, css, admin) {
        $scope.showAdmin = admin;
        $scope.switchLog = css;
        $scope.titleLog = title;
    }
    //show form login
    $scope.openLogin = function() {
        if ($scope.checkAdmin == 0) {
            $("#formLogin").modal();
        } else {
            $("#formLogin").modal('hide');
            $cookieStore.remove('userLogin');
            $scope.checkAdmin = 0;
            styleLog('Login', 'fa fa-sign-in', false);
            $state.go('main.home');
        }
    }

});
