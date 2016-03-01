/* global $ */

var Twitch = Object.create({
  user: null
});

Twitch.init = function() {
  this.watch();
};

Twitch.watch = function() {
  $('#usernamesearch').keypress(function(e) {
    if(e.which === 13) {
      Twitch.getUser($(this).val());
    }
  });

  $('#searchbtn').on('click', function() {
    Twitch.getUser($(this).parent().prev().val());
  });
};

Twitch.getUser = function(user) {
  $.getJSON('https://api.twitch.tv/kraken/users/' + user, function(data) {
    Twitch.user = {
      displayName: data.display_name,
      username: data.name,
      logo: data.logo,
      bio: data.bio
    };

    Twitch.getStream();
  }).error(function(err) {
    alert('Couldn\'t find user, please try again.');
  });
};

Twitch.getStream = function() {
  $.getJSON('https://api.twitch.tv/kraken/streams/' + Twitch.user.username, function(data) {
    Twitch.stream = data.stream;
    Twitch.render();
  });
};

Twitch.render = function() {
  var $user = $('.userblock');

  $user.find('#logo').attr('src', this.user.logo);
  $user.find('.user_url').attr('href', 'https://twitch.tv/' + this.user.username);
  $user.find('.name').text(this.user.displayName);

  var bio = (this.user.bio === null) ? 'User does not have a bio.' : this.user.bio;
  $user.find('#bio').text(bio);
  if(this.stream === null) return;

  $('.video_iframe').attr('src', 'http://player.twitch.tv/?channel=' + this.user.username);
  $('#chat_embed').attr('src', 'http://gregchat.xyz/' + this.user.username);
  $('#streamstatus').text(this.stream.channel.status);
  $('#gameplaying').text('playing ' + this.stream.game);
  $('#viewer_cont').show()
    .find('#viewers').text(this.stream.viewers);
};

Twitch.init();
