/* global $ */
/*
/---David Kaiser[JACKEL]---------------------------------------------\
/-------------------Idea by FreeCodeCamp.com Twitch Challenge---------\
/-----------------------------------------------------------2016-------\
/--ver.1.6--------------------------------------------------------------\
*/





$(document).ready(function() {
    searchUser('freecodecamp'); // on page load, pass user freecodecamp
});

var name_ = "";
var user = {
    name: '', // can put in default values if they do not exist...
    bio: '',
    logo: '',
    streamdesc: 'Not Live',
    streamlogo: '',
    videourl:'',
    chaturl:'',
    profileurl: '',
    viewers: '0',
    islive: 'false',
    offlinebanner: '',
    pastvideos: {
        '0': {
            vid: '',
            url: '',
            title: '',
            views: ''
        },
        '1': {
            vid: '',
            url: '',
            title: '',
            views: ''
        },
        '2': {
            vid: '',
            url: '',
            title: '',
            views: ''
        },
        '3': {
            vid: '',
            url: '',
            title: '',
            views: ''
        }
    }
}
/*
"http://www.twitch.tv//chat"
*/

    // pull json data from users URL
searchUser = function(searchName) {
  name_=searchName;

    $.getJSON('https://api.twitch.tv/kraken/users/' + name_, function(data) {
        console.log(name_);
          user.streamdesc='';
        user.name = data.display_name;

        user.bio = data.bio;
        user.chaturl= "http://gregchat.xyz/"+name_; // chat url fetch
      $('.video_iframe').attr('src', 'http://player.twitch.tv/?channel='+user.name.toLowerCase());
        if (data.logo) {
            user.logo = data.logo;

        } else {
            //default user logo
            user.logo =
                'http://s28.postimg.org/u1io3s5ex/finalmuthauakin_GREG.png';
        }
    }).fail(function() { // when getJSON finishes, execute userpush() function.... if fails, execute userpush() function
        window.alert('User does not exist, please try again'); // Change this to a bootstrap popup??
    }).done(function() {
      user.pastvideos[0].url = 'http://placehold.it/500x300';
      user.pastvideos[1].url = 'http://placehold.it/500x300';
      user.pastvideos[2].url = 'http://placehold.it/500x300';
      user.pastvideos[3].url = 'http://placehold.it/500x300';
        user.streamdesc='';

        userPush(); // jQuery to pass data
        checkStream(); // execute to pull stream data if any...
    });
  }

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
                        user.viewers =0;
                    }
                }).fail(function() {
                window.alert('FAIL'); // need to update this to something... prettier :)
            }).done(function() {
                streamPush();
                channelVideosPush();
                checkChannel();
            });
        }
        // working on pushing previous channels....

    function channelVideosPush() {
        $.getJSON("https://api.twitch.tv/kraken/channels/" + name_ +
            "/videos", function(data) {
                for (var x = 0; x < 4; x++) {
                    if (data.videos[x]) {
                        user.pastvideos[x].vid = data.videos[x].preview;
                        user.pastvideos[x].title = data.videos[x].title;
                        user.pastvideos[x].views = data.videos[x].views;
                        user.pastvideos[x].url = data.videos[x].url;

                    }else{
                      user.pastvideos[x].vid = "";
                    }
                }
            }).done(function() {
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

// button handler for on click event
$('#searchbtn').on('click', function() {
    searchUser($('#usernamesearch').val());
});
// userPush executed when json request |searchUser()|  succeeds


function userPush() {
        $('.name').html(user.name);

        if (user.bio === '') {
            user.bio = ('\n'+ user.name + ' Is incredibly lazy and has not filled out his bio.');
        }
        $('#bio').html(user.bio);
        $('#logo').attr('src', user.logo);
        $('.chat').attr('src', user.chaturl);
            $('.videoinfo').html(user.streamdesc);

    }
    // streamPush executed when json request |checkStream()|  succeeds

function streamPush() {
        // $('#streamstatus').html(user.streamdesc);
        $('#viewers').html(user.viewers);
        if (user.islive === 'true') {
            $('#useronline').removeClass('label-danger');
            $('#useronline').addClass('label-success');
            $('#useronline').html('ONLINE');
              $('#useronline').css('opacity','.70');
              $('.videoinfo').html(user.streamdesc);

        } else {

            $('#useronline').addClass('label-danger');
            $('#useronline').removeClass('label-success');
            $('#useronline').html('OFFLINE');
            $('#useronline').css('opacity','1.0');
                $('.videoinfo').html(user.streamdesc);
        }
    }
    // channelPush executed when json request |checkChannel()|  succeeds




function channelPush() {
    $('.user_url').attr('href', user.profileurl);
    $('#stream_img').attr('src', user.streamlogo);
}

function pastVideoPush() {
    $('#vid1').attr('src', user.pastvideos[0].vid);
    $('#vid1url').attr('href', user.pastvideos[0].url);

    $('#vid2').attr('src', user.pastvideos[1].vid);
    $('#vid2url').attr('href', user.pastvideos[1].url);

    $('#vid3').attr('src', user.pastvideos[2].vid);
    $('#vid3url').attr('href', user.pastvideos[2].url);

    $('#vid4').attr('src', user.pastvideos[3].vid);
    $('#vid4url').attr('href', user.pastvideos[3].url);
}
$('#usernamesearch').keypress(function(event) {
    if (event.which == 13) {
        searchUser($('#usernamesearch').val());
    }
});
