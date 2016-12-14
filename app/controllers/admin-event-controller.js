routerApp.controller('AdminEventController', function($scope, $http, $state, ShowLog,  URLServices, toastr) {
    $scope.showAddEvent = false;
    $http
        .get( URLServices.getURL('event'))
        .success(function(response) {
            if (response.Message != "DataEmpty") {
                $scope.tabs = response;
                //console.log(response);
            }
            $scope.obs = [];
            $scope.deleteEvent = function(tab) {
                var idDelete = tab._id
                var params = {
                    'id': tab._id
                };
                BootstrapDialog.show({
                    title: 'Delete Event Train',
                    message: 'Are you sure delete event ' + tab.name + " ?",
                    buttons: [{
                        label: 'No',
                        action: function(dialogItself) {
                            dialogItself.close();
                        }
                    }, {
                        label: 'Yes',
                        action: function(dialog) {
                            $http
                                .post( URLServices.getURL('event') + "/delete", params)
                                .success(function(response) {
                                    toastr.success(response.Success);
                                    var eventObject = [];
                                    count = 0;
                                    for (i = 0; i < $scope.tabs.length; i++) {
                                        if (idDelete != $scope.tabs[i]._id) {
                                            eventObject[count] = $scope.tabs[i];
                                        }
                                    }
                                    $scope.tabs = eventObject;
                                })
                                .error(function(response) {
                                    //console.log(response);
                                    toastr.success(response.Error);
                                });
                            dialog.close();
                        }
                    }]
                });
            }
            if (response.Message != "DataEmpty") {
            $scope.editEvent = function(tab) {
                var dateBegin = new Date(Number(tab.timeBegin));
                var dateEnd =  new Date(Number(tab.timeEnd));
                //console.log(dateBegin);
                autoDate(dateBegin,'timeBegin');
                autoDate(dateEnd,'timeEnd');
                $scope.idEvent = tab._id;
                $scope.content = tab.content;
                // $scope.timeBegin = tab.timeBegin;
                // $scope.timeEnd = tab.timeEnd;
                $scope.obs = tab.objects;
                $scope.image = tab.image;
                $scope.nameEvent = tab.name;
              }
            }
            $scope.chooseType = function() {
                //console.log($scope.selectType);
                var checkSelect = $scope.selectType;
                if (typeof checkSelect != 'undefined') {
                    document.getElementById('price').value = $scope.selectType;
                }
            }
            $scope.updateObject = function() {
                if ((typeof $scope.inputType == "undefined") || (typeof $scope.inputDeal == "undefined")) {
                    toastr.error("Please input Type and Deal!!!");
                } else {
                    var object = {
                        type: $scope.inputType,
                        price: $scope.inputDeal
                    };
                    var newObjects = [];
                    newObjects[0] = object;
                    //console.log($scope.obs.length);
                    var lengthObs = $scope.obs.length + 1;
                    if (lengthObs > 1) {
                        for (i = 1; i < lengthObs; i++) {
                            newObjects[i] = $scope.obs[i - 1];
                        }
                    }
                    $scope.obs = newObjects;
                    //console.log($scope.obs);
                }
            }
            $scope.saveEvent = function() {
                var msecTimeBegin = Date.parse($scope.timeBegin);
                var msecTimeEnd = Date.parse($scope.timeEnd);
                //console.log(msecTimeBegin);
                var eventUpdate = {
                    _id: $scope.idEvent,
                    name: $scope.nameEvent,
                    objects: $scope.obs,
                    timeBegin: msecTimeBegin,
                    timeEnd: msecTimeEnd,
                    image: $scope.image,
                    content: $scope.content
                };
                $http
                    .put( URLServices.getURL('event'), eventUpdate)
                    .success(function(data) {
                        toastr.success(data.Success);
                    })
                    .error(function(data) {
                        toastr.success(data.Error);
                    });
            }
        });
    $scope.plusObject = function() {
        $scope.showAddEvent = true;
    }
});
