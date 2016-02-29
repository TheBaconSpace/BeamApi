/* global $ */
/*

JACKEL'S JS DONT TOUCH :)

*/
$(document).ready(function() {
  searchUser('freecodecamp'); // on page load, pass user freecodecamp

});
var user = {
  name: '', // can put in default values if they do not exist...
  bio: '',
  logo: '',
  streamdesc: 'Not Live',
  streamlogo: '',
  profileurl: '',
  viewers: '0',
  islive: 'false',
  offlinebanner: '',

  pastvideo1:'',
  pastvideo2:'',
  pastvideo3:'',
  pastvideo4:'',

  pastvideo1url1:'',
  pastvideo1url2:'',
  pastvideo1url3:'',
  pastvideo1url4:'',

  pastvideo1title:'',
  pastvideo2title:'',
  pastvideo3title:'',
  pastvideo4title:'',

  pastvideo1views: '0',
  pastvideo2views: '0',
  pastvideo3views: '0',
  pastvideo4views: '0',


}

      function setDefaults(){
        user.pastvideo1='http://placehold.it/500x300';
        user.pastvideo2='http://placehold.it/500x300';
        user.pastvideo3='http://placehold.it/500x300';
        user.pastvideo4='http://placehold.it/500x300';

      }


var searchUser = function(name_) { // pull json data from users URL
  $.getJSON('https://api.twitch.tv/kraken/users/' + name_, function(data) {
    console.log(name_);
    user.name = data.display_name;
    user.bio = data.bio;
    if (data.logo) {
      user.logo = data.logo;




    } else {
      user.logo =
        'http://s28.postimg.org/u1io3s5ex/finalmuthauakin_GREG.png';
    }
  }).fail(function() { // when getJSON finishes, execute userpush() function.... if fails, execute userpush() function
    window.alert('User does not exist, please try again'); // Make Prettier :)
  }).done(function() {
       setDefaults();
    userPush();
    checkStream();

  });

  function checkStream() {
    $.getJSON('https://api.twitch.tv/kraken/streams/' + name_,
      function(data) {
        if (data.stream !== null) { // if stream is currently live...
          user.viewers = data.stream.viewers;
          user.streamlogo = data.stream.preview.large;
          user.streamdesc = data.stream.channel.status;
          user.islive = 'true';
        } else { // if stream is offline...
          //user.streamdesc = 'Offline'
          user.islive = 'false';
        }
      }).fail(function() {
      window.alert('FAIL'); // need to update this to something... prettier :)
    }).done(function() {
      streamPush();
      channelVideosPush();
      checkChannel();

    });
  }
    /*

    title: videos[0].title
    view: videos[0].views
    url: videos[0].url
    */
    // working on pushing previous channels....
    function channelVideosPush(){
        $.getJSON( "https://api.twitch.tv/kraken/channels/"+name_+"/videos",
            function(data){
                if (data._total!=0){
                if (data.videos[0]){
                    user.pastvideo1 = data.videos[0].preview;
                    user.pastvideo1title = data.videos[0].title;
                    user.pastvideo1views = data.videos[0].views;
                    user.pastvideo1url  =  data.videos[0].url;

                } if (data.videos[1]){
                     user.pastvideo2 = data.videos[1].preview;
                     user.pastvideo2title = data.videos[1].title;
                     user.pastvideo2views = data.videos[1].views;
                     user.pastvideo2url  =  data.videos[1].url;
                }if (data.videos[2]){
                     user.pastvideo3 = data.videos[2].preview;
                     user.pastvideo3title = data.videos[2].title;
                     user.pastvideo3views = data.videos[2].views;
                     user.pastvideo3url  =  data.videos[2].url;
                }if (data.videos[3]){
                     user.pastvideo4 = data.videos[3].preview;
                     user.pastvideo4title = data.videos[3].title;
                     user.pastvideo4views = data.videos[3].views;
                     user.pastvideo4url  =  data.videos[3].url;
                }
                }



}).done(function(){
            pastVideoPush();

    });


    }



  function checkChannel() {
    $.getJSON('https://api.twitch.tv/kraken/channels/' + name_,
      function(data) {
        user.profileurl = data.url;
        if (user.islive === 'false') {
          if (data.video_banner !== null) {
            user.streamlogo = data.video_banner;
          } else {
            user.streamlogo =
              'http://s11.postimg.org/g9iszbetf/notlive.png';
          }
        }
      }).fail(function() {
      window.alert('FAIL');
    }).done(function() {
      channelPush();

    });
  }
};
// button handler for on click event
$('#searchbtn').on('click', function() {
  searchUser($('#usernamesearch').val());
});
// userPush executed when json request |searchUser()|  succeeds
function userPush() {
  $('.name').html(user.name);
  if (user.bio === '') {
    user.bio = ('\n' + user.name + 'has not filled out his bio.');
  }
  $('#bio').html(user.bio);
  $('#logo').attr('src', user.logo);
}
// streamPush executed when json request |checkStream()|  succeeds

function streamPush() {
  // $('#streamstatus').html(user.streamdesc);
  $('#viewers').html(user.viewers);

  if (user.islive === 'true') {

    $('#useronline').removeClass('label-danger');
    $('#useronline').addClass('label-success');
    $('#useronline').html('ONLINE');

  } else {
    $('#useronline').addClass('label-danger');
    $('#useronline').removeClass('label-success');
    $('#useronline').html('OFFLINE');
  }

}


// channelPush executed when json request |checkChannel()|  succeeds

function channelPush() {
  $('.user_url').attr('href', user.profileurl);
  $('#stream_img').attr('src', user.streamlogo);
}

function pastVideoPush(){


        $('#vid1').attr('src',user.pastvideo1);
        $('#vid1url').attr('href',user.pastvideo1url);

        $('#vid2').attr('src',user.pastvideo2);
        $('#vid2url').attr('href',user.pastvideo2url);

        $('#vid3').attr('src',user.pastvideo3);
        $('#vid3url').attr('href',user.pastvideo3url);

        $('#vid4').attr('src',user.pastvideo4);
        $('#vid4url').attr('href',user.pastvideo4url);



}


$('#usernamesearch').keypress(function(event) {
  if (event.which == 13) {
    searchUser($('#usernamesearch').val());
  }
});
