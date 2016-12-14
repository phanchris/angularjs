
$(function(){
    $('#from').autoComplete({
        minChars: 1,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = ["Ha Noi","Sai Gon" ,"Nha Trang","Quy Nhon","Da Nang","Tam Ky","Hue","Dong Hoi","Quang Tri"
                            ,"Nam Dinh","Vinh" ,"Thanh Hoa","Ha Long","Mao Khue","Bien Hoa","Tuy Hoa","Dieu Tri"
                            ,"Quy Nhon","Quang Ngai","Bong Son","Binh Thuan","Phan Thiet"];
            var suggestions = [];
            for (i=0;i<choices.length;i++)
                if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
            suggest(suggestions);
        }
    })
});
$(function(){
    $('#to').autoComplete({
        minChars: 1,
        source: function(term, suggest){
            term = term.toLowerCase();
            var choices = ["Ha Noi","Sai Gon" ,"Nha Trang","Quy Nhon","Da Nang","Tam Ky","Hue","Dong Hoi","Quang Tri"
                            ,"Nam Dinh","Vinh" ,"Thanh Hoa","Ha Long","Mao Khue","Bien Hoa","Tuy Hoa","Dieu Tri"
                            ,"Quy Nhon","Quang Ngai","Bong Son","Binh Thuan","Phan Thiet"];
            var suggestions = [];
            for (i=0;i<choices.length;i++)
                if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
            suggest(suggestions);
        }
    })
});
var $input = $('.datepicker').pickadate({
    formatSubmit: 'yyyy/mm/dd',
    // min: [2015, 7, 14],
    calender: '#calender',
    // editable: true,
    closeOnSelect: false,
    closeOnClear: false,
});
var picker = $input.pickadate('picker');
function autoDate(dateCurrent, element) {
    var month = dateCurrent.getMonth();
    var textMonth;
    switch (month) {
        case 0:
            textMonth = 'January';
            break;
        case 1:
            textMonth = 'February';
            break;
        case 2:
            textMonth = 'March';
            break;
        case 3:
            textMonth = 'April';
            break;
        case 4:
            textMonth = 'May'
            break;
        case 5:
            textMonth = 'June'
            break;
        case 6:
            textMonth = 'July'
            break;
        case 7:
            textMonth = 'Auhust'
            break;
        case 8:
            textMonth = 'September'
            break;
        case 9:
            textMonth = 'October'
            break;
        case 10:
            textMonth = 'November'
            break;
        case 11:
            textMonth = 'December';
            break;
        default:
            textMonth = 'July';
    }
    document.getElementById(element).value = dateCurrent.getDate()+' '+textMonth +', '+dateCurrent.getFullYear();
}
