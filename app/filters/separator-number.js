routerApp.filter('separatorThousand', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(number) {

    // Ensure that the passed in data is a number
    if(isNaN(number) || number < 1) {

      // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      return number;

    } else {

      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.
      var numberString = number.toString();
      var result = '';
      var j = 0;
      for(var i =  numberString.length - 1; i >= 0; i--){
        j++;
        if(j == 3 && i > 0){// engough thousand
          result = ","+numberString.charAt(i) + result;
        }else{
          result = numberString.charAt(i) + result;
        }
      }
      return result;
    }
  }
});
