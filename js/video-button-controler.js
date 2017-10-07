function vidplay() {
       var video = document.getElementById("Video1");
       var button = document.getElementById("play");
       if (video.paused) {
          video.play();
          //button.textContent = "||";
         document.getElementById('video-button').src='images/icon_image/video-pause-icon.png';
         document.getElementById('video-poster').style.display='none';

      }
          else{
          video.pause();
          document.getElementById('video-button').src='images/icon_image/video-play-icon.png';
          document.getElementById('video-poster').style.display='block';
          //button.textContent = ">";
       }
    }

    function restart() {
        var video = document.getElementById("Video1");
        video.currentTime = 0;
    }
    function skip(value) {
        var video = document.getElementById("Video1");
        video.currentTime += value;
    }
//ToolTip Function
$(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })  