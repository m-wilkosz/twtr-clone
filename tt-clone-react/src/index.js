import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {FeedComponent, TweetsComponent, TweetDetailComponent} from './tweets';
import reportWebVitals from './reportWebVitals';

const appEl = document.getElementById('root')
if (appEl) {
  const root = ReactDOM.createRoot(appEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
const e = React.createElement
const tweetsEl = document.getElementById('tweets-react')
if (tweetsEl) {
  const root = ReactDOM.createRoot(tweetsEl);
  root.render(e(TweetsComponent, tweetsEl.dataset));
}

const tweetsFeedEl = document.getElementById('tweets-react-feed')
if (tweetsFeedEl) {
  const root = ReactDOM.createRoot(tweetsFeedEl);
  root.render(e(FeedComponent, tweetsFeedEl.dataset));
}

const tweetDetailElements = document.querySelectorAll('.tweet-detail')
tweetDetailElements.forEach(container => {
  const root = ReactDOM.createRoot(container);
  root.render(e(TweetDetailComponent, container.dataset));
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
