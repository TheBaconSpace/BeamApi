




$(document).ready(function() {
    searchUser("freecodecamp"); // on page load, pass user freecodecamp

});
var user = {
    name: "", // can put in default values if they do not exist...
    bio: "",
    logo: "",
    streamdesc: "Not Live",
    streamlogo: "",
    profileurl: "",
    viewers: "0",
    islive: "false",
    offlinebanner: ""
}
var searchUser = function(name_) { // pull json data from users URL
    $.getJSON('https://api.twitch.tv/kraken/users/' + name_, function(data) {
        user.name = data.display_name;
        user.bio = data.bio;
        if (data.logo) {
            user.logo = data.logo;
        } else {
            user.logo =
                "http://s28.postimg.org/u1io3s5ex/finalmuthauakin_GREG.png";
        }
    }).fail(function() { // when getJSON finishes, execute userpush() function.... if fails, execute userpush() function
        window.alert("User does not exist, please try again"); // Make Prettier :)
    }).done(function() {
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
                    user.islive = "true";
                } else { // if stream is offline...
                    //user.streamdesc = "Offline"
                    user.islive = "false";
                }
            }).fail(function() {
            window.alert("FAIL"); // need to update this to something... prettier :)
        }).done(function() {
            streamPush();
            checkChannel();
        });
    }

    function checkChannel() {
        $.getJSON('https://api.twitch.tv/kraken/channels/' + name_,
            function(data) {
                user.profileurl = data.url;
                if (user.islive === "false") {
                    if (data.video_banner !== null) {
                        user.streamlogo = data.video_banner;
                    } else {
                        user.streamlogo =
                            "http://s11.postimg.org/g9iszbetf/notlive.png";
                    }
                }
            }).fail(function() {
            window.alert("FAIL");
        }).done(function() {
            channelPush();
        });
    }
};
// button handler for on click event
$("#searchbtn").on("click", function() {
    searchUser($('#usernamesearch').val());
});
// userPush executed when json request |searchUser()|  succeeds
function userPush() {
        $('.name').html(user.name);
        if (user.bio === "") {
            user.bio = ("\n" + user.name + "has not filled out his bio.");
        }
        $('#bio').html(user.bio);
        $('#logo').attr("src", user.logo);
    }
    // streamPush executed when json request |checkStream()|  succeeds

function streamPush() {
       // $('#streamstatus').html(user.streamdesc);
        $('#viewers').html(user.viewers);

        if (user.islive==="true"){

            $('#useronline').removeClass("label-danger");
            $('#useronline').addClass("label-success");
            $('#useronline').html("ONLINE");

        }else{
          $('#useronline').addClass("label-danger");
            $('#useronline').removeClass("label-success");
                       $('#useronline').html("OFFLINE");
        }

    }


    // channelPush executed when json request |checkChannel()|  succeeds

function channelPush() {
        $('.user_url').attr("href", user.profileurl);
        $('#stream_img').attr("src", user.streamlogo);
    }



 $( "#usernamesearch" ).keypress(function( event ) {
    if ( event.which == 13 ) {
      searchUser($('#usernamesearch').val());
    }
});
