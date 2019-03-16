// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import UserAvatar from 'components/UserAvatar';
import UserCredStats from 'components/UserCredStats';
import PostFormModal from 'components/PostFormModal';
import PostCard from 'components/PostCard';

import saga, {
  reducer,
  requestPosts,
  requestCreatePost,
} from 'containers/Feed/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    width: 1106,
    margin: '0 auto',
    paddingTop: 25,
    display: 'flex',
  },
  leftPanel: {
    width: 254,
    marginRight: 19,
  },
  content: {
    flex: 1,
  },
  createPostPanel: {
    backgroundColor: theme.palette.common.white,
    padding: '15px 20px 18px 21px',
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
    cursor: 'pointer',
    marginBottom: 30,
  },
  createPostAvatar: {
    width: 45,
    height: 45,
    marginRight: 20,
  },
  createPostTitle: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.3,
    color: '#9f9f9f',
  },
  rightPanel: {
    width: 254,
    marginLeft: 20,
  },
});

type Props = {
  user: Object,
  posts: List<Map>,
  isCreating: boolean,
  createError: string,
  classes: Object,
  requestCreatePost: Function,
  requestPosts: Function,
};

type State = {
  isOpen: boolean,
};

class FeedPage extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  componentDidMount() {
    this.props.requestPosts();
  }
  componentDidUpdate(prevProps: Props) {
    const { isCreating, createError } = this.props;
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestPosts();
    }
  }
  openModal = () => {
    this.setState({ isOpen: true });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  savePost = data => {
    this.closeModal();
    this.props.requestCreatePost(data);
  };
  render() {
    const { user, posts, classes } = this.props;
    const { isOpen } = this.state;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <div className={classes.leftPanel} />
          <div className={classes.content}>
            <Grid
              container
              alignItems="center"
              className={classes.createPostPanel}
              onClick={this.openModal}
            >
              <Grid item>
                <UserAvatar
                  src={user.getIn(['profile', 'avatar'])}
                  className={classes.createPostAvatar}
                />
              </Grid>
              <Grid item>
                <Typography className={classes.createPostTitle}>
                  Create a post...
                </Typography>
              </Grid>
            </Grid>
            {posts &&
              posts.map(post => <PostCard post={post} key={post.get('id')} />)}
          </div>
          <div className={classes.rightPanel}>
            <UserCredStats user={user} onClick={this.openModal} />
          </div>
        </div>
        <PostFormModal
          isOpen={isOpen}
          user={user}
          onCloseModal={this.closeModal}
          onSave={this.savePost}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  posts: state.getIn(['feed', 'posts']),
  isCreating: state.getIn(['feed', 'isCreating']),
  createError: state.getIn(['feed', 'createError']),
});

const mapDispatchToProps = dispatch => ({
  requestCreatePost: payload => dispatch(requestCreatePost(payload)),
  requestPosts: () => dispatch(requestPosts()),
});

export default compose(
  injectSagas({ key: 'feed', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(FeedPage);
