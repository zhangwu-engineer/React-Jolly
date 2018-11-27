// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import Masonry from 'react-masonry-component';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Link from 'components/Link';

import saga, {
  reducer,
  requestMemberProfile,
  requestMemberFiles,
} from 'containers/Member/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {},
  header: {
    flexGrow: 1,
    padding: '10px 15px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  backButton: {
    color: theme.palette.common.white,
    textTransform: 'none',
    paddingLeft: 0,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  fileInput: {
    display: 'none',
  },
  contentWrapper: {
    padding: 10,
  },
  fileWrapper: {
    width: 174,
    padding: 3,
  },
  selected: {
    border: '2px solid #000000',
  },
});

type Props = {
  member: Object,
  files: Object,
  classes: Object,
  match: Object,
  requestMemberProfile: Function,
  requestMemberFiles: Function,
};

class MemberGallery extends Component<Props> {
  componentDidMount() {
    const {
      match: {
        params: { slug },
      },
    } = this.props;
    this.props.requestMemberProfile(slug);
    this.props.requestMemberFiles(slug);
  }
  render() {
    const { classes, member, files } = this.props;
    return (
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
              component={props => (
                <Link to={`/f/${member.get('slug')}`} {...props} />
              )}
            >
              <ArrowBackIcon />
              &nbsp;Profile Images &amp; Videos
            </Button>
          </Grid>
        </Grid>
        <div className={classes.contentWrapper}>
          <Masonry
            className="my-gallery-class" // default ''
            // elementType={'ul'} // default 'div'
            // options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            imagesLoadedOptions={{ background: '.my-bg-image-el' }} // default {}
          >
            {files.map(file => (
              <div className={classes.fileWrapper} key={generate()}>
                <img src={file.get('path')} alt={file.get('_id')} />
              </div>
            ))}
          </Masonry>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  member: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isMemberLoading']),
  error: state.getIn(['member', 'memberError']),
  files: state.getIn(['member', 'files']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  requestMemberFiles: slug => dispatch(requestMemberFiles(slug)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(MemberGallery);
