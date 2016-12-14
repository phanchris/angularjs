routerApp.service('ChangeInfor',function($rootScope){
  this.change =  function(nameSate){
    switch (nameSate) {
      case 'main':
        // change backgroundPage
        $rootScope.backgroundPage = "main-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'TrainTickets System';
        break;
      case 'position':
        // change backgroundPage
        $rootScope.backgroundPage = "position-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Choose Position Seat';
        break;
      case 'register':
        // change backgroundPage
        $rootScope.backgroundPage = "register-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Register the ticket';
        break;
      case 'timetable':
        // change backgroundPage
        $rootScope.backgroundPage = "timetable-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Timetable Our trains';
        break;
      case 'information':
        // change backgroundPage
        $rootScope.backgroundPage = "infomartion-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Information Your Ticket';
        break;
      case 'event':
        // change backgroundPage
        $rootScope.backgroundPage = "event-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Event';
        break;
      case 'login':
        // change backgroundPage
        $rootScope.backgroundPage = "login-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Login';
        break;
      case 'guide':
        // change backgroundPage
        $rootScope.backgroundPage = "guide-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Help to register the ticket';
        break;
      case 'contact':
        // change backgroundPage
        $rootScope.backgroundPage = "contact-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Contact with us';
        break;
      case 'admin':
        // change backgroundPage
        $rootScope.backgroundPage = "admin-background";
        // showLog.show('goin information', envi);
        $rootScope.pageTitle = 'Management page';
        break;

    }
  }
});
