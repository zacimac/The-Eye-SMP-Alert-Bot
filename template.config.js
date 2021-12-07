exports.config = {
  // # Members Twitch and Twitter accounts to use to watch and reference.
  members: [
    {
      twitch: 'elybeatmaker', 
      twitter: 'elybeatmaker',
      discord: '0123456789',
    },
    {
      twitch: 'zacimac', 
      twitter: 'zacimac',
      discord: '0123456789',
    }
  ],

  // # Check interval, in minutes.
  interval: 1,

  // # Twitter App Authentication.
  // ? https://developer.twitter.com/
  twitter: {
    app_key: "",
    app_secret: "",
    access_token: "",
    access_secret: "",
  },

  // # Twitch App Authentication.
  // ? https://dev.twitch.tv/console/apps
  twitch: {
    client_id: "",
    client_secret: ""
  },

  // # Discord Bot Token.
  // ? https://discordapp.com/developers/applications/
  discord: {
    token: "",
    channelID: "",
  }
}