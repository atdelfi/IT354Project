const postsPerRequest = 4;
const maxPostsToFetch = 20;
const maxRequests = maxPostsToFetch / postsPerRequest;

document.getElementById('subreddit').defaultValue = "news";


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

  allPosts.forEach(({ data: { author, score, selftext_html , title, permalink, url} }) => {
    statsByUser[author] = !statsByUser[author]
      ? { postCount: 1, score , selftext_html , title ,permalink, url}
      : {
          postCount: statsByUser[author].postCount + 1,
          score: statsByUser[author].score + score,
          selftext_html: statsByUser[author].selftext_html,
          title: statsByUser[author].title,
          permalink: statsByUser[author].permalink,
          url: statsByUser[author].url
        };
  });

  const userList = Object.keys(statsByUser).map(username => ({
    username,
    score: statsByUser[username].score,
    postCount: statsByUser[username].postCount,
    title: statsByUser[username].title,
    selftext_html: statsByUser[username].selftext_html,
    permalink: statsByUser[username].permalink,
    url: statsByUser[username].url
  }));

  const sortedList = userList.sort((userA, userB) => userB.score - userA.score);

  displayRankings(sortedList);
};

const displayRankings = sortedList => {
  const container = document.getElementById('results-container');
  sortedList.forEach(({ username, score,  title, selftext_html, permalink, url }, i) => {
    rank = i + 1;
    const userCard = document.createElement('a');
    let text = htmlDecode(selftext_html);
    text = removeNull(text);
    const back = document.createElement('article')
    userCard.href = `https://www.reddit.com${permalink}`;
    userCard.classList.add('user-card');
    back.classList.add(`edit`);
    userCard.innerText = `${rank}. ${username}  - ${score} point(s), ${title} `;
    back.innerHTML = `${url} <br /> ${text}`;

    container.appendChild(userCard);
    container.appendChild(back);
  });
};
const resetArea = () => {
  const container = document.getElementById('results-container').innerHTML = "";
  
 responses.length = 0;
  
  

}
function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
function removeNull(input) {
  if(input == "null"){
    input = ""
  }
  return input;
}


const subredditSelectForm = document.getElementById('subreddit-select-form');
subredditSelectForm.addEventListener('submit', handleSubmit);
subredditSelectForm.addEventListener('reset', resetArea);

