routerApp.service('ShowLog', function($rootScope) {
    this.show = function (str, envi) {
        if(envi == 'dev')
          console.log(str);
    }
});
