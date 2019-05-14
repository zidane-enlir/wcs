// Initialize Firebase
var config = {
  apiKey: "AIzaSyBxiVPyUhLdNhBqfHN-lnwbrAcX_CHDu3o",
  authDomain: "first-web-chat-app-7c157.firebaseapp.com",
  databaseURL: "https://first-web-chat-app-7c157.firebaseio.com",
  projectId: "first-web-chat-app-7c157",
  storageBucket: "first-web-chat-app-7c157.appspot.com",
  messagingSenderId: "602653026850"
};
firebase.initializeApp(config);

//Msg送信準備
const newPostRef = firebase.database();

let room = "room1";

const username = document.getElementById("username");
const output = document.getElementById("output")

//Msg受信処理
function text() {
    newPostRef.ref(room).on("child_added",function(data){
    const v = data.val();
    const k = data.key;
    let str ="";

    str += '<div id="'+ k +'" class="msg_main">'
    str += '<div class="msg_left">';
    str += '<div class=""><img src="img/icon_person.png" alt="" class="icon '+ v.username +'" width="30"></div>';
    str += '<div class="msg">';
    str += '<div class="name">'+ v.username +'</div>';
    str += '<div class="text">'+ v.text +'</div>';
    str += '</div>';
    str += '</div>';
    str += '<div class="msg_right">';
    str += '<div class="time">'+ v.time +'</div>';
    str +='</div>';
    str +='</div>';

    output.innerHTML += str;

     // 追加 (自動スクロール機能)
     $("#output").scrollTop( $("#output")[0].scrollHeight);
    });
}

//時間を取得する関数
function time() {
    var date = new Date();
    var hh = ("0"+date.getHours()).slice(-2);
    var min = ("0"+date.getMinutes()).slice(-2);
    var sec = ("0"+date.getSeconds()).slice(-2);

    var time = hh + ":" + min + ":" + sec;
    return time;
}

// 音声認識処理
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';

// (追加) join
const join = document.getElementById('join');
const content = document.getElementById('content');
// (変更) join. ---------------- //
join.addEventListener('click', function() {
    // （追加）join.
    room = document.getElementById('join-room').value;

    speech.start();

    // （追加） text() ----------//
    text();
});

// （追加） endcall ----------- //
const endcall = document.getElementById('end-call');
endcall.addEventListener('click', function() {
  location.reload();
})


//音声自動文字起こし機能
speech.onresult = function (e) {
    speech.stop();
    if (e.results[0].isFinal) {
      var autotext = e.results[0][0].transcript
      console.log(e);
      console.log(autotext);

      newPostRef.ref(room).push({
        username: username.value,
        text: autotext,
        time: time()
      });

    }
}

speech.onend = () => {
    speech.start()
};
