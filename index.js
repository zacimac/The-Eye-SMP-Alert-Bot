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

console.log(`Bot started! - Listening to ${config.members.length} Twitch users.`);

// Holds member data along with a status if they are live or not.
const members = config.members.map(member => { return { ...member, live: false } });

// Perform a first time check.
// ? This is so it won't tweet multiple times about a member live for the one stream.
// ? Why? Incase the bot crashes or there is debugging happening. I'd rather it not tweet multiple times about the same stream.
checkMembers();

// Check if members just went live on Twitch!
setInterval(checkMembers(true), config.interval * 60 * 1000);

async function checkMembers(tweet) {
  try {
    console.log('Checking members...');
    const streams = await twitch.getStreams({ channels: members.map(member => member.twitch) });
    // Filter out streams that are actually live from possible rerun streams.
    const liveMembers = streams.data.filter(stream => stream.type === 'live');
    // Set live status for each member and announce if they went live if false beforehand.
    members.forEach(async member => {
      const liveMember = liveMembers.find(liveMember => liveMember.user_name.toLowerCase() === member.twitch.toLowerCase());
      member.live = !!liveMember;
      if (member.live && !member.announced) {
        if (tweet) await twitter.v2.tweet(`.@${member.twitter} is live on Twitch!${liveMember.title ? `\n${liveMember.title}`: ''}\nhttps://twitch.tv/${member.twitch}`);
        console.log("Announced: " + member.twitter);
        member.announced = true;
      } else if (!member.live && member.announced) {
        member.announced = false;
      }
    });
  } catch (error) {
    console.error(error);
  }
}