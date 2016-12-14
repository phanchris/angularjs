var routerApp = angular.module('routerApp', ['ui.router','LocalStorageModule','ngAnimate','ngCookies', 'toastr']);

routerApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('ls');
}])
.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/main/home');
    $stateProvider
    // HOME
    .state('main',{
      url: '/main',
      abstract: true,
      templateUrl: './app/views/main.html',
      controller: 'MainController',
    })
    // FIND
    .state('main.home',{
      url: '/home',
      templateUrl: './app/views/find-trains.html',
      controller: 'FindController'

    })
    // POSITION
    .state('main.position-seat',{
      url: '/position-seat',
      templateUrl: './app/views/position-seat.html',
      controller: 'PositionController'
    })
    // REGIST
    .state('main.regist-tickets',{
      url: '/regist-tickets',
      templateUrl: './app/views/regist-tickets.html',
      controller: 'RegistTicketsController'
    })
    // CONTACT
    .state('main.contact',{
      url: '/contact',
      templateUrl: './app/views/contact.html',
      controller: 'ContactController'
    })
    // VIEW TIME
    .state('main.viewtime',{
      url: '/viewtime',
      templateUrl: './app/views/timetable.html',
      controller: 'ViewTimeController'
    })
    // EVENT SHOW
    .state('main.event',{
      url: '/event',
      templateUrl: './app/views/event.html',
      controller: 'EventController'
    })
    // HELP
    .state('main.guide',{
      url: '/guide',
      templateUrl: './app/views/help.html',
      controller: 'GuideController'
    })
    // INFORMATION
    .state('main.information',{
      url: '/information',
      templateUrl: './app/views/information.html',
      controller: 'InformationController'
    })
    // LOGIN
    .state('main.login',{
      url: '/login',
      templateUrl: './app/views/login.html',
      controller: 'LoginController'
    })
    // ADMIN
    .state('main.admin',{
      url: '/admin',
      templateUrl: './app/views/admin.html',
      controller: 'AdminController'
    })
    //PROFILE
    .state('main.admin.profile',{
      url: '/profile',
      templateUrl: './app/views/admin-profile.html',
      controller: 'AdminProfileController'
    })
    //EVENT
    .state('main.admin.event',{
      url: '/event',
      templateUrl: './app/views/admin-event.html',
      controller: 'AdminEventController'
    })
    // //TRAIN
    // .state('main.admin.train',{
    //   url: '/train',
    //   templateUrl: './app/views/admin-train.html',
    //   controller: 'adminTrainController'
    // })
    // //EVENT
    // .state('main.admin.coach',{
    //   url: '/coach',
    //   templateUrl: './app/views/admin-coach.html',
    //   controller: 'adminCoachController'
    // })
    //USER
    .state('main.admin.user',{
      url: '/user',
      templateUrl: './app/views/admin-user.html',
      controller: 'AdminUserController'
    })

});
