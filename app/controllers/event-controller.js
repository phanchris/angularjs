routerApp.controller('EventController', function(ChangeInfor, ShowLog, URLServices ,$scope, $http, $state, $window, toastr) {
    changeMainMenus(2);
    // change infor
     ChangeInfor.change('event');
     $scope.hideEvent = false;
    $scope.showEvent = false;
    //get event
    $http
        .get(URLServices.getURL('event'))
        .success(function(response) {
            $scope.tabs = response;
            if($scope.tabs.length > 0){
            $scope.dateBeginEvent = new Date(Number($scope.tabs[0].timeBegin));
            $scope.dateEndEvent =  new Date(Number($scope.tabs[0].timeEnd));
            $scope.content = $scope.tabs[0].content;
            var view = '';
            for (i = 0; i < $scope.tabs[0].objects.length; i++) {
                var type = $scope.tabs[0].objects[i].type;
                var price = $scope.tabs[0].objects[i].price;
                view = view + type + ': ' + price + '.';
            }
            $scope.object = view;
            $scope.name = $scope.tabs[0].name;
            $scope.onClickTab = function(tab) {
                var viewtab = '';
                $scope.content = tab.content;
                $scope.dateBeginEvent = new Date(Number(tab.timeBegin));
                $scope.dateEndEvent =  new Date(Number(tab.timeEnd));
                //console.log(tab.objects.length);
                for (i = 0; i < tab.objects.length; i++) {
                    var type = tab.objects[i].type;
                    var price = tab.objects[i].price;
                    viewtab = viewtab + type + ': ' + price + '. ';
                }
                $scope.object = viewtab;
                $scope.name = tab.name;
            }
            //set active tab choosed
            $scope.isActiveTab = function(tabUrl) {
                return tabUrl == $scope.name;
            }
            //show event
            $scope.showEvent = true;
          }else {
              $scope.hideEvent = true;
            }
        })
        .error(function(){
            $scope.hideEvent = true;
        });

});
