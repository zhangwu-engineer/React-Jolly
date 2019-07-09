// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';

import PostFormModal from 'components/PostFormModal';
import PostCard from 'components/PostCard';
import Link from 'components/Link';

import saga, {
  reducer,
  requestPosts,
  requestUpdatePost,
  requestRemovePost,
  requestVotePost,
  requestCreateComment,
  toggleCommentSection,
  showNextComment,
} from 'containers/Feed/sagas';
import { requestUser } from 'containers/App/sagas';
import injectSagas from 'utils/injectSagas';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: 0,
      width: '100%',
      display: 'block',
    },
  },
  header: {
    flexGrow: 1,
    padding: '3px 15px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    marginBottom: '10px',
    position: 'relative',
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    paddingLeft: 0,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  logoText: {
    color: theme.palette.common.white,
    fontSize: 20,
    fontWeight: 600,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  content: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 103px)',
      overflowY: 'scroll',
    },
  },
});

type Props = {
  user: Object,
  posts: List<Map>,
  isCreating: boolean,
  createError: string,
  isUpdating: boolean,
  updateError: string,
  isVoting: boolean,
  voteError: string,
  isRemoving: boolean,
  removeError: string,
  classes: Object,
  requestUpdatePost: Function,
  requestPosts: Function,
  requestVotePost: Function,
  requestRemovePost: Function,
  requestUser: Function,
  requestCreateComment: Function,
  toggleCommentSection: Function,
  showNextComment: Function,
};

type State = {
  isOpen: boolean,
  editingPost: Object,
};

class FeedDetailMobile extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user && prevState.query === undefined) {
      return {
        query: {
          location: nextProps.user.getIn(['profile', 'location']),
          categories: CATEGORY_OPTIONS.map(option => option.value),
          id: location.pathname.split('/').slice(-1)[0],
        },
      };
    }
    return null;
  }
  state = {
    isOpen: false,
    query: undefined,
    editingPost: null,
  };
  componentDidMount() {
    const { query } = this.state;
    this.props.requestPosts(query);
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isCreating,
      createError,
      isUpdating,
      updateError,
      isVoting,
      voteError,
      isRemoving,
      removeError,
    } = this.props;
    const { query } = this.state;
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestPosts(query);
    }
    if (prevProps.isUpdating && !isUpdating && !updateError) {
      this.props.requestPosts(query);
    }
    if (prevProps.isVoting && !isVoting && !voteError) {
      this.props.requestPosts(query);
      this.props.requestUser();
    }
    if (prevProps.isRemoving && !isRemoving && !removeError) {
      this.props.requestPosts(query);
    }
  }
  openModal = () => {
    this.setState({ editingPost: null, isOpen: true });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  updatePost = (id, data) => {
    this.closeModal();
    this.props.requestUpdatePost(id, data);
  };
  handleFilterChange = query => {
    this.setState({ query }, () => {
      this.props.requestPosts(query);
    });
  };
  editPost = post => {
    this.setState({
      editingPost: post,
      isOpen: true,
    });
  };
  render() {
    const { user, posts, classes } = this.props;
    const { isOpen, editingPost } = this.state;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Grid
            className={classes.header}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Button
                className={classes.backButton}
                component={props => <Link to="/feed" {...props} />}
              >
                <ArrowBackIcon />
              </Button>
            </Grid>
            <Grid item className={classes.logoContainer}>
              <Link to="/">
                <Typography className={classes.logoText}>J</Typography>
              </Link>
            </Grid>
          </Grid>
          <div className={classes.content}>
            {posts &&
              posts.map(post => (
                <PostCard
                  post={post}
                  key={generate()}
                  currentUser={user}
                  votePost={this.props.requestVotePost}
                  removePost={this.props.requestRemovePost}
                  createComment={this.props.requestCreateComment}
                  editPost={this.editPost}
                  toggleComment={this.props.toggleCommentSection}
                  showNextComment={this.props.showNextComment}
                />
              ))}
          </div>
        </div>
        <PostFormModal
          isOpen={isOpen}
          user={user}
          post={editingPost}
          onCloseModal={this.closeModal}
          onUpdate={this.updatePost}
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
  isUpdating: state.getIn(['feed', 'isUpdating']),
  updateError: state.getIn(['feed', 'updateError']),
  isVoting: state.getIn(['feed', 'isVoting']),
  voteError: state.getIn(['feed', 'voteError']),
  isRemoving: state.getIn(['feed', 'isRemoving']),
  removeError: state.getIn(['feed', 'removeError']),
});

const mapDispatchToProps = dispatch => ({
  requestUpdatePost: (id, payload) => dispatch(requestUpdatePost(id, payload)),
  requestPosts: payload => dispatch(requestPosts(payload)),
  requestRemovePost: postId => dispatch(requestRemovePost(postId)),
  requestVotePost: postId => dispatch(requestVotePost(postId)),
  requestUser: () => dispatch(requestUser()),
  requestCreateComment: payload => dispatch(requestCreateComment(payload)),
  toggleCommentSection: postId => dispatch(toggleCommentSection(postId)),
  showNextComment: postId => dispatch(showNextComment(postId)),
});

export default compose(
  injectSagas({ key: 'feed', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(FeedDetailMobile);
