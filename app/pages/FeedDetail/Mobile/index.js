// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { withStyles } from '@material-ui/core/styles';

import PostFormModal from 'components/PostFormModal';
import PostCard from 'components/PostCard';

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
      margin: '10px auto',
    },
  },
  leftPanel: {
    width: 223,
    marginRight: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  profileInfo: {
    marginBottom: 30,
    paddingLeft: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  greetings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#373737',
    textTransform: 'capitalize',
  },
  link: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.7px',
    textTransform: 'none',
    textDecoration: 'none',
  },
  content: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 103px)',
      overflowY: 'scroll',
    },
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
    width: 223,
    marginLeft: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  mobileMenu: {
    backgroundColor: '#083f76',
    height: 55,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  mobileButtonWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  mobileButton: {
    fontWeight: 600,
    color: theme.palette.common.white,
    textTransform: 'none',
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
