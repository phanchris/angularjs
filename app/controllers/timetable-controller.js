routerApp.controller('ViewTimeController', function(ChangeInfor, URLServices, $scope, $rootScope, $http, $state, $window) {
  // $rootScope.showLoad = "show-load";
  changeMainMenus(3);
  //change infor
  ChangeInfor.change('timetable');
  $scope.station = "Station";
  $scope.timeaway = "Time go";
  $scope.timearrivals = "Time return";
  $scope.Trainjourneygo = "Train journey";
  $scope.show = true;

  $scope.name = ["SE11", "SE12"];
  $scope.selected_option = $scope.name[0];
  getStationList();

  var check = "journey";
  $scope.coachsTrain = [{
    typeCoach: 'Bed super soft',
    price: 23000
  }, {
    typeCoach: 'Super soft',
    price: 40000
  }, {
    typeCoach: 'Soft',
    price: 52000
  }, {
    typeCoach: 'Seat',
    price: 25000
  }];

  function showJourney() {
    $scope.station = "Station";
    $scope.timeaway = "Time go";
    $scope.timearrivals = "Time return";
    $scope.hide = false;
    $scope.show = true;
    $scope.connect = "";
    $scope.Trainjourneygo = "Train journey"
  };

  function changeTitle() {
    $scope.station = "From station";
    $scope.timearrivals = "Price";
    $scope.hide = true;
    $scope.show = false;
    $scope.connect = " - ";
    $scope.Trainjourneygo = "Price journey"
  };
  // change option
  $scope.changListTrain = function() {
    if (check == "journey") {
      getStationList();
    } else {
      if (check = "price") {
        getListPrice();
      }
    }
  }

  // get list station when optionlist change
  function getStationList() {
    $rootScope.showLoad = "show-load";
    $http.get(URLServices.getURL('train')).success(function(response) {
      $rootScope.showLoad = "hide-load";
      $scope.train = response.data;
      $scope.listJourney = [];
      for (i = 0; i < response.length; i++) {
        if (response[i]._id == $scope.selected_option) {
          $scope.Name = response[i].title;
          for (j = 0; j < response[i].trainJourney.length; j++) {
            $scope.listJourney[j] = [
              response[i].trainJourney[j],
              response[i].trainJourneyReturn[response[i].trainJourneyReturn.length - j - 1]
            ];
          }
        }
      }
      showJourney();
    }).error(function(response) {
      $rootScope.showLoad = "hide-load";
      BootstrapDialog.show({
        title: 'Warrning',
        message: 'No train was found'
      });
    });
  };


  // Get list peice of train.
  function getListPrice() {
    $rootScope.showLoad = "show-load";
    $http.get(URLServices.getURL('train')).success(function(response) {
      $rootScope.showLoad = "hide-load";
      $scope.train = response.data;
      for (i = 0; i < response.length; i++) {
        if (response[i]._id == $scope.selected_option) {
          $scope.coachsTrain = response[i].coachs;
          $scope.Name = response[i].title;
          $scope.listJourney = response[i].pricesDistance;
        }
      }
      changeTitle();
    }).error(function(response) {
      $rootScope.showLoad = "hide-load";
      BootstrapDialog.show({
        title: 'Warrning',
        message: 'No train was found'
      });
    });
  }

  // Train Journey
  $scope.north_sound = function() {
    // getStationList("Ha Noi-Sai Gon");
    check = "journey";
    $scope.name = ["SE11", "SE12"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.hanoi_danang = function() {
    // getStationList("Ha Noi-Da Nang");
    check = "journey";
    $scope.name = ["SE4", "SE13"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.hanoi_laocai = function() {
    // getStationList("Ha Noi-Lao Cai");
    check = "journey";
    $scope.name = ["HYB1", "HYB2"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.Math = window.Math;
  $scope.hanoi_haiphong = function() {
    // getStationList("Ha Noi-Hai Phong");
    check = "journey";
    $scope.name = ["LP1", "LP2"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };

  //
  $scope.hanoi_dongdang = function() {
    // getStationList("Ha Noi-Dong Dang");
    check = "journey";
    $scope.name = ["RD1", "HDD1"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.hanoi_thainguyen = function() {
    // getStationList("Ha Noi-Thai Nguyen");
    check = "journey";
    $scope.name = ["HNT2", "HNT1"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //

  $scope.saigon_danang = function() {
    // getStationList("Sai Gon-Da Nang");
    check = "journey";
    $scope.name = ["SDN1", "SDN2"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.saigon_phanthiet = function() {
    // getStationList("Sai Gon-Phan Thiet");
    check = "journey";
    $scope.name = ["SPT1", "SPT2"];
    $scope.selected_option = $scope.name[0];
    getStationList();
  };
  //
  $scope.saigon_quinhon = function() {
    // getStationList("Sai Gon-Quy Nhon");
    check = "journey";
    $scope.name = ["SE25", "SE26"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
  };


  // Price Train journey

  $scope.Price_north_sound = function() {
    // getListPrice("Ha Noi-Sai Gon");
    check = "price";
    $scope.name = ["SE11", "SE12"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
  };

  $scope.Price_hanoi_danang = function() {
    check = "price";
    $scope.name = ["SE4", "SE13"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Ha Noi-Da Nang");
  };
  //
  $scope.Price_hanoi_laocai = function() {
    check = "price";
    $scope.name = ["HYB1", "HYB2"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Ha Noi-Lao Cai");
  };
  //
  $scope.Price_hanoi_haiphong = function() {
    check = "price";
    $scope.name = ["LP1", "LP2"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Ha Noi-Hai Phong");
  };
  //
  $scope.Price_hanoi_dongdang = function() {
    check = "price";
    $scope.name = ["RD1", "HDD1"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Ha Noi-Dong Dang");
  };
  //
  $scope.Price_hanoi_thainguyen = function() {
    check = "price";
    $scope.name = ["HNT2", "HNT1"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Ha Noi-Thai Nguyen");
  };

  //
  $scope.Price_saigon_danang = function() {
    check = "price";
    $scope.name = ["SDN1", "SDN2"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Sai Gon-Da Nang");
  };
  //
  $scope.Price_saigon_phanthiet = function() {
    check = "price";
    $scope.name = ["SPT1", "SPT2"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Sai Gon-Phan Thiet");
  };
  //
  $scope.Price_saigo_quinhon = function() {
    check = "price";
    $scope.name = ["SE25", "SE26"];
    $scope.selected_option = $scope.name[0];
    getListPrice();
    // getListPrice("Sai Gon-Quy Nhon");
  };
});
