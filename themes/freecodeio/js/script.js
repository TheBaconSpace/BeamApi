$(document).ready(function () {
    searchUser('jhovgaard');
});
var user = {
    name: '',
    bio: '',
    logo: '',
    streamdesc: 'Not Live',
    streamlogo: '',
    profileurl: '',
    viewers: '0',
    islive: 'Not Live'
};
var searchUser = function (name_) {
    $.getJSON('https://api.twitch.tv/kraken/users/' + name_, function (data) {
        user.name = data.display_name;
        user.bio = data.bio;
        user.logo = data.logo;
    }).fail(function () {
        window.alert('User does not exist, please try again');
    }).done(function () {
        userPush();
        checkStream();
    });
    function checkStream() {
        $.getJSON('https://api.twitch.tv/kraken/streams/' + name_, function (data) {
            if (data.stream !== null) {
                user.viewers = data.stream.viewers;
                user.streamlogo = data.stream.preview.large;
                user.streamdesc = data.stream.channel.status;
            } else {
                user.islive = 'NOT LIVE';
                user.streamlogo = 'http://s8.postimg.org/427hsaynp/notlive.png';
                user.streamdesc = 'Offline';
            }
        }).fail(function () {
            window.alert('FAIL');
        }).done(function () {
            streamPush();
            checkChannel();
        });
    }
    function checkChannel() {
        $.getJSON('https://api.twitch.tv/kraken/channels/' + name_, function (data) {
            user.profileurl = data.url;
        }).fail(function () {
            window.alert('FAIL');
        }).done(function () {
            channelPush();
        });
    }
};
$('#searchbtn').on('click', function () {
    searchUser($('#usernamesearch').val());
});
function userPush() {
    $('.name').html(user.name);
    if (user.bio === '') {
        user.bio = user.name + ' has not filled out his bio.';
    }
    $('#bio').html(user.bio);
    $('#logo').attr('src', user.logo);
}
function streamPush() {
    $('#streamstatus').html(user.streamdesc);
    $('#stream_img').attr('src', user.streamlogo);
    $('#viewers').html(user.viewers);
}
function channelPush() {
    $('.user_url').attr('href', user.profileurl);
}
$('#usernamesearch').keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == '13') {
        searchUser($('#usernamesearch').val());
    }

});