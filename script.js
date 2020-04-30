const postsPerRequest = 4;
const maxPostsToFetch = 20;
const maxRequests = maxPostsToFetch / postsPerRequest;

const responses = [];

const handleSubmit = e => {
  e.preventDefault();
  const subreddit = document.getElementById('subreddit').value;
  fetchPosts(subreddit);
};

const fetchPosts = async (subreddit, afterParam) => {
  const response = await fetch(
    `https://www.reddit.com/r/${subreddit}/hot/.json?limit=${postsPerRequest}${
      afterParam ? '&after=' + afterParam : ''
    }`
  );
  const responseJSON = await response.json();
  responses.push(responseJSON);

  if (responseJSON.data.after && responses.lenght < maxRequests) {
    fetchPosts(subreddit, responseJSON.data.after);
    return;
  }
  parseResults(responses);
};

const parseResults = responses => {
  const allPosts = [];

  responses.forEach(response => {
    allPosts.push(...response.data.children);
  });

  statsByUser = {};

  allPosts.forEach(({ data: { author, score, selftext , title, permalink } }) => {
    statsByUser[author] = !statsByUser[author]
      ? { postCount: 1, score , selftext , title ,permalink}
      : {
          postCount: statsByUser[author].postCount + 1,
          score: statsByUser[author].score + score,
          selftext: statsByUser[author].selftext,
          title: statsByUser[author].title,
          permalink: statsByUser[author].permalink
        };
  });

  const userList = Object.keys(statsByUser).map(username => ({
    username,
    score: statsByUser[username].score,
    postCount: statsByUser[username].postCount,
    title: statsByUser[username].title,
    selftext: statsByUser[username].selftext,
    permalink: statsByUser[username].permalink
  }));

  const sortedList = userList.sort((userA, userB) => userB.score - userA.score);

  displayRankings(sortedList);
};

const displayRankings = sortedList => {
  const container = document.getElementById('results-container');
  sortedList.forEach(({ username, score, postCount, title, selftext, permalink }, i) => {
    rank = i + 1;
    const userCard = document.createElement('a');
    userCard.href = `https://www.reddit.com${permalink}`;
    userCard.classList.add('user-card');
    userCard.innerText = `${rank}. ${username} - ${postCount} post(s) - ${score} point(s), ${title} `;

    container.appendChild(userCard);
  });
};

const subredditSelectForm = document.getElementById('subreddit-select-form');
subredditSelectForm.addEventListener('submit', handleSubmit);
