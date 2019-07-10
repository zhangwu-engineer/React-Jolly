// @flow
import React, { Component } from 'react';
import cx from 'classnames';
import { formatDistanceStrict } from 'date-fns';
import Linkify from 'react-linkify';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MoreIcon from '@material-ui/icons/MoreHoriz';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import CommentCard from 'components/CommentCard';
import Link from 'components/Link';
import copyToClipBoard from 'utils/copyToClipBoard';

import CredIcon from 'images/sprite/cred.svg';
import CredFilledIcon from 'images/sprite/cred_filled.svg';
import CredBlueIcon from 'images/sprite/cred_blue.svg';
import CommentIcon from 'images/sprite/comment.svg';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '22px 23px 15px 24px',
    marginBottom: 10,
    position: 'relative',
  },
  userInfo: {
    padding: 0,
  },
  avatar: {
    width: 46,
    height: 46,
  },
  username: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0c74d4',
    textTransform: 'capitalize',
    marginRight: 7,
    textDecoration: 'none',
  },
  category: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  time: {
    fontSize: 14,
    fontWeight: 600,
    color: '#7f7f7f',
    textTransform: 'none',
    textDecoration: 'none',
  },
  content: {
    fontSize: 14,
    fontWeight: 600,
    color: '#464646',
    marginTop: 20,
    marginBottom: 30,
    whiteSpace: 'pre-line',
    '& a': {
      textTransform: 'none',
      fontSize: 14,
    },
  },
  bottom: {
    borderTop: '1px solid #f1f1f1',
    paddingTop: 15,
  },
  bottomExtended: {
    borderBottom: '1px solid #f1f1f1',
    paddingBottom: 15,
  },
  helpfulButton: {
    cursor: 'pointer',
    marginRight: 25,
  },
  commentButton: {
    cursor: 'pointer',
  },
  helpful: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#6f6f73',
    paddingLeft: 5,
    position: 'relative',
    top: 1,
  },
  votes: {
    fontSize: 14,
    color: '#404040',
    paddingLeft: 5,
    position: 'relative',
    top: 1,
  },
  blue: {
    color: theme.palette.primary.main,
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    right: 10,
    color: '#7f7f7f',
    zIndex: 100,
    minWidth: 'inherit',
  },
  menu: {
    width: 190,
    boxShadow: '0 10px 15px 5px rgba(0, 0, 0, 0.05)',
  },
  menuItem: {
    paddingTop: 3,
    paddingBottom: 3,
  },
  menuItemText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#0c74d4',
  },
  votesWrapper: {
    marginRight: 25,
    cursor: 'pointer',
  },
  commentsIconWrapper: {
    cursor: 'pointer',
  },
  newCommentSection: {
    paddingTop: 25,
    paddingBottom: 30,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    marginRight: 15,
  },
  textInputWrapper: {
    flex: 1,
  },
  textInput: {
    paddingLeft: 20,
    fontSize: 12,
    fontWeight: 500,
    color: '#9d9d9d',
    backgroundColor: '#fafafa',
    border: 'solid 1px #dbdbdb',
    '& input': {
      paddingTop: 10,
      paddingBottom: 10,
      '&::placeholder': {
        color: '#9d9d9d',
        opacity: 1,
      },
    },
  },
  showMore: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.primary.main,
    cursor: 'pointer',
  },
});

type Props = {
  post: Map,
  currentUser: Map,
  classes: Object,
  votePost: Function,
  removePost: Function,
  createComment: Function,
  editPost: Function,
  toggleComment: Function,
  showNextComment: Function,
};

type State = {
  open: boolean,
  comment: string,
  isCopied: boolean,
};

