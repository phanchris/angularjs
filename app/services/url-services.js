routerApp.service('URLServices', function() {
  // var urlPage   = "http://traintickets-61869.onmodulus.net/";
  var urlPage   = "http://localhost:2100/";
  var urlPage2  = "https://sheltered-hollows-98630.herokuapp.com/";
  var urlPage3  = "http://traintickets-61882.onmodulus.net/";
    this.getURL = function (name) {
        switch (name) {
          case 'customer':
              return urlPage+"customer";
          case 'train':
                return urlPage+"train";
          case 'event':
                return urlPage+"eventtrain";
          case 'mail':
                return urlPage+"mail";
          case 'admin':
                return urlPage+"admin";
        }
    }
});
