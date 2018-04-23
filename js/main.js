'use struct';


var timerApp = new Vue({
  el: '#timerApp',
  data: {
    text: "Hello",
    timerList: [
      {title:'diner'   ,datetime: new Date('2018/04/23 16:30:00'), timeRemaining: "00:00:00"},
      {title:'vr_work' ,datetime: new Date('2018/04/23 17:15:00'), timeRemaining: "00:00:00"},
      {title:'sleep'   ,datetime: new Date('2018/04/23 18:30:00'), timeRemaining: "00:00:00"}
    ]
  },
  methods: {
    openWriteTimer() {
      var add_timer = document.getElementById("add_timer");
      var add_button = document.getElementById("add_button");

      add_timer.style.display = "inline";
      add_button.style.display = "none";
    },
    closeWriteTimer() {
      var add_timer = document.getElementById("add_timer");

      add_timer.style.display = "none";
      add_button.style.display = "inline";
    },
    addTimer: function() {
      const title = document.getElementById("add_title").value;
      const date = document.getElementById("add_date").value;
      const time = document.getElementById("add_time").value;

      console.log(date);
      console.log(time);

      timerApp.$data['timerList'].push({
        title:title, datetime: new Date(date+" "+time+":00"), timeRemaining: "00:00:00"
      });
      this.sortTimer();
    },
    deleteTimer: function(e) {
      const index = Number(e.srcElement.parentElement.innerText);
      timerApp.$data['timerList'].splice(index, 1);
    },
    sortTimer: function() {
      timerApp.$data['timerList'].sort(function(a, b){
        if(a.datetime<b.datetime) return -1;
        if(a.datetime>b.datetime) return 1;
        return 0;
      });
    }
  }
});

initDatetimeInput();
setInterval("tickSetTimer()");
function initDatetimeInput(){
  // set time list.
  let options = '';
  for (let hour = 1; hour < 25; hour++) {
    for (let minutes = 0; minutes <= 30; minutes += 30) {
      options += '<option value="'+zeroFilled(hour)+':'+zeroFilled(minutes)+'" />';
    }
  }
  document.getElementById("timeDatelist").innerHTML = options;
  // init time.
  const datetime = new Date();
  document.getElementById("add_time").value =
    zeroFilled(datetime.getHours())+":"+zeroFilled(datetime.getMinutes());
  // init date.
  document.getElementById("add_date").value =
    datetime.getFullYear()+"-"+zeroFilled(datetime.getMonth() + 1)+"-"+zeroFilled(datetime.getDate());
}
function tickSetTimer() {
  const nowDatetime = new Date();
  let timeRemaining;
  for (let i = 0; i<timerApp.$data['timerList'].length; i++) {
    // culc time diff.
    const timerDatetime = getTimeRemaining(timerApp.$data['timerList'][i].datetime);
    // output time diff.
    timeRemaining = ('00' + Math.floor(timerDatetime.hours)).slice(-2) + ":";
    timeRemaining += ('00' + Math.floor(timerDatetime.minutes)).slice(-2) + ":";
    timeRemaining += ('00' + Math.floor(timerDatetime.seconds)).slice(-2);
    timerApp.$data['timerList'][i].timeRemaining = timeRemaining;

    if (timerDatetime.hours + timerDatetime.minutes + timerDatetime.seconds <= 0) {
      modalOpen();
      audioPlay();
    }
  }
}
function getTimeRemaining(endtime){
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}
function zeroFilled(number) {
  return ('00' + number).slice(-2);
}
function audioPlay() {
  let audio = new Audio("../decision.mp3");
  audio.play();
}
//テキストリンクをクリックしたら
function modalOpen(){
    //body内の最後に<div id="modal-bg"></div>を挿入
   $("body").append('<div id="modal-bg"></div>');

  //画面中央を計算する関数を実行
  modalResize();

  //モーダルウィンドウを表示
      $("#modal-bg,#modal-main").fadeIn("slow");

  //画面のどこかをクリックしたらモーダルを閉じる
    $("#modal-bg,#modal-main").click(function(){
        $("#modal-main,#modal-bg").fadeOut("slow",function(){
       //挿入した<div id="modal-bg"></div>を削除
            $('#modal-bg').remove() ;
       });

      });

  //画面の左上からmodal-mainの横幅・高さを引き、その値を2で割ると画面中央の位置が計算できます
   $(window).resize(modalResize);
    function modalResize(){

          var w = $(window).width();
        var h = $(window).height();

          var cw = $("#modal-main").outerWidth();
         var ch = $("#modal-main").outerHeight();

      //取得した値をcssに追加する
          $("#modal-main").css({
              "left": ((w - cw)/2) + "px",
              "top": ((h - ch)/2) + "px"
        });
   }
 }
