exports.config = {
  // # Members Twitch and Twitter accounts to use to watch and reference.
  members: [
    {
      twitch: 'elybeatmaker', 
      twitter: 'elybeatmaker',
    },
    {
      twitch: 'zacimac', 
      twitter: 'zacimac',
    }
  ],

  // # Check interval, in minutes.
  interval: 1,

  // # Twitter App Authentication.
  // ? https://developer.twitter.com/
  // ? NOTE: Elevated API access is required to send tweets. Elevated access requires an application sent to Twitter.
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
}