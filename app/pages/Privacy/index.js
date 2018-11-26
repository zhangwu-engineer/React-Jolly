// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 100px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
    },
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
    [theme.breakpoints.down('xs')]: {
      backgroundColor: theme.palette.common.white,
      padding: '25px 15px 0px 15px',
      borderTop: '2px solid #eef2f2',
    },
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      padding: 15,
    },
  },
  bottomMargin: {
    marginBottom: 20,
  },
});

type Props = {
  classes: Object,
};

class PrivacyPolicy extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Privacy Policy
            </Typography>
          </div>
          <div className={classes.sectionBody}>
            <Typography className={classes.bottomMargin}>
              {`Protecting your private information  is our priority. This Statement of Privacy applies to joinjolly.com and all affiliated subdomains thereof, as well as srvbl.com and any other sites or services offered by Servable, Inc. and governs data collection and usage. For the purposes  of this Privacy Policy, unless otherwise noted, all references to Servable and/or Servable, Inc. include www.joinjolly.com, app.joinjolly.com, www.srvbl.com, app.srvbl.com, any other sites, domains or subdomains used by Servable, and Servable. The Jolly website is a marketing website along with a web application for networking. By using the Jolly website, you consent to the data practices described in this statement.`}
            </Typography>
            <Typography variant="h6">
              Collection of your Personal Information
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`In order to better provide you with products and services offered on our Site, Jolly may collect personally identifiable information, such as your: First and Last Name, Mailing Address, Age, E-mail Address, Phone  Number, Employer, Job Title, and other personal information. Jolly may also collect anonymous demographic information.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`Please keep in  mind that if you directly disclose personally identifiable information or personally sensitive data through Jolly's messaging or account customization tools, this information may be collected and used by others.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`We do not collect any personal information about you unless you voluntarily provide it to us. However, you may be required to provide certain personal information to us when you elect to use certain products or services available on the Site. These may include: (a) registering for an account on our Site; (b) entering a sweepstakes or contest sponsored by us or one of our partners; (c) signing up for special offers from selected third parties; (d) sending us an email message; (e) submitting your credit card or  other payment information when ordering and purchasing services through our Site. To wit, we will use your information for, but not limited to, communicating with you in relation to services and/or products you have requested from us. We also may gather additional personal or non-personal information in the future.`}
            </Typography>
            <Typography variant="h6">
              Use of your Personal Information
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly collects and uses your personal information to operate its website(s) and deliver the services you have requested. Jolly may also use your personally identifiable information to inform you of other products or services available from Jolly and its affiliates.`}
            </Typography>
            <Typography variant="h6">
              Sharing Information with Third Parties
            </Typography>
            <Typography>
              {`Jolly may share data with trusted partners and third party service providers. Jolly does not sell, rent or lease its customer lists to third  parties.`}
            </Typography>
            <Typography>
              {`Jolly may share data with trusted partners to help perform statistical analysis, send you email or postal mail, provide customer support, or facilitate payment transactions. All such third parties are required to maintain the confidentiality of your information, and they may only use your personal  information in accordance with their own privacy policies or to provide these services to Jolly.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly may disclose your personal information, without notice, if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on Jolly or the site; (b) protect and defend the rights or property of Jolly; and/or (c) act under exigent circumstances to  protect the personal safety of users of Jolly, or the public.`}
            </Typography>
            <Typography variant="h6">Tracking User Behavior</Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly may keep track of the websites and pages our users visit within Jolly, in order to determine what Jolly services are the most popular. This data is used to deliver customized content and other services within Jolly to customers whose behavior indicates that they may be interested in a particular subject area. Jolly may use advanced tracking such as screen recordings of user behavior on our site, for the purpose of identifying and resolving any problems or usability issues with our site.`}
            </Typography>
            <Typography variant="h6">
              Automatically Collected Information
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`Information about your computer hardware and software may be automatically collected by Jolly. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the Jolly website.`}
            </Typography>
            <Typography variant="h6">Use of Cookies</Typography>
            <Typography className={classes.bottomMargin}>
              {`The Jolly website may use "cookies" to help personalize your online experience. A cookie is a text file that is placed on your hard disk by a web page server. Cookies cannot be used to run programs or deliver viruses to your computer. Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`One of the primary purposes of cookies is to provide a convenience feature to save you time. The purpose of a cookie is to tell the Web server that you have returned to a specific page. For example, if you personalize Jolly pages, or register with Jolly site or services, a cookie helps Jolly to recall your specific information on subsequent visits. This simplifies the process of recording your personal information, such as addresses, and so on. When you return to the same Jolly website, the information you previously provided can be retrieved, so you can easily use the Jolly features that you  customized.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`You have the ability to accept or decline cookies. Most Web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of the Jolly services or websites you visit.`}
            </Typography>
            <Typography variant="h6">Links</Typography>
            <Typography className={classes.bottomMargin}>
              {`This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally  identifiable information.`}
            </Typography>
            <Typography variant="h6">
              Security of your Personal Information
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly secures your personal information from unauthorized access, use, or disclosure. Jolly uses the SSL Protocol for this purpose. When personal information is transmitted to other websites, it is protected through the use of encryption, such as the Secure Sockets Layer (SSL) protocol.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`We  strive to take appropriate security measures to protect against  unauthorized access to or alteration of your personal information. Unfortunately, no data transmission over the Internet or any wireless network can be guaranteed to be 100% secure. As a result, while we strive to protect your personal information, you acknowledge that: (a) there are security and privacy limitations inherent to the Internet which are beyond our control; and (b) security, integrity, and privacy of any and all information and data exchanged between you and us through this Site cannot be guaranteed.`}
            </Typography>
            <Typography variant="h6">Children Under Thirteen</Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly does not knowingly collect personally identifiable information from children under the age of thirteen. If you are under the age of  thirteen, you are prohibited from using the Jolly website.`}
            </Typography>
            <Typography variant="h6">
              Disconnecting your Jolly Account from Third Party Websites
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`You will be able to connect your Jolly account to third party accounts.  BY CONNECTING YOUR JOLLY ACCOUNT TO YOUR THIRD PARTY ACCOUNT, YOU ACKNOWLEDGE AND AGREE THAT YOU ARE CONSENTING TO THE CONTINUOUS RELEASE  OF INFORMATION ABOUT YOU TO OTHERS (IN ACCORDANCE WITH YOUR PRIVACY  SETTINGS ON THOSE THIRD PARTY SITES). IF YOU DO NOT WANT INFORMATION ABOUT YOU, INCLUDING PERSONALLY IDENTIFYING INFORMATION, TO BE SHARED IN THIS MANNER, DO NOT USE THIS FEATURE. You may disconnect your account from a third party account at any time. To disconnect access to your  account on a third party site, follow the guidelines provided by that third party site for disconnecting your account.`}
            </Typography>
            <Typography variant="h6">E-mail Communications</Typography>
            <Typography className={classes.bottomMargin}>
              {`From time to time, Jolly may contact you via email for the purpose of  providing announcements, promotional offers, alerts, confirmations, surveys, and/or other general communication. In order to improve our  Services, we may receive a notification when you open an email from Jolly or click on a link therein.`}
            </Typography>
            <Typography className={classes.bottomMargin}>
              {`If you would like to stop receiving marketing or promotional communications via email from Jolly, you may opt out of such communications. To opt-out or unsubscribe from emails, use the link provided in the email footer, or contact us at contact@joinjolly.com.`}
            </Typography>
            <Typography variant="h6">External Data Storage Sites</Typography>
            <Typography className={classes.bottomMargin}>
              {`We may store your data on servers provided by third party hosting vendors with whom we have contracted.`}
            </Typography>
            <Typography variant="h6">Changes to this Statement</Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by placing a prominent notice on our site, and/or by updating any privacy information on this page. Your continued use of the Site and/or Services available through this Site after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.`}
            </Typography>
            <Typography variant="h6">Contact Information</Typography>
            <Typography className={classes.bottomMargin}>
              {`Jolly welcomes your questions or comments regarding this Statement of  Privacy. If you believe that Jolly has not adhered to this Statement, please contact Jolly at:`}
            </Typography>
            <Typography>Servable, Inc.</Typography>
            <Typography>600 Congress Ave., 14th Floor</Typography>
            <Typography className={classes.bottomMargin}>
              Austin, Texas 78701
            </Typography>
            <Typography>Email Address:</Typography>
            <Typography className={classes.bottomMargin}>
              contact@joinjolly.com
            </Typography>
            <Typography>Telephone number:</Typography>
            <Typography>5125371810</Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PrivacyPolicy);
