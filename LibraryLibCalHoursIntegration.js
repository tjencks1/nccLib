var output = '';
  var current_week = 0;
  jQuery( document ).ready(function($) {
   if(document.getElementById("hours-results")){
    text = $.getJSON("https://noctrl.libcal.com/widget/hours/grid?iid=5971&format=json&weeks=4&systemTime=0",
      function(data) {
        $.each(data.locations[0].weeks, function (week, days) {
          hidden = 'hidden';
          if(week == 0)
            hidden = '';
          output += "<div id='week_" + week + "' class = '" + hidden + "'>";
          output += "<ul class='weeks'>"
          $.each(days, function (day, obj) {
            date = new Date(obj.date);
            output += "<li class='day" + is_today(obj.date) +"'>";
            output += "<span class='day_name'>" + day_abbr(obj.date) + ", </span>";
            output += "<span class='hours_date'>" + format_date(obj.date) + "</span>";
            output += "<span class='hours_time'>" + obj.rendered + "</span>";
            output += "</li>";
          });
          output += "</ul></div>";
        });
        //output += "";
        $('#hours-results').html(output);
      });
   }
  function format_date(date)
  {
    date = date.replace(/-/gi, "/");
    date = new Date(date);
    arr = date.toUTCString().split(" ");
    return arr[2] + " " + arr[1];
  }
  function is_today(date)
  {
    date = date.replace(/-/gi, "/");
    if (new Date(date).toDateString() == new Date().toDateString())
      return " today";
    return "";
  }
function day_abbr(date)
  {
    arr = new Date(date).toUTCString().split(" ");
    return arr[0].replace(",","");
  }
  $('#left_arrow').click(function (e)
  {
    $('#week_' + current_week).addClass("hidden");
    if(current_week > 0){
      current_week = current_week - 1;
    }
    $('#week_' + current_week).removeClass("hidden");
  });
  $('#right_arrow').click(function (e)
  {
    $('#week_' + current_week).addClass("hidden");
    if(current_week < 3){
      current_week = current_week + 1;
    }
    $('#week_' + current_week).removeClass("hidden");
  });
});