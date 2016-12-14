routerApp.controller('ContactController',  function(ChangeInfor,URLServices,  ShowLog, toastr, $scope, $rootScope, $http, $state, $window){
  // change information page
  ChangeInfor.change('contact');
  // firt number for the question
  $scope.firstNumer = $window.Math.round($window.Math.random()*100+10);
  // second number for the question
  $scope.secondNumer = $window.Math.round($window.Math.random()*100+10);
  // name of customer contact
  $scope.customerContactName = '';
  // mail of customer contact
  $scope.customerContactMail = '';
  // mail of customer contact
  $scope.contentContact = '';
  // the customer answer for the question
  $scope.answer = '';
  // enviroment
  var envi = 'product';
  // change acitve menu when customer edit
  changeMainMenus(5);
  $scope.send =  function(){

    if((typeof $scope.customerContactName) == 'undefined'
        || (typeof $scope.customerContactMail) == 'undefined'
        || (typeof $scope.contentContact) == 'undefined'
        || (typeof $scope.answer) == 'undefined'){
            toastr.error('Please, ','ERROR');
      }else{
        if(Number($scope.answer) == (Number($scope.firstNumer) + Number($scope.secondNumer))){
          // show div wait the server
          $rootScope.showLoad = "show-load";
          var name = $scope.customerContactName;
          var mail = $scope.customerContactMail;
          var content = $scope.contentContact;
          sendMail(name, mail, content);
        }else{
          toastr.error('Please, Your answer was not corret! ','ERROR');
        }

      }
  }
  /**
   * send mail to admi
   * @param  {String} name    name of the customer
   * @param  {String} mail    mail of the customer
   * @param  {String} content content of the customer want to contact wit admin
   * @return none
   */
  var sendMail =  function(name, mail, content){

    // content mail when send to customer
    var body = {
      "to"      : "trainticketsystem@gmail.com",
      "subject" : "Customer contact to TrainTicketsSystem",
      "html"    : "Hi Admin,"
                  + "<br> <br>"
                  + "Your request from the customer name <b> '"+ name + "'</b> "
                  +" and the customer's mail is "+ mail
                  +"<br>"
                  + "Content:"
                  +"<br><pre>"
                  + content
                  + "</pre><br>"
                  + "Thanks,<br>"
                  + "TrainTicketsSystem"
    }
    // call server to send mail
    $http.post(URLServices.getURL('mail'), body)
          .success(function (data, status, header, config) {
            // hide div wait the server
            $rootScope.showLoad = "hide-load";
            toastr.success('Sent mail to TrainTicketsSystem. Thank you for your contribute.','Success',{timeOut:10000});
          })
          .error(function (data, status, header, config) {
            // hide div wait the server
            $rootScope.showLoad = "hide-load";
            if(data == null){
              toastr.error('Cannot connect to the server. Please try again after few minutes. Thanks',
                          'Error',{timeOut:timOutToastr});
              return;
            }
            toastr.error("Error: "+data,'Error',{timeOut:timOutToastr});
          });
  }



});
