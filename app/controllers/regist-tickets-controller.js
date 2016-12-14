routerApp.controller('RegistTicketsController',  function(ChangeInfor, ShowLog, URLServices, $window, $scope, $rootScope, $http, $state, toastr, $interval, $timeout){
  /*
  * INIT
  */
  /**
   * type object into ticket object.
   * @type {Array}
   * each Object in array
   * 			@attribute {String} name : name of object
   * 			@attribute {Number} discount : discount rate together each object
   * 			@attribute {Array} event : events corresponding discounts
   * 			@attribute {String} titlte : addtional information
   */
  $scope.objects = [
    {
      'name'    : 'Adult',
      'discount': 0,
      'event'   : [],
      'title'   :''
    },
    {
      'name'    : 'Student',
      'discount': 0.2,
      'event'   : [],
      'title'   :'have a student card.'
    },
    {
      'name'    : 'Old person',
      'discount': 0.1,
      'event'   : [],
      'title'   :'than 100 age.'
    },
  ];
  /**
   * company's information of the customer
   * @type {Object}
   */
  var companyCustomer = {
    "nameCompany"     : '',
    "taxNumber"       : '',
    "addressCompany"  : '',
    "emailCompany"    : ''
  }

  // time to hide toastr
  var timOutToastr = 10000;

    // list of customer
    // value default: 3 element
  var listRegisterCustomer = [3];

  var listEventRegister = [];

  // number ticket when customer register
  var ticketRegisterNumber = 0;
  // the first ticket's information
  $scope.firstTicket      = '';
  // the second ticket's information
  $scope.secondTicket     = '';
  // the third ticket's information
  $scope.thirdTicket      = '';

  //discount price each customer's object
  $scope.firstCustomerDiscount      = 0;
  $scope.secondCustomerDiscount     = 0;
  $scope.thirdCustomerDiscount      = 0;

  // attribute ng-show: show or hide customer's information;
  // default value is false(hide information)
  $scope.showThirdTicket  = false;
  $scope.showSecondTicket = false;
  $scope.showFirstTicket  = false;

  // attribute ng-model: get valule of customer's object
  // default is adult
  $scope.selectFirstTicket = 'Adult';
  $scope.selectSecondTicket= 'Adult';
  $scope.selectThirdTicket = 'Adult';

  // addtional information of the customer
  $scope.firstEmail   = "";
  $scope.firstPhone   = "";
  $scope.firstCompany = "";
  $scope.firstAddress = "";

  // default price of the ticket
  $scope.firstDefaultPrice    = 0;
  $scope.secondDefaultPrice   = 0;
  $scope.thirdDefaultPrice    = 0;
  // total price from list of the ticket
  $scope.total                = 0;

  // list event show
  $scope.firstEventsPrice     = 0;
  $scope.secondEventsPrice    = 0;
  $scope.thirdEventsPrice    = 0;
  // index show event for page view
  $scope.firstTicketEventObject     = 0;
  $scope.secondTicketEventObject    = 0;
  $scope.thirdTicketEventObject     = 0;
  // text of the submit button
  $scope.btnContent = 'Register';
  /* time keep list ticket for customer register
  * default value is 7minutes
  */
  $scope.timeKeepListTicket = 420;
  // ng-class: show or hide div timeKeepListTicket
  $scope.viewTimeKeepTicket = "show-div-time-ticket";
  /* the submit button has two value
  * value: true: click to register the ticket
  * 			 false: save the regist to image
  */
  var isRegister   =  true;

 /*
  * array flag to check event register the tickets on server
  * value of each element into array: type{String}
  * 				registered:     registered successlly
  * 				unregistered:   registered fail
  * 				waitregistered: waiting registered from server(default value)
  * 				connecterror:   cannot connect to the server.
  */
  var arrayRegister = ['waitregistered', 'waitregistered', 'waitregistered'];

  /*when customer enter registerpage, after 7 minutes if customer don't register the tickets successlly
  * system auto delete all list ticket an back home.
  */
  var timeKeepTicket = '';
  // using assign $interval which loop for wait the server return response
  var timeWaitServer = '';
  // if the customer registered successlly, after disabled all element of the page
  // to wait the customer save image or other handle
  $scope.isDisabledElement = false;
  /* enviroment to show log on browser
  *  value   dev: show log on browser.
  *  				other value is hide.
  */
  var envi = 'product';
  //change information of page
  ChangeInfor.change('register');
  /*
  * METHODS $SCOPE
  */

  /**
   * check input name of customer when customer fill name
   * @param  {Number} index : position of the ticket
   * @return none;
   */
     $scope.changeName = function(index){
      switch (index) {
        case 1:// first ticket
          // ShowLog.show($scope.inputNameFirstTicket, envi);

          // when customer don't fill name or fill 1 letter
          // $scope.inputNameFirstTicket has value undefined
          if((typeof $scope.inputNameFirstTicket) != 'undefined')
          {
            var len = $scope.inputNameFirstTicket.length;
            var chLast = $scope.inputNameFirstTicket.charAt(len-1);
            // ShowLog.show(len, envi);
            // ShowLog.show($scope.inputNameFirstTicket, envi);
            if((Number(chLast) > 0)){
              // show error
              toastr.error('Name Cannot have any number.','ERROR',{timeOut:timOutToastr});
              // delete number letter
              $scope.inputNameFirstTicket = $scope.inputNameFirstTicket.substring(0, len-1);
            }
          }
          break;
        case 2:// second ticket

          if((typeof $scope.inputNameSecondTicket) != 'undefined')
            {var len = $scope.inputNameSecondTicket.length;
            var chLast = $scope.inputNameSecondTicket.charAt(len-1);
            if((Number(chLast) > 0)){
              toastr.error('Cannot write number here.','ERROR',{timeOut:timOutToastr});
              if(len == 1)
                $scope.inputNameSecondTicket = "undefined";
              else
              $scope.inputNameSecondTicket = $scope.inputNameSecondTicket.substring(0, len-1);
            }}
          break;
        case 3:// third ticket
          if((typeof $scope.inputNameThirdTicket) != 'undefined')
          {  var len = $scope.inputNameThirdTicket.length;
            var chLast = $scope.inputNameThirdTicket.charAt(len-1);
            if((Number(chLast) > 0)){
              toastr.error('Cannot write number here.','ERROR',{timeOut:timOutToastr});
              if(len == 1)
                $scope.inputNameThirdTicket = "undefined";
              else
              $scope.inputNameThirdTicket = $scope.inputNameThirdTicket.substring(0, len-1);
            }}
          break;

        }
    }
    /**
     * handling event: the customer click choose type object of the ticket
     * @param  {String} name : name of the ticket.
     * @return no return
     */
    $scope.chooseObject =  function(name){
      chooseObjectVar(name);
    }

    /**
     * handling event:  the customer remove a ticket from the ticket list.
     * @param  {Numbere} index : position of the ticket
     * @return no return
     */
    $scope.removeTicket  =  function(index){
      removeTicketVar(index);
    }

    /**
     * event register one or list of the tikcets.
     * @return none
     */
    $scope.registerTicket  =  function(){
      // reset value
      arrayRegister = ['waitregistered', 'waitregistered', 'waitregistered'];
      // if cutomer is at register state.
      if(isRegister){
        // flag is mark ticket's sate
        // default value is flase: ticket's iformation is fail
        var isFirstCustomer   = false;
        var isSecondCustomer  = false;
        var isThirdCustomer   = false;

        // reset list of customer
        listRegisterCustomer = [3];
        // === check customer's information

        // the first ticket
        // typeof $scope.firstTicket = string: first ticket not have information
        if( ((typeof $scope.firstTicket) != 'string') ){
          //flag mark check input
          // true is correct information
          // false is not correct information
          var isFirstCustomerName = true;
          var isFirstCustomerID = true;
          // get name and id of first customer
          var firstCustomerName  = $scope.inputNameFirstTicket;
          var firstCustomerID    = $scope.inputIDFirstTicket;
           // check name of customer
           if(!checkInput(firstCustomerName)){
             // change border color of input box
             $scope.classFirstTicketName = "class-boder-red";
             // inform the customer
             toastr.error('Name of the <lable id="lbl-error-toasrt">FIRST ticket </lable> failed.',
                          'Error',{allowHtml:true, timeOut: timOutToastr});
              // set the first ticket have fail information
             isFirstCustomerName = false;
           }else{
             // reset border color if before changed
             $scope.classFirstTicketName = "";
             // name of the first cutomer is correct
             isFirstCustomerName = true;
           }
           // check id of customer
           if(!checkInput(firstCustomerID)){
             $scope.classFirstTicketID = "class-boder-red";
             toastr.error('Passport of the <lable id="lbl-error-toasrt">FIRST ticket </lable> failed.'
                          ,'Error',{allowHtml:true, timeOut: timOutToastr});
             isFirstCustomerID = false;
           }else{
             $scope.classFirstTicketID = "";
             isFirstCustomerID = true;
           }
           // flag customer's information additional
           var isFirstCustomerInforAddtional = false;
           // get addtional information for customer
           var email = $scope.firstCustomerEmail;
           var phone = $scope.firstCustomerPhone;
           var address = $scope.firstCustomerAddress;
           if(validEmail(email) && checkInput(email) && checkInput(phone) && checkInput(address)){
              isFirstCustomerInforAddtional =  true;
            }else{
              //check each element
              if(!checkInput(email)){
                toastr.error('Email of <lable id="lbl-error-toasrt">Customer</lable> failed.'
                             ,'Error',{allowHtml:true, timeOut: timOutToastr});
              }
              if(!validEmail(email))
              toastr.error('Your Email of <lable id="lbl-error-toasrt">was not correct formating.</lable>'
                           ,'Error',{allowHtml:true, timeOut: timOutToastr});
              if(!checkInput(phone)){
                toastr.error('Phone number of <lable id="lbl-error-toasrt">Customer</lable> failed.'
                             ,'Error',{allowHtml:true, timeOut: timOutToastr});
              }
              if(!checkInput(address)){
                toastr.error('Address of <lable id="lbl-error-toasrt">Customer</lable> failed.'
                             ,'Error',{allowHtml:true, timeOut: timOutToastr});
              }
            }
           // if name and id of customer are correct, so create customer prepare to save database.
           if(isFirstCustomerName && isFirstCustomerID && isFirstCustomerInforAddtional){
             // first customer's iformation is correct so
             isFirstCustomer = true;
             // addtional the company's information
             companyCustomer.nameCompany = $scope.firstCompanyName;
             companyCustomer.taxNumber = $scope.firstTaxCompany;
             companyCustomer.addressCompany = $scope.firstCompanyAddress;
             companyCustomer.emailCompany = $scope.firstEmailCompany;
             // create first customer
             var customer =  createCustomer(firstCustomerID, firstCustomerName
                            , address, phone , email, companyCustomer,$scope.firstTicket);
            // add customer to list customer
             listRegisterCustomer[0] = customer;
           }
        }
        // check the second customer's information
        if( ((typeof $scope.secondTicket) != 'string') ){
          //flag mark check input
          // true is correct information
          // false is not correct information
          var isSecondCustomerName = true;
          var isSecondCustomerID = true;
          // get name and id of the second customer
          var secondCustomerName  = $scope.inputNameSecondTicket;
          var secondCustomerID    = $scope.inputIDSecondTicket;
          // check name
          if(!checkInput(secondCustomerName)){

            $scope.classSecondTicketName = "class-boder-red";
            toastr.error('Name of the <lable id="lbl-error-toasrt">SECOND ticket </lable> failed.'
                         ,'Error',{allowHtml:true, timeOut: timOutToastr});

            isSecondCustomerName = false;
          }else{
            $scope.classSecondTicketName = "";
            isSecondCustomerName = true;
          }
          // chekc id
          if(!checkInput(secondCustomerID)){
            $scope.classSecondTicketID = "class-boder-red";
            toastr.error('Passport of the <lable id="lbl-error-toasrt">SECOND ticket </lable> failed.'
                         ,'Error',{allowHtml:true, timeOut: timOutToastr});
            isSecondCustomerID = false;
          }else{
            $scope.classSecondTicketID = "";
            isSecondCustomerID = true;
          }
          // create customer
          if(isSecondCustomerName && isSecondCustomerID){
            isSecondCustomer = true;
            var customer =  createCustomer(secondCustomerID, secondCustomerName
                           , '', '' ,'', companyCustomer,$scope.secondTicket);

            listRegisterCustomer[1] = customer;
          }
        }
        // check the third customer's iformation
        if( ((typeof $scope.thirdTicket) != 'string') ){
          var isThirdCustomerName = true;
          var isThirdCustomerID = true;
          var thirdCustomerName  = $scope.inputNameThirdTicket;
          var thirdCustomerID    = $scope.inputIDThirdTicket;
          // catch erro
          if(!checkInput(thirdCustomerName)){
            $scope.classThirdTicketName = "class-boder-red";
            toastr.error('Name of the <lable id="lbl-error-toasrt">THIRD ticket </lable> failed.'
                         ,'Error',{allowHtml:true, timeOut: timOutToastr});
            isThirdCustomerName = false;
          }else{
            $scope.classThirdTicketName = "";
            isThirdCustomerName = true;
          }
          if(!checkInput(thirdCustomerID) || isThirdCustomer){
            $scope.classThirdTicketID = "class-boder-red";
            toastr.error('Passport of the <lable id="lbl-error-toasrt">THIRD ticket </lable> failed.'
                          ,'Error',{ allowHtml: true, timeOut: timOutToastr});
            isThirdCustomerID = false;

          }else{
            $scope.classThirdTicketID = "";
            isThirdCustomerID = true;
          }
          // made the customer
          if(isThirdCustomerName && isThirdCustomerID){
            isThirdCustomer = true;
            var customer =  createCustomer(thirdCustomerID, thirdCustomerName
                           , '', '' ,'', companyCustomer,$scope.thirdTicket);
            listRegisterCustomer[2] = customer;
          }
        }
        // if the customer register three the tickets
        if((ticketRegisterNumber == 3) && isFirstCustomer && isSecondCustomer && isThirdCustomer){
          // check Passport
          var isTrueInfor = checkPassPort(3);
          // if information do not correct stop here
          if(!isTrueInfor){
            return;
          }
          $rootScope.showLoad = "show-load";
          // save on the server
          saveCustomerOnServer(listRegisterCustomer[0], arrayRegister, 0);
          saveCustomerOnServer(listRegisterCustomer[1], arrayRegister, 1);
          saveCustomerOnServer(listRegisterCustomer[2], arrayRegister, 2);
          // wait rusult from server
          waitReigsterFromServer();

        }else if((ticketRegisterNumber == 2) && isFirstCustomer && isSecondCustomer){// save two ticket

          var isTrueInfor = checkPassPort(2);
          if(!isTrueInfor){
            return;
          }
          $rootScope.showLoad = "show-load";
          // save on the server
          saveCustomerOnServer(listRegisterCustomer[0], arrayRegister, 0);
          saveCustomerOnServer(listRegisterCustomer[1], arrayRegister, 1);
          // wait rusult from server
          waitReigsterFromServer();

      }
        else if( (ticketRegisterNumber == 1) && isFirstCustomer){// líst ticket has one element
          $rootScope.showLoad = "show-load";
          // save on the server
          saveCustomerOnServer(listRegisterCustomer[0], arrayRegister, 0);
          // wait rusult from server
          waitReigsterFromServer();
        }else{
          toastr.warning('Information failed', 'WARNING',{timeOut: timOutToastr});
        }

      }else{
        // then registered ticket successfully
        saveImage();
      }
    }
    /**
     * call when load page
     * @param  {Number} indexObject position of the list objects
     * @param  {Number} indexTicket position of the ticket
     * @return {[type]}             [description]
     */
    $scope.getInforEvent =  function(indexObject, indexTicket){
      return getInforEventVar(indexObject, indexTicket);
    }
    /*
    * METHOD VAR
    */
   /**
    *
    * @return {[type]} [description]
    */
   /**
    * get event from list object
    * @param  {Number} indexObject position of the object into list objects
    * @param  {Number} indexTicket position of the ticket
    * @return {[type]}             [description]
    */
   var getInforEventVar = function(indexObject, indexTicket){
    //  ShowLog.show('eventInfor', envi);
    //  ShowLog.show(indexTicket, envi);
     //change price event and sub price for each ticket
     var events = $scope.objects[indexObject].event;
     if(events.length > 0){
       switch (indexTicket) {
         case 1:
            // reset price
            $scope.firstEventsPrice = 0;
            for(var i = 0; i< events.length; i++){
              // get price from object
              var objectsOfEvent  = events[i].objects;
              var priceDeal = 0;
              for(var j = 0; j <  objectsOfEvent.length; j++){
                if(objectsOfEvent[j].type == $scope.selectFirstTicket){
                  priceDeal = objectsOfEvent[j].price;
                  break;
                }
              }
              $scope.firstEventsPrice += $scope.firstDefaultPrice * Number(priceDeal);
            }
           break;
         case 2:
         // reset price
         $scope.secondEventsPrice = 0;
         for(var i = 0; i< events.length; i++){
           // get price from object
           var objectsOfEvent  = events[i].objects;
           var priceDeal = 0;
           for(var j = 0; j <  objectsOfEvent.length; j++){
             if(objectsOfEvent[j].type == $scope.selectSecondTicket){
               priceDeal = objectsOfEvent[j].price;
               break;
             }
           }
           $scope.secondEventsPrice += $scope.secondDefaultPrice * Number(priceDeal);
         }
         break;
         case 3:
         // reset price
         $scope.thirdEventsPrice = 0;
         for(var i = 0; i< events.length; i++){
           // get price from object
           var objectsOfEvent  = events[i].objects;
           var priceDeal = 0;
           for(var j = 0; j <  objectsOfEvent.length; j++){
             if(objectsOfEvent[j].type == $scope.selectThirdTicket){
               priceDeal = objectsOfEvent[j].price;
               break;
             }
           }
           $scope.thirdEventsPrice += $scope.thirdDefaultPrice * Number(priceDeal);
         }
         break;
       }
     }else{
       switch (indexTicket) {
         case 1:
           $scope.firstEventsPrice = 0;
           break;
         case 1:
           $scope.secondEventsPrice = 0;
           break;
         case 1:
           $scope.secondEventsPrice = 0;
           break;
       }
     }
     // update price of the ticket
     $scope.firstTicket.price = Number($scope.firstDefaultPrice)
                                - Number($scope.firstCustomerDiscount)
                                - Number($scope.firstEventsPrice);
     // update price of the ticket
     $scope.secondTicket.price = Number($scope.secondDefaultPrice)
                                - Number($scope.secondCustomerDiscount)
                                - Number($scope.secondEventsPrice);
     // update price of the ticket
     $scope.thirdTicket.price = Number($scope.thirdDefaultPrice)
                                - Number($scope.thirdCustomerDiscount)
                                - Number($scope.thirdEventsPrice);
     // update total price
     $scope.total = $scope.thirdDefaultPrice - $scope.thirdCustomerDiscount - $scope.thirdEventsPrice
                   + $scope.secondDefaultPrice - $scope.secondCustomerDiscount - $scope.secondEventsPrice
                   + $scope.firstDefaultPrice - $scope.firstCustomerDiscount - $scope.firstEventsPrice;
     return events;
   }
   var waitReigsterFromServer =  function(){
     // loop for wait response from the server
     var timeLeft = 1000;
     timeWaitServer = $interval(function () {
       ShowLog.show(arrayRegister[0] + " "+ arrayRegister[1] + " "+ arrayRegister[2]);
       // time increase to 1 second
       timeLeft += 1000;
       ShowLog.show('lop '+ timeLeft, envi);
       // if the server return response before 35 second;
       if(ticketRegisterNumber == 3
          && arrayRegister[0] != 'waitregistered'
          && arrayRegister[1] != 'waitregistered'
          && arrayRegister[2] != 'waitregistered'){
            $rootScope.showLoad = "hide-load";
            // handle generate
            // disabled all element in page
            $scope.isDisabledElement = true;
            // handle each result
            if(arrayRegister[0] == 'connecterror'
                && arrayRegister[1] == 'connecterror'
                && arrayRegister[2] == 'connecterror'){
              $scope.isDisabledElement = false;
            }else if(arrayRegister[0] == 'registered'
                || arrayRegister[1] == 'registered'
                || arrayRegister[2] == 'registered'){
              isRegister =  false;
              $scope.btnContent = "Save image";
              sendMail(listRegisterCustomer);
            }
            stopWaitServer();
       }else if(ticketRegisterNumber == 2
                && arrayRegister[0] != 'waitregistered'
                && arrayRegister[1] != 'waitregistered'){
              $rootScope.showLoad = "hide-load";
              // handle generate
              // disabled all element in page
              $scope.isDisabledElement = true;
              // handle each result
              if(arrayRegister[0] == 'connecterror'
                  && arrayRegister[1] == 'connecterror'){
                $scope.isDisabledElement = false;
              }else if(arrayRegister[0] == 'registered'
                  || arrayRegister[1] == 'registered'){
                isRegister =  false;
                $scope.btnContent = "Save image";
                sendMail(listRegisterCustomer);
              }
              stopWaitServer();
       }else if(ticketRegisterNumber == 1
                && arrayRegister[0] != 'waitregistered'){
            // ShowLog.show('a ticket', envi);
            // ShowLog.show(arrayRegister[0], envi);
            // handle generate
            // disabled all element in page
            $scope.isDisabledElement = true;
            // hide div load
            $rootScope.showLoad = "hide-load";
            // handle each result
            if(arrayRegister[0] == 'connecterror'){
              $scope.isDisabledElement = false;
            }else if(arrayRegister[0] == 'registered'){
              isRegister =  false;
              $scope.btnContent = "Save image";
              sendMail(listRegisterCustomer);
            }
            stopWaitServer();
       }

       if(timeLeft === 35000){// wait the server about 35 seconds

         //stop loop
         stopWaitServer();
       }
     }, 1000);
   }
   /**
    * stop loop
    * @return none;
    */
   var stopWaitServer = function(){
      $interval.cancel(timeWaitServer);
      timeWaitServer = undefined;
   }
    /**
     * save customer to the server(in other words, register the tickets)
     * @param  {Object} customer      customer's infotmation
     * @param  {Array} arrayRegister  flag check result register ticket event
     * @param  {Number} position      postion the ticket will be register
     * @return none
     */
    var saveCustomerOnServer =  function(customer, arrayRegister, position  ){
      $http.post(URLServices.getURL('customer'), customer,{timeout: 25000})
          	.success(function (data, status, headers, config) {
          	   // show inform for the customer
          	  toastr.success('Name: '+ customer.name
          	  +" \n"+customer._id+" success", 'Registed',
          	  {timeOut: timOutToastr});
              // assign result
              arrayRegister[position] = 'registered';
          	})
          	.error(function (data, status, header, config) {

          	  if(data == null){
          		toastr.error('Cannot connect to the server. Please try again after few minutes. Thanks',
          					'Error',{timeOut:timOutToastr});
                arrayRegister[position] = 'connecterror';
                // stop
            		return;
          	  }
              arrayRegister[position] = 'unregistered';
          	  toastr.error('Name: '+ customer.name
          					  +" \n"+customer._id+" "+data.error,'Error',{timeOut:30000});
              // delete the ticket from ticket list
          	  removeTicketVar(Number(position) + 1);
          	});
    }
    /**
     * handling event:  the customer remove a ticket from the ticket list.
     * @param  {Numbere} index : position of the ticket
     * @return no return
     */
    var removeTicketVar =  function(index){
      // remove the first ticket
     if(index == '1'){
       if(ticketRegisterNumber == 3) {// if list have three ticket
         // update number of list ticket
         ticketRegisterNumber     -= 1;
         // move second ticket to first ticket
         $scope.showFirstTicket  = true;
         $scope.firstTicket     = $scope.secondTicket;
         $scope.firstDefaultPrice= $scope.secondDefaultPrice;
         $scope.firstCustomerDiscount     = $scope.secondCustomerDiscount;
         // set name and id
         $scope.inputNameFirstTicket =$scope.inputNameSecondTicket;
         $scope.inputIDFirstTicket = $scope.inputIDSecondTicket;

         //move three to two
         $scope.showSecondTicket  = true;
         $scope.secondTicket     = $scope.thirdTicket;
         $scope.secondDefaultPrice= $scope.thirdDefaultPrice;
         $scope.secondCustomerDiscount     = $scope.thirdCustomerDiscount;
         // set name and id
         $scope.inputNameSecondTicket =$scope.inputNameThirdTicket;
         $scope.inputIDSecondTicket = $scope.inputIDThirdTicket;

         // delete three ticket
         $scope.showThirdTicket  = false;
         $scope.thirdTicket      = '';
         $scope.thirdDefaultPrice    = 0;
         $scope.thirdCustomerDiscount      = 0;

       }else if(ticketRegisterNumber == 2){// if list have two tickets
         ticketRegisterNumber     -= 1;
         $scope.showFirstTicket  = true;
         $scope.firstTicket     = $scope.secondTicket;
         $scope.firstDefaultPrice= $scope.secondDefaultPrice;
         $scope.firstCustomerDiscount     = $scope.secondCustomerDiscount;
         // set name and id
         $scope.inputNameFirstTicket =$scope.inputNameSecondTicket;
         $scope.inputIDFirstTicket = $scope.inputIDSecondTicket;
         //move three to two
         $scope.showSecondTicket  = false;
         $scope.secondTicket     = '';
         $scope.secondDefaultPrice= 0;
         $scope.secondCustomerDiscount     = 0;
       }else{
         $scope.showFirstTicket  = false;
         $scope.firstTicket      = '';
         $scope.firstDefaultPrice    = 0;
         $scope.firstCustomerDiscount      = 0;
       }

     }else if(index  == '2'){ // remove second ticket
       if(ticketRegisterNumber == 3) {// if list have three tickets
         //move three to two
         ticketRegisterNumber     -= 1;
         $scope.showSecondTicket  = true;
         $scope.secondTicket     = $scope.thirdTicket;
         $scope.secondDefaultPrice= $scope.thirdDefaultPrice;
         $scope.secondCustomerDiscount     = $scope.thirdCustomerDiscount;
         // set name and id
         $scope.inputNameSecondTicket =$scope.inputNameThirdTicket;
         $scope.inputIDSecondTicket = $scope.inputIDThirdTicket;
         // delete three ticket
         $scope.showThirdTicket  = false;
         $scope.thirdTicket      = '';
         $scope.thirdDefaultPrice    = 0;
         $scope.thirdCustomerDiscount      = 0;

       }else{// if list have two tickets
         ticketRegisterNumber     -= 1;
         $scope.showSecondTicket  = false;
         $scope.secondTicket      = '';
         $scope.secondDefaultPrice    = 0;
         $scope.secondCustomerDiscount      = 0;
       }
     }else if(index == '3'){// remove third ticket
         ticketRegisterNumber     -= 1;
         $scope.showThirdTicket  = false;
         $scope.thirdTicket      = '';
         $scope.thirdDefaultPrice    = 0;
         $scope.thirdCustomerDiscount      = 0;
       }
     // check list of ticket if it is empty change state to main.home
     if( ((typeof $scope.firstTicket) == 'string')
         && ((typeof $scope.secondTicket) == 'string')
         && ((typeof $scope.thirdTicket) == 'string' )){
           $state.go('main.home');
         }
     // update total price
    //  ShowLog.show($scope.thirdEventsPrice +" "+ $scope.secondEventsPrice +" "+$scope.firstEventsPrice, envi);
     $scope.total = $scope.thirdDefaultPrice - $scope.thirdCustomerDiscount - $scope.thirdEventsPrice
                   + $scope.secondDefaultPrice - $scope.secondCustomerDiscount - $scope.secondEventsPrice
                   + $scope.firstDefaultPrice - $scope.firstCustomerDiscount - $scope.firstEventsPrice;
    }

    /**
     * validate email is correct formating?
     * @param  {String} email : email will be validate
     * @return {Boolean}   true if email is correct formating, false otherwise;
     */
    function validEmail(email) {
        var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return String(email).search (filter) != -1;
    }
    /**
     * send mail to customer when the customer registered
     * @param  {Array} listCusomter : list of the customer to get information and
     *                              	send mail to first customer who registerd the list of tickets.
     * @return {}  not return value.
     */
    var sendMail =  function(listCusomter){
      // row contain in table which contain ticket's information
      var rowTable = "";
      for(var i = 0; i < listCusomter.length; i++){
        var color = '';
        if( i % 2 == 0)
          color = "#CDDC39";
        else
          color = "#DCE775";
        rowTable +=   "      <tr style='backround: "+ color +";'>"
                    + "        <td>" + listCusomter[i].ticket._id + "</td>"
                    + "        <td>" + listCusomter[i].name + "</td>"
                    + "        <td>" + listCusomter[i]._id + "</td>"
                    + "        <td>" + "+84" + listCusomter[i].phone + "</td>"
                    + "        <td>" + listCusomter[i].address + "</td>"
                    + "        <td>" + formatDate(new Date(listCusomter[i].ticket.dateBuy)) + "</td>"
                    + "        <td>" + formatDate(new Date(listCusomter[i].ticket.date)) + "</td>"
                    + "        <td>" + listCusomter[i].ticket.startStation + "</td>"
                    + "        <td>" + listCusomter[i].ticket.endStation + "</td>"
                    + "        <td>" + listCusomter[i].ticket.price + "</td>"
                    + "        <td>" + listCusomter[i].ticket.object + "</td>"
                    + "      </tr>";
      }
      // content mail when send to customer
      var body = {
        "to"      : listCusomter[0].email,
        "subject" : "Register Train Ticket",
        "html"    : "Hi "+ listCusomter[0].name + ","
                    + "<br> <br>"
                    + "You registered the train ticket successfully at "+ $window.location.href  +". <br>"
                    + "Ticket Number: " + listCusomter.length
                    + "<br>"
                    + "<br>"
                    + " <table border='1' style='border-collapse: collapse;'>"
                    + "      <tr style='backround: #64B5F6;'>"
                    + "        <td>Ticket ID  </td>"
                    + "        <td>Name</td>"
                    + "        <td>Passport</td>"
                    + "        <td>Phone</td>"
                    + "        <td style='text-align: center;'>Address</td>"
                    + "        <td>Time register</td>"
                    + "        <td>Time train</td>"
                    + "        <td>Begin Station</td>"
                    + "        <td>End Station</td>"
                    + "        <td>Price</td>"
                    + "        <td>Object</td>"
                    + "      </tr>"
                    + rowTable
                    + "    </table>"
                    + "<br>"
                    + "Please go to the station get the ticktets."
                    + "<br>"
                    + "<br>"
                    + "Thanks,<br>"
                    + "TrainTicketsSystem"
      }
      // call server to send mail
      $http.post(URLServices.getURL('mail'), body)
            .success(function (data, status, header, config) {
              toastr.success('Sent mail to your. Please check your mail.','Success',{timeOut:30000});
            })
            .error(function (data, status, header, config) {
              if(data == null){
                toastr.error('Cannot connect to the server. Please try again after few minutes. Thanks',
                            'Error',{timeOut:timOutToastr});
                return;
              }
              toastr.error("Error: "+data,'Error',{timeOut:timOutToastr});
            });
    }
    // format date view
    var formatDate = function(date){
      return ""+date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()
               + " " + date.getHours()+":"+date.getMinutes();
    }

    /**
     * handle event the customer click choose type object of the ticket.
     * This function is declare 'var', because can be called here and
     * call in regist-tickets.tml through the varibal $scope.
     *
     * @param  {String} name : name of the ticket.
     * @return no return;
     */
    var chooseObjectVar =  function(name){

      switch (name) {
        case 'first':
          // get value had chosen by customer.
          var objectName = $scope.selectFirstTicket;
          // ShowLog.show('select');
          // ShowLog.show(objectName, envi);
          // ShowLog.show((objectName == 'Old person') + "old ", envi);
          // ShowLog.show((objectName == 'Student') + "student ", envi);
          if(objectName == 'Old person'){
            // change event follow object
            $scope.firstTicketEventObject    = 2;
            $scope.firstCustomerDiscount      = $scope.objects[2].discount;
          }else if( objectName == 'Student'){
            // change event follow object
            $scope.firstTicketEventObject    = 1;
            $scope.firstCustomerDiscount      = $scope.objects[1].discount;
          }else{// adult
            objectName = 'Adult';
            // change event follow object
            $scope.firstTicketEventObject    = 0;
            $scope.firstCustomerDiscount      = $scope.objects[0].discount;
          }
          // ShowLog.show($scope.firstCustomerDiscount + "discount ", envi);
          // calculate discount
          $scope.firstCustomerDiscount =  Number($scope.firstDefaultPrice) * Number($scope.firstCustomerDiscount) ;
          // ShowLog.show($scope.firstCustomerDiscount + "discount ", envi);
          // update price of the ticket
          $scope.firstTicket.price = Number($scope.firstDefaultPrice) - Number($scope.firstCustomerDiscount)
                                     - Number($scope.firstEventsPrice);
          // ShowLog.show($scope.firstTicket.price + "discount ", envi);
          // update object of the tikcet
          $scope.firstTicket.object = objectName;
          break;
        case 'second':

            var objectName = $scope.selectSecondTicket;
          if( objectName == 'Old person'){
              // change event follow object
              $scope.secondTicketEventObject    = 2;
              $scope.secondCustomerDiscount      = $scope.objects[2].discount;
            }else if( objectName == 'Student'){
                // change event follow object
                $scope.secondTicketEventObject     = 1;
              $scope.secondCustomerDiscount      = $scope.objects[1].discount;
            }else{// adult
                // change event follow object
                $scope.secondTicketEventObject     = 0;
              objectName = 'Adult';
              $scope.secondCustomerDiscount      = $scope.objects[0].discount;
            }
            $scope.secondCustomerDiscount =  Number($scope.secondDefaultPrice)
                                              * Number($scope.secondCustomerDiscount) ;
            // update price of the ticket
            $scope.secondTicket.price = Number($scope.secondDefaultPrice)
                                        - Number($scope.secondCustomerDiscount)
                                        - Number($scope.secondEventsPrice);

            // update object of the tikcet
            $scope.secondTicket.object = objectName;
          break;
        case 'third':
            var objectName = $scope.selectThirdTicket;
            if( objectName == 'Old person'){
                // change event follow object
                $scope.thirdTicketEventObject     = 2;
              $scope.thirdCustomerDiscount      = $scope.objects[2].discount;
            }else if( objectName == 'Student'){
                // change event follow object
                  $scope.thirdTicketEventObject     = 1;
              $scope.thirdCustomerDiscount      = $scope.objects[1].discount;
            }else{// adult
              // change event follow object
              $scope.thirdTicketEventObject     = 0;
              objectName = 'Adult';
              $scope.thirdCustomerDiscount      = $scope.objects[0].discount;
            }
            $scope.thirdCustomerDiscount =  Number($scope.thirdDefaultPrice)
                                            * Number($scope.thirdCustomerDiscount);
            // update price of the ticket
            $scope.thirdTicket.price = Number($scope.thirdDefaultPrice)
                                       - Number($scope.thirdCustomerDiscount)
                                       - Number($scope.thirdEventsPrice);

            // update object of the tikcet
            $scope.thirdTicket.object = objectName;
          break;
      }
      // update total price
      $scope.total = $scope.thirdDefaultPrice - $scope.thirdCustomerDiscount - $scope.thirdEventsPrice
                    + $scope.secondDefaultPrice - $scope.secondCustomerDiscount - $scope.secondEventsPrice
                    + $scope.firstDefaultPrice - $scope.firstCustomerDiscount - $scope.firstEventsPrice;
    }

    /**
     * check passport of customer
     * @param  {Number} condition: ticket number
     * @return {Boolean} true  if there are two or
     *                         more tickets together passport number
    *                          ; false otherwise
     */
    var checkPassPort =  function(condition){

      if(condition == 3){// check three the tickets
        // assigned value
        var firstTicket =  $scope.firstTicket;
        var secondTicket =  $scope.secondTicket;
        var thirdTicket =  $scope.thirdTicket;
        // at the moment cannot have one customer can register two tickets which are same journey.
        // check first customer and second customer
        if(firstTicket.isReturn == secondTicket.isReturn){
          if(listRegisterCustomer[0]._id == listRegisterCustomer[1]._id){
            toastr.error("Ticket 1 and Ticket 2 are same Passport.","ERROR",{timeOut: timOutToastr});
            // stop check here
            return false;
          }
        }
        // check first customer and third customer
        if(firstTicket.isReturn == thirdTicket.isReturn){
          if(listRegisterCustomer[0]._id == listRegisterCustomer[2]._id){
            toastr.error("Ticket 1 and Ticket 3 are same Passport.","ERROR",{timeOut: timOutToastr});
            return false;
          }
        }
        // check third customer and second customer
        if(thirdTicket.isReturn == secondTicket.isReturn){
          if(listRegisterCustomer[2]._id == listRegisterCustomer[1]._id){
            toastr.error("Ticket 2 and Ticket 3 are same Passport.","ERROR",{timeOut: timOutToastr});
            return false;
          }
        }
        // when end check if no any wrong, so return true;
        return true;
      }else{ // check two the tickets

        var firstTicket =  $scope.firstTicket;
        var secondTicket =  $scope.secondTicket;
        if(firstTicket.isReturn == secondTicket.isReturn){
          if(listRegisterCustomer[0]._id == listRegisterCustomer[1]._id){
            toastr.error("Ticket 1  and Ticket 2 are same Passport.","ERROR",{timeOut: timOutToastr});
            return false;
          }
        }
        return true;
      }

    }

    /**
     * create a customer
     * @param  {String} id      passport of the customer
     * @param  {String} name    name of the customer
     * @param  {String} address address of the customer
     * @param  {String} phone   phone of the customer
     * @param  {String} email   email of the customer
     * @param  {Object} company company of the customer
     * @param  {Object} ticket  ticket of the customer
     * @return {Customer}       return one customer with full information
     */
    var createCustomer =  function(id, name, address
                                    , phone, email, company, ticket){
            var customer= {
            "_id"     : id,
            "name"    : name,
            "address" : address,
            "phone"   : phone,
            "email"   : email,
            "company": company,
            "ticket": ticket
          }
          return customer
    }
    // check string input
    // return true if this string has than 1 letter; false otherwise.
    /**
     * check string input: name, nameCompany,.. mainly check the length
     * @param  {String} str string need check.
     * @return {Boolean}    true if the string has than two the letters,
     *                           false othe wise
     */
    var checkInput  = function(str){
      if(str == null)
        return false;
      if(((typeof str) == 'undefined') )
        return false;
      if((str.length < 2)){
        return false;
      }
      return true;
    }

    /**
     * using assign begin values for the ticket list
     *  when from page position-seat to here.
     * @return none;
     */
    var getTicket   = function(){
      if($scope.listTickets.length == 3){
        ticketRegisterNumber       = 3;
        // get the first ticket
        $scope.firstTicket        = $scope.listTickets[0];
        $scope.firstDefaultPrice  = $scope.listTickets[0].price;
        // second ticket
        $scope.secondTicket     = $scope.listTickets[1];
        $scope.secondDefaultPrice  = $scope.listTickets[1].price;
        //third ticket
        $scope.thirdTicket      = $scope.listTickets[2];
        $scope.thirdDefaultPrice  = $scope.listTickets[2].price;
        // show list of the tickets
        $scope.showThirdTicket  = true;
        $scope.showSecondTicket = true;
        $scope.showFirstTicket  = true;
      }else if($scope.listTickets.length == 2){
        ticketRegisterNumber     = 2;
        // infor
        // first ticket
        $scope.firstTicket      = $scope.listTickets[0];
        $scope.firstDefaultPrice  = $scope.listTickets[0].price;
        // second ticket
        $scope.secondTicket     = $scope.listTickets[1];
        $scope.secondDefaultPrice  = $scope.listTickets[1].price;
        // show list of the tickets
        $scope.showSecondTicket = true;
        $scope.showFirstTicket = true;
      }else if($scope.listTickets.length == 1){
        ticketRegisterNumber     = 1;
        $scope.firstTicket      = $scope.listTickets[0];
        $scope.firstDefaultPrice  = $scope.listTickets[0].price;
        // show list of the tickets
        $scope.showFirstTicket = true;
      }else{
        $state.go('main.home');
      }
      // update total price
      // ShowLog.show($scope.thirdEventsPrice +" "+ $scope.secondEventsPrice +" " +$scope.firstEventsPrice, envi);
      $scope.total = $scope.thirdDefaultPrice - $scope.thirdCustomerDiscount - $scope.thirdEventsPrice
                    + $scope.secondDefaultPrice - $scope.secondCustomerDiscount - $scope.secondEventsPrice
                    + $scope.firstDefaultPrice - $scope.firstCustomerDiscount - $scope.firstEventsPrice;
    }
  /**
   * add events to type object of the ticket
   * @return none;
   */
    var addEventToObject =  function(){
      if(listEventRegister.length > 0){
        var listEvent = listEventRegister;
        for(var i = 0;  i< listEvent.length; i++){
          var objects = listEvent[i].objects;
          for(var j = 0; j < objects.length; j++){
            switch (objects[j].type) {
              case 'Adult':
              // limit event for object
                if(  $scope.objects[0].event.length <=2)
                    $scope.objects[0].event.push(listEvent[i]);
                break;
              case 'Student':
              // limit event for object
              if(  $scope.objects[1].event.length <=2)
                  $scope.objects[1].event.push(listEvent[i]);
                break;
              case 'Old person':
              // limit event for object
              if(  $scope.objects[2].event.length <=2)
                  $scope.objects[2].event.push(listEvent[i]);
                break;

            }
          }
        }
      }
      ShowLog.show('object event', envi);
      ShowLog.show($scope.objects, envi);
    }
    /**
     * filter the event died and remove them.
     * @return none;
     */
    var filterEvent = function(){
      // ShowLog.show('regist', envi);
      listEventRegister = $scope.listEvent;
      // ShowLog.show('before', envi);
      //  ShowLog.show($scope.listEvent, envi);
      //  ShowLog.show(listEventRegister, envi);
      if(listEventRegister.length > 0){
        var listEvent = JSON.parse( JSON.stringify(listEventRegister));
        listEventRegister = [];
        for(var i = 0;  i< listEvent.length; i++){
          var endTime =  listEvent[i].timeEnd;
          var startTime =  listEvent[i].timeBegin;
          var dateNow =  new Date().getTime();
          if((Number(endTime) >= Number(dateNow)) &&  (Number(startTime) <= Number(dateNow))){
            listEventRegister.push(listEvent[i]);
          }
        }
        // ShowLog.show(listEventRegister, envi);
      }
      // ShowLog.show('after', envi);
       ShowLog.show(listEventRegister, envi);
      if(listEventRegister.length > 0){
        // add event to each object
        addEventToObject();
      }
    }
    /**
     * change dive to image
     * @return none
     */
    var saveImage =  function(){
      html2canvas($("#div-register"), {
       onrendered: function(canvas) {
           // canvas is the final rendered <canvas> element
           var myImage = canvas.toDataURL("image/png");
           $window.open(myImage);
       }
     });
    }
    /**
     * show time keep the ticket list one page register
     * when end time, the ticket list will auto delete and back home page
     * @return none;
     */
    var timeKeepTicket =  function(){
      $scope.viewTimeKeepTicket = "show-div-time-ticket";
      timeKeepTicket =  $interval(function () {
        $scope.timeKeepListTicket --;
        if(Number($scope.timeKeepListTicket) == 0){
          $scope.firstTicket = '';
          $scope.secondTicket = '';
          $scope.thirdTicket = '';
          $scope.viewTimeKeepTicket = "hide-div-time-ticket";
          $interval.cancel(timeKeepTicket);
          timeKeepTicket = undefined;
          $state.go('main.home');
        }

      }, 1000);
    }
    /*
    * RUN METHODS
    */
    /*
    * run the functions to get value init.
     */
    getTicket();
    timeKeepTicket();
    filterEvent();
});
