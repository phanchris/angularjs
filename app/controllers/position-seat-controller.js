routerApp.controller('PositionController',  function(ChangeInfor, URLServices, ShowLog, $scope, $http, $state, $window, $q, localStorageService, toastr ){
  /*INIT*/
  // journey and journey return when customer find from home page
  var journey = '';
  var journeyReturn = '';

  // get time for each train into the list train.
  var listTimeTrainJourney= [];
  var listTimeTrainJourneyReturn= [];
  // current time of the train when customer choose
  $scope.currentTime = '';
  // list of the train has being seleted
  $scope.trainsActive = [];
  // save temp tickets
  $scope.listTickets  = [];
  // list of the train has being selected
  $scope.trainsActive = "";
  // the coach has being selected
  $scope.coachActive  = "";
  // list of the seat  to view
  $scope.listSeat     = "";
  // Is journy return?
  var isReturn     = false;
  // from the station
  var fromStation  = '';
  // to the station
  var toStation    = '';
  // time
  $scope.time         = '';
  // show lable when the list seat is empty
  $scope.show = 'lbl-die';
  // show log console
  var envi = 'product';
  // change information when change state
  ChangeInfor.change('position');
  /*
  * METHODS
  */

  // change state to regist-tickets when customer choose successlly
  /**
   * move the register ticket state
   * @return none
   */
  $scope.changeState = function(){
    if($scope.listTickets.length > 0)
      {
        var ticket = ($scope.listTickets.length == 1) ? 'ticket' : 'tickets';
        // inform for the customer: ask the customer want to change page
        BootstrapDialog.confirm('Are you sure want to buy the ' + ticket + '?', function(result){
           if(result) {
                // update listTicket
                $scope.$emit('eventListTicketsFromPosition', { listTickets: $scope.listTickets });
                // move state
                $state.go('main.regist-tickets');
           }else {

           }
       });
      }
    else{
      toastr.warning('Your list is empty.', 'Warning');
    }
  }


  /**
   * When the customer click train inside list train -> detect again list coach on page
   * @param  {Object} li object html has contain position of the train when the customer click
   * @return none;
   */
  $scope.changeListCoach =  function(li){

    $scope.trainActive          =  $scope.trainsActive[li.$index];
    $scope.coachActive          =  $scope.trainActive.coachs[0];
    // $scope.nameTrain            =  $scope.trainActive.title;
    if(!isReturn)
      $scope.currentTime  = listTimeTrainJourney[li.$index].timeStart;
    else
      $scope.currentTime  = listTimeTrainJourneyReturn[li.$index].timeStart;
    // change class of the active menu
    changeActiveDivTrain(li.$index);
    // filter list seat match
    filterListSeat().then(function(greeting) {
      changeActiveCoachMenus(0);
    }, function(reason) {
      ShowLog.show(reason);
    });
  }
  /// show list of the seats in the coach when click menu
  /**
   * when the customer click menu coach, then show list of the seats
   * @param  {Object} li object html has contain position of the coach when the customer click
   * @return none
   */
  $scope.changeListSeat =  function(li){
    changeActiveCoachMenus(li.$index);
    $scope.coachActive        =  $scope.trainActive.coachs[li.$index];

    filterListSeat();
  }

  /**
   * event click choose the ticket from the seat
   * @param  {Object} div object html has contain position of the seat when the customer click
   * @return none
   */
  $scope.chooseSeat =  function(div){
    $scope.seat = $scope.listSeat[div.$index];
    if($scope.listTickets.length > 2){// one customer only choose three the tickets
      toastr.warning('Your list is full.', 'Warning');
      return;
    }else if($scope.listTickets.length > 0){
      for(var j = 0; j < $scope.listTickets.length; j ++  ){
        if( ($scope.listTickets[j].seatNumber == $scope.seat.number)
            && $scope.listTickets[j]._idTrain == $scope.trainActive._id
            && $scope.listTickets[j].coachTrain == $scope.coachActive._id
            && $scope.listTickets[j].date == convertTimeVar($scope.time, $scope.currentTime)){
          toastr.warning('You chosen it!', 'Warning');
          return ;
        }

      };
    }
    var id =  $window.Math.round(Number(new Date().getTime())/1000*$window.Math.random());
    var price = Number($scope.coachActive.price)
                      + Number(getPriceDistance($scope.trainActive, fromStation, toStation));
    ShowLog.show('price '+ price, envi);
    $scope.seatO = {
      "_id"         : id,
      "_idTrain"    : $scope.trainActive._id,
      "coachTrain"  : $scope.coachActive._id,
      "date"        : convertTimeVar($scope.time, $scope.currentTime),
      "dateBuy"     : new Date().getTime(),
      'object'      : 'Adult',
      "seatNumber"  : $scope.seat.number,
      "nameTrain"   : $scope.trainActive.title,
      "typeSeat"    : $scope.coachActive.typeCoach,
      "isReturn"    : isReturn,
      "startStation": fromStation,
      "endStation"  : toStation,
      "price"       : price,
      "state"       : 'unpaid'
    };
    ShowLog.show('create seat', envi);
    ShowLog.show($scope.seatO, envi);
    $scope.listTickets.push($scope.seatO);
    filterListSeat();// update view
  }
  /**
   * convert time from hour of the train station and time find train.
   * @param  {String} timestamp time find train
   * @param  {Number} hour      time of the start station
   * @return {String}           timestamp
   */
  $scope.convertTime = function(timestamp, hour){
    return convertTimeVar(timestamp, hour);
  }

  /**
   * remove ticket from the ticket list
   * @param  {Ojbect} div object html has contain position of the ticket when the customer click
   * @return none
   */
  $scope.removeTicket = function(div){
    // save temp the ticket list
    $scope.listTicketsTemp  = $scope.listTickets;
    // initialize listTickets agian
    $scope.listTickets      = [];
    // get position from objec div
    $scope.posi             = div.$index;
    // remove the ticket
    for($scope.i = 0; $scope.i < $scope.listTicketsTemp.length; $scope.i ++  ){
      if( $scope.i  != $scope.posi){
        $scope.listTickets.push($scope.listTicketsTemp[$scope.i]);
      }
    }
    // update view seat when the customer clicked remove the ticket
    filterListSeat();
  }
  $scope.showTime =  function(index){
    // ShowLog.show(index, envi);
    if(!isReturn){
      // ShowLog.show(listTimeTrainJourney[index], envi);
      return convertTimeVar($scope.time, listTimeTrainJourney[index].timeStart);
    }else{
      ShowLog.show(listTimeTrainJourneyReturn[index], envi);
      return convertTimeVar($scope.time, listTimeTrainJourneyReturn[index].timeStart);
    }
  }
  /**
   * lick choose journey to view train
   * @return none
   */
  $scope.changeJourney  =  function(){
    //  isReturn will assign value false;
    isReturn     = false;
    // set value again
    fromStation  = journey.fromStation;
    toStation    = journey.toStation;
    $scope.time         = journey.time;
    // set default train
    $scope.trainsActive = journey.listTrain;
    $scope.trainActive  = $scope.trainsActive[0];
    $scope.coachActive  = $scope.trainActive.coachs[0];

    $scope.currentTime  = listTimeTrainJourney[0].timeStart;
    // update set view
    filterListSeat().then(function(greeting) {
      // change menu active
      changeActiveTrainMenus(0);
      changeActiveDivTrain(0);
      changeActiveCoachMenus(0);

    }, function(reason) {
      ShowLog.show(reason, envi);
    });

  }
  /**
   * get time or station for the train to show page
   * @param  {String} idTrain train's id
   * @param  {[type]} info    the kind want to show the page
   * @return none
   */
  $scope.getTimeDate = function(idTrain, info){
    if(isReturn){// if journey return
      for(var i = 0; listTimeTrainJourneyReturn.length; i++){
        if(listTimeTrainJourneyReturn[i].id == idTrain){
          switch (info) {
            case 'from':
              return listTimeTrainJourneyReturn[i].fromStation;
            case 'to':
              return listTimeTrainJourneyReturn[i].toStation;
            case 'time':
              var hour = $window.Math.floor(Number(listTimeTrainJourneyReturn[i].timeStart)/60);
              var min  = Number(listTimeTrainJourneyReturn[i].timeStart) % 60;
              if (min == 0)
                min ="00";
              if(hour < 10)
                hour = "0" + hour.toString();
              return hour + ":" + min;
          }
        }
      }
    }else{// not journey return
      for(var i = 0; listTimeTrainJourney.length; i++){
        if(listTimeTrainJourney[i].id == idTrain){
          switch (info) {
            case 'from':
              return listTimeTrainJourney[i].fromStation;
            case 'to':
              return listTimeTrainJourney[i].toStation;
            case 'time':
              var hour = $window.Math.floor(listTimeTrainJourney[i].timeStart/60);
              var min  = listTimeTrainJourney[i].timeStart % 60;
              return hour + ":" + min;
          }
        }
      }
    }
  }
  /**
   * lick choose journey return to view train
   * @return none
   */
  $scope.changeJourneyReturn  =  function(){
      if(journeyReturn == null
          || journeyReturn.listTrain.length == 0){
          changeActiveTrainMenus(0);
          toastr.error('You cannot choose this function!');
      }else{
        //  flag the ticket type is type return
        isReturn     = true;
        fromStation  = journeyReturn.fromStation;
        toStation    = journeyReturn.toStation;
        ShowLog.show(fromStation + " return " +toStation, envi);
        $scope.time         = journeyReturn.time;
        // set default train
        $scope.trainsActive = journeyReturn.listTrain;
        $scope.trainActive  = $scope.trainsActive[0];
        $scope.coachActive  = $scope.trainActive.coachs[0];
        // change current time
        $scope.currentTime  = listTimeTrainJourneyReturn[0].timeStart;
          // update set view
        filterListSeat().then(function(seats) {
          changeActiveDivTrain(0);
          changeActiveTrainMenus(1);
          changeActiveCoachMenus(0);
        }, function(reason) {
          ShowLog.show(reason, envi);
        });
      }
  }

  // filter list seat to show: use promise
  var filterListSeat  = function(){
    return $q(function(resolve, reject) {
      $scope.listSeat = []; // reset the list
      for(var i = 0; i < $scope.coachActive.seats.length; i++){
        $scope.seat =  $scope.coachActive.seats[i];
        // Is the seat has in the list of seat
        var isOfListTeckets = false;

        for( var j = 0 ; j < $scope.listTickets.length; j++){
          ShowLog.show('shitshow', envi);
          if( ($scope.listTickets[j].seatNumber == $scope.seat.number)
              && $scope.listTickets[j]._idTrain == $scope.trainActive._id
              && $scope.listTickets[j].coachTrain == $scope.coachActive._id
              && $scope.listTickets[j].date == convertTimeVar($scope.time, $scope.currentTime)){
                isOfListTeckets =  true;
                break;// the seat is exist in the list
          }
        }
        // if the seat has been the list
        if(isOfListTeckets)
          continue;
        // seat is block
        if( $scope.seat.state != false){
          $scope.listCustomer = $scope.seat.customer; // get the list of customer
          if($scope.listCustomer.length == 0){
              $scope.listSeat.push($scope.seat);
              continue;
          }
          // Check the seat have a person at that's time
          var isPush =  true;
          for(var k = 0; k < $scope.listCustomer.length; k++){
            // get time from the ticket of the customer
            var datetime = $scope.listCustomer[k].ticket.date;
            // ShowLog.show('timesdasdfasfasd', envi);
            // ShowLog.show(Number(datetime) + "-" + Number($scope.time), envi);
            // ShowLog.show(new Date(datetime) + "-" + new Date($scope.time), envi);
            // ShowLog.show(datetime + " -? " + $scope.time, envi);
            $scope.sub = $window.Math.abs(Number(datetime) - Number($scope.time));
            if( $scope.sub <= 24*60*60*1000){
              isPush = false;
              break;
            }
          }
          ShowLog.show('down', envi);
          if(isPush){
            $scope.listSeat.push($scope.seat);
          }
        }
      }
      if($scope.listSeat.length == 0){
        $scope.show = 'lbl-live';
      }
      else
        $scope.show = 'lbl-die';
      // if($scope.listSeat.length == 0){
      //   toastr.clear();
      //   toastr.info('This <b style="color:red;">TRAIN</b> had registered all the seat!'
      //                 , 'Information',{timeOut: 30000, allowHtml:true, closeButton: true, positionClass: 'toast-bottom-right',});
      // }
      // promise
      setTimeout(function() {
      if (true) {
        // return the result to handle
        resolve($scope.listSeat);
      } else {
        // return the error
        reject('nothing');
      }
    }, 10);
    });

  }

    /**
     * get price of train which has fromStation and toStation
     * @param  {Object} train       the train
     * @param  {String} fromStation name of the start station
     * @param  {String} toStation   name of the end station
     * @return {Number}             price from start station  to end station
     */
    var getPriceDistance = function(train, fromStation, toStation){
      var pricesDistance =  train.pricesDistance;
      for( var i = 0; i< pricesDistance.length; i++){
        if( ((pricesDistance[i].fromStation == fromStation) && (pricesDistance[i].toStation == toStation))
            || ((pricesDistance[i].fromStation == toStation) && (pricesDistance[i].toStation == fromStation))){

              return pricesDistance[i].price;
            }
      }
      return 0;
    }
    /**
     * get time for journey or journey return for each train
     * @param  {Object} journey   journey indiscriminate return or not return
     * @param  {Number} condition 1: jouryney go; 2: journey return
     * @return {[type]}           [description]
     */
    var getTimeTrain  =  function(journey, condition){
      var timeStart = '';
      var timeEnd   = '';
      var listTrainJourney = [];
      var fromStation = journey.fromStation;
      var toStation   = journey.toStation;
      // get
      var listTrain   = journey.listTrain;
      for( var i = 0; i< listTrain.length; i++){
        // get journey
        var journeyG =  listTrain[i].trainJourney;
        var isStart =  false;// first station
        for(var j = 0 ; j< journeyG.length; j++){
          if(!isStart && (journeyG[j].station == fromStation)){
            isStart= true;
            timeStart = journeyG[j].time;
          }
          if(isStart && journeyG[j].station == toStation){// second state
            timeEnd = journeyG[j].time;
            break;
          }
        }

      if(timeStart.length == 0 || timeEnd.length == 0){// do not dectect journey
        // reste value
        timeStart = '';
        timeEnd   = '';
        // get journey
        var journeyG =  listTrain[i].trainJourneyReturn;
        var isStart =  false;// first station
        for(var j = 0 ; j< journeyG.length; j++){
          if(!isStart && (journeyG[j].station == fromStation)){
            isStart= true;
            timeStart = journeyG[j].time;
          }
          if(isStart && journeyG[j].station == toStation){// second state
            timeEnd = journeyG[j].time;
            break;
          }
        }
        }
        if(condition == 0 ){
          if(timeStart.length > 0 && timeEnd.length > 0){
              listTimeTrainJourney.push(
                {
                  'id'        : listTrain[i]._id,
                  'timeStart': timeStart,
                  'timeEnd'  : timeEnd,
                  'fromStation': fromStation,
                  'toStation': toStation
                }
              );
              // if the train don't have the journey so delete the train from list
              listTrainJourney.push(listTrain[i]);
          }
        }else{
          if(timeStart.length > 0 && timeEnd.length > 0){
            listTimeTrainJourneyReturn.push(
              {
                'id'        : listTrain[i]._id,
                'timeStart': timeStart,
                'timeEnd'  : timeEnd,
                'fromStation': fromStation,
                'toStation': toStation
              }
            );
            listTrainJourney.push(listTrain[i]);
          }
        }
      }
      journey.listTrain = listTrainJourney;
      return journey;
    }

    /**
    * convert time from hour of the train station and time find train.
    * @param  {String} timestamp time find train
    * @param  {Number} hour      time of the start station
    * @return {String}           timestamp
     */
    var convertTimeVar =  function(timestamp, hour){
        var date =  new Date(Number(timestamp));
        var m = date.getMonth();
        var y = date.getFullYear();
        var d = date.getDate();
        var h =  $window.Math.floor(Number(hour)/60);
        var min = Number(hour) % 60;
        return (new Date(y, m, d, h, min, 0, 0).getTime());
    }
    /**
     * call first when the position state is been call.
     * get and check information from the find state
     * @return none
     */
    var checkTrain = function(){
      // get journey and journey return from local
      journey = localStorageService.get('journey');
      journeyReturn = localStorageService.get('journeyReturn');
      ShowLog.show(journey,envi);
      if((journey !=null)  && (typeof journey) != 'string'){
        if(journey.listTrain.length >0){
                    // set default train
          $scope.trainsActive = journey.listTrain;
          $scope.trainActive  = $scope.trainsActive[0];
          $scope.coachActive  = $scope.trainsActive[0].coachs[0];
          // $scope.nameTrain    = $scope.trainActive.title;
          //set current
          fromStation  = journey.fromStation;
          // to the station
          toStation  = journey.toStation;
          //time
          $scope.time         = journey.time;
          journey = getTimeTrain(journey, 0);
          ShowLog.show(listTimeTrainJourney, envi);
          if((typeof journeyReturn)      != 'undefined'
              && (typeof journeyReturn)  != 'string'
              && (journeyReturn)  != null){
              if(journeyReturn.listTrain.length > 0){
                journeyReturn = getTimeTrain(journeyReturn, 1);
                ShowLog.show(listTimeTrainJourneyReturn, envi);
              }
          }
          // timestart
          $scope.currentTime  = listTimeTrainJourney[0].timeStart;
          // update seat view
          filterListSeat().then(function(listSeat) {
            changeActiveDivTrain(0);
            changeActiveCoachMenus(0);
          }, function(reason) {
            ShowLog.show(reason);
          });

        }else{
          $state.go('main.home');
        }
      }else{
        $state.go('main.home');
      }
    }

    /**
     * when the customer is choosing the seats
     * this method send request to server get the list event
     * and send the list event to the main state.
     * when the customer move to the register state whick isn't need send
     * request get event from server.
     * @return none;
     */
    var getEvents = function(){
      $http.get(URLServices.getURL('event'))
              .success(function(response, status) {
                var listEvents = response;
                ShowLog.show('get event', envi);
                ShowLog.show(response, envi);
                $scope.$emit('eventList', { listEvent: listEvents });
              }).error(function (data, status, header, config) {

            });
    }
    /*
    * Run method
    */
    checkTrain();
    // get event from server before move to the register state
    getEvents();
});
