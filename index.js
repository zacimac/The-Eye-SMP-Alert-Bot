// # Twitter Eye Bot
// Announces on Twitter when The Eye SMP members are live on Twitch.

const { config } = require('./config');
const { TwitterClient } = require('twitter-api-client');
const TwitchApi = require("node-twitch").default;

// Authenticate
const twitter = new TwitterClient({
  apiKey: config.twitter.api_key,
  apiSecret: config.twitter.api_secret,
  accessToken: config.twitter.access_token,
  accessTokenSecret: config.twitter.access_token_secret,
});

const twitch = new TwitchApi({
	client_id: config.twitch.client_id,
	client_secret: config.twitch.client_secret,
});

// Holds member data along with a status if they are live or not.
const members = config.members.map(member => { return { ...member, live: false } });

// Check if members just went live on Twitch!
setInterval(async function checkMembers() {
  try {
    const streams = await twitch.getStreams({ channels: members.map(member => member.twitch) });
    // Filter out streams that are actually live from possible rerun streams.
    const liveMembers = streams.data.filter(stream => stream.type === 'live');
    // Set live status for each member and announce if they went live if false beforehand.
    members.forEach(member => {
      const liveMember = liveMembers.find(liveMember => liveMember.user_name === member.twitch);
      member.live = !!liveMember;
      if (member.live && !member.announced) {
        // twitter.post('statuses/update', { status: `@${member.twitter} is live on Twitch!${liveMember.title ? `\n${liveMember.title}`: ''}\nhttps://twitch.tv/${member.twitch}` });
        twitter.tweets.statusesUpdate({
          status: `@${member.twitter} is live on Twitch!${liveMember.title ? `\n${liveMember.title}`: ''}\nhttps://twitch.tv/${member.twitch}`,
        })
        .then(tweet => {
          console.log(`Tweeted: ${tweet.data.text}`);
        })
        .catch(error => {
          console.error(error);
        });
        member.announced = true;
      } else if (!member.live && member.announced) {
        member.announced = false;
      }
    });
  } catch (error) {
    console.error(error);
  }
}, config.interval * 60 * 1000);