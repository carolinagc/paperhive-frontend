import avatar from './avatar';
import feedbackButton from './feedback-button';
import navbarSearch from './navbar-search';
import navbarUser from './navbar-user';
import starButton from './star-button';
import starredDocs from './starred-docs';

export default function(app) {
  avatar(app);
  feedbackButton(app);
  navbarSearch(app);
  navbarUser(app);
  starButton(app);
  starredDocs(app);
};