class PostCard extends Component<Props, State> {
  state = {
    open: false,
    comment: '',
    isCopied: false,
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };
  toggleComments = () => {
    const { post } = this.props;
    this.props.toggleComment(post.get('id'));
  };
  handleChange = e => {
    this.setState({ comment: e.target.value });
  };
  handleCommentSubmit = () => {
    const { post } = this.props;
    const { comment } = this.state;
    this.setState({ comment: '' });
    this.props.createComment({ content: comment, post: post.get('id') });
  };
  showNextComments = () => {
    const { post } = this.props;
    this.props.showNextComment(post.get('id'));
  };
  anchorEl: HTMLElement;
  render() {
    const { post, currentUser, classes } = this.props;
    const { open, comment, isCopied } = this.state;
    const user = post.get('user');
    const category = CATEGORY_OPTIONS.filter(
      option => option.value === post.get('category')
    );
    const voted = post.get('votes').includes(currentUser.get('id'));
    const timeDistance = formatDistanceStrict(
      new Date(),
      new Date(post.get('date_created'))
    );
    const timeAgo = timeDistance
      .replace(/ seconds| second/gi, 's')
      .replace(/ minutes| minute/gi, 'm')
      .replace(/ hours| hour/gi, 'h')
      .replace(/ days| day/gi, 'd');
    const showComments = post.get('showComments');
    const commentPage = post.get('commentPage');
    const commentsTotalCount = (commentPage - 1) * 4 + 2;
    const commentsLeft = post.get('fullComments').size - commentsTotalCount;
    return (
      <div className={classes.root}>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          onClick={this.handleToggle}
          className={classes.menuButton}
        >
          <MoreIcon />
        </Button>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          placement="bottom-end"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper square classes={{ root: classes.menu }}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList className={classes.menuList}>
                    {user.get('id') === currentUser.get('id') && (
                      <React.Fragment>
                        <MenuItem
                          className={classes.menuItem}
                          onClick={e => {
                            this.handleClose(e);
                            this.props.removePost(post.get('id'));
                          }}
                        >
                          <ListItemText
                            classes={{ primary: classes.menuItemText }}
                            primary="Delete Post"
                          />
                        </MenuItem>
                        <MenuItem
                          className={classes.menuItem}
                          onClick={e => {
                            this.handleClose(e);
                            this.props.editPost(post);
                          }}
                        >
                          <ListItemText
                            classes={{ primary: classes.menuItemText }}
                            primary="Edit Post"
                          />
                        </MenuItem>
                      </React.Fragment>
                    )}
                    <MenuItem
                      className={classes.menuItem}
                      onClick={() => {
                        copyToClipBoard(`/feed/${post.get('id')}`);
                        this.setState({ isCopied: true });
                      }}
                    >
                      {isCopied && (
                        <ListItemText
                          classes={{ primary: classes.menuItemText }}
                          primary="Copied!"
                        />
                      )}
                      {!isCopied && (
                        <ListItemText
                          classes={{ primary: classes.menuItemText }}
                          primary="Copy link to Post"
                        />
                      )}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
        <ListItem className={classes.userInfo}>
          <UserAvatar
            alt={`${user.get('firstName')} ${user.get('lastName')}`}
            src={user.getIn(['profile', 'avatar'])}
            className={classes.avatar}
          />
          <ListItemText
            primary={
              <Grid container alignItems="center">
                <Grid item>
                  <Link
                    to={`/f/${user.get('slug')}`}
                    className={classes.username}
                  >{`${user.get('firstName')} ${user
                    .get('lastName')
                    .charAt(0)}.`}</Link>
                </Grid>
                <Grid item>
                  <Typography className={classes.category}>
                    {category[0].label}
                  </Typography>
                </Grid>
              </Grid>
            }
            secondary={
              <Grid item>
                <Link to={`/feed/${post.get('id')}`} className={classes.time}>
                  {`${timeAgo} ago`}
                </Link>
              </Grid>
            }
          />
        </ListItem>
        <Typography className={classes.content}>
          <Linkify>{post.get('content')}</Linkify>
        </Typography>
        <Grid
          container
          justify="space-between"
          className={cx(classes.bottom, {
            [classes.bottomExtended]: showComments,
          })}
        >
          <Grid item>
            <Grid container>
              <Grid
                item
                className={classes.helpfulButton}
                onClick={() => {
                  if (
                    post.getIn(['user', 'id']) !== currentUser.get('id') &&
                    !voted
                  ) {
                    this.props.votePost(post.get('id'));
                  }
                }}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Icon glyph={voted ? CredBlueIcon : CredIcon} size={16} />
                  </Grid>
                  <Grid item>
                    <Typography
                      className={cx(classes.helpful, {
                        [classes.blue]: voted,
                      })}
                    >
                      Helpful
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                className={classes.commentButton}
                onClick={this.toggleComments}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Icon glyph={CommentIcon} width={16} height={15} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.helpful}>Comment</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container>
              <Grid
                item
                className={classes.votesWrapper}
                onClick={() => {
                  if (
                    post.getIn(['user', 'id']) !== currentUser.get('id') &&
                    !voted
                  ) {
                    this.props.votePost(post.get('id'));
                  }
                }}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Icon
                      glyph={voted ? CredBlueIcon : CredFilledIcon}
                      size={16}
                    />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.votes}>
                      {post.get('votes').size}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                className={classes.commentsIconWrapper}
                onClick={this.toggleComments}
              >
                <Grid container alignItems="center">
                  <Grid item>
                    <Icon glyph={CommentIcon} width={16} height={15} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.votes}>
                      {post.get('comments').size}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {showComments && (
          <React.Fragment>
            <Grid
              container
              className={classes.newCommentSection}
              alignItems="center"
            >
              <Grid item>
                <UserAvatar
                  src={currentUser.getIn(['profile', 'avatar'])}
                  className={classes.commentAvatar}
                />
              </Grid>
              <Grid item className={classes.textInputWrapper}>
                <Input
                  className={classes.textInput}
                  value={comment}
                  onChange={this.handleChange}
                  placeholder="Add a comment"
                  disableUnderline
                  fullWidth
                  onKeyDown={e => {
                    if (e.keyCode === 13 && comment) {
                      this.handleCommentSubmit();
                    }
                  }}
                />
              </Grid>
            </Grid>
            {post
              .get('fullComments')
              .map(
                (c, index) =>
                  index < commentsTotalCount ? (
                    <CommentCard comment={c} key={c.get('id')} />
                  ) : null
              )}
            {commentsTotalCount < post.get('fullComments').size && (
              <Typography
                className={classes.showMore}
                onClick={this.showNextComments}
              >
                {commentsLeft > 4
                  ? `See 4 more comments`
                  : `See ${commentsLeft} more comments`}
              </Typography>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(PostCard);
