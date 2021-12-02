// # Twitter Eye Bot
// Announces on Twitter when The Eye SMP members are live on Twitch.

const { config } = require('./config');
const { TwitterApi } = require('twitter-api-v2');
const TwitchApi = require("node-twitch").default;

// Authenticate
const twitter = new TwitterApi({
  appKey: config.twitter.app_key,
  appSecret: config.twitter.app_secret,
  accessToken: config.twitter.access_token,
  accessSecret: config.twitter.access_secret,
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
    members.forEach(async member => {
      const liveMember = liveMembers.find(liveMember => liveMember.user_name === member.twitch);
      member.live = !!liveMember;
      if (member.live && !member.announced) {
        await twitter.v2.tweet(`@${member.twitter} is live on Twitch!${liveMember.title ? `\n${liveMember.title}`: ''}\nhttps://twitch.tv/${member.twitch}`);
        console.log("Announced: " + member.twitter);
        member.announced = true;
      } else if (!member.live && member.announced) {
        member.announced = false;
      }
    });
  } catch (error) {
    console.error(error);
  }
}, config.interval * 60 * 1000);