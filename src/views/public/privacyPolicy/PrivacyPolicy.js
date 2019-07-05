import React from 'react'
import {withStyles} from '@material-ui/core'
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 0 5px 5px black',
    display: 'grid',
    margin: '10px',
    padding: '5px',
    gridTemplateRows: '1fr',
  },
  heading: {
    color: theme.palette.primary.contrastText,
  },
  body: {
    color: theme.palette.primary.contrastText,
  },
  link: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

function PrivacyPolicy(props) {
  const {classes} = props
  return (
    <div className={classes.root}>
      <h5 className={classes.heading}>
        Welcome to our Privacy Policy
      </h5>
      <h5 className={classes.heading}>
        Your privacy is critically important to us.
      </h5>
      <p className={classes.body}>
        It is IOT My World's policy to respect your privacy regarding any
        information we may collect while operating our website.
        This Privacy Policy applies to
        <a
          href={'https://www.iotmyworld.com'}
          target={'_blank'}
          className={classes.link}
        >
          {' IOT My World '}
        </a>
        (hereinafter, "us", "we", or "https://www.iotmyworld.com"). We respect
        your privacy and are committed to protecting personally identifiable
        information you may provide us through the Website. We have adopted this
        privacy policy ("Privacy Policy") to explain what information may be
        collected on our Website, how we use this information, and under what
        circumstances we may disclose the information to third parties. This
        Privacy Policy applies only to information we collect through the
        Website and does not apply to our collection of information from other
        sources.
      </p>
      <p className={classes.body}>
        This Privacy Policy, together with the Terms and conditions posted on
        our Website, set forth the general rules and policies governing your
        use of our Website. Depending on your activities when visiting our
        Website, you may be required to agree to additional terms and conditions.
      </p>
      <h5 className={classes.heading}>
        Website Visitors
      </h5>
      <p className={classes.body}>
        Like most website operators, IOT My World collects
        non-personally-identifying information of the sort that web browsers
        and servers typically make available, such as the browser type,
        language preference, referring site, and the date and time of each
        visitor request. IOT My World's purpose in collecting non-personally
        identifying information is to better understand how IOT My World's
        visitors use its website. From time to time, IOT My World may release
        non-personally-identifying information in the aggregate, e.g., by
        publishing a report on trends in the usage of its website.
      </p>
      <p className={classes.body}>
        IOT My World also collects potentially personally-identifying
        information like Internet Protocol (IP) addresses for logged in users
        and for users leaving comments on https://www.iotmyworld.com posts.
        IOT My World only discloses logged in user and commenter IP addresses
        under the same circumstances that it uses and discloses
        personally-identifying information as described below.
      </p>
      <h5 className={classes.heading}>
        Gathering of Personally-Identifying Information
      </h5>
      <p className={classes.body}>
        Certain visitors to IOT My World's websites
        choose to interact with IOT My World in ways that require IOT My World
        to gather personally-identifying information. The amount and type of
        information that IOT My World gathers depends on the nature of the
        interaction. For example, we ask visitors who sign up for an account at
        https://www.iotmyworld.com to provide a username and email address.
      </p>
      <h5 className={classes.heading}>
        Security
      </h5>
      <p className={classes.body}>
        The security of your Personal Information is important to us, but
        remember that no method of transmission over the Internet, or method
        of electronic storage is 100% secure. While we strive to use
        commercially acceptable means to protect your Personal Information, we
        cannot guarantee its absolute security.
      </p>

      <h5 className={classes.heading}>
        Advertisements
      </h5>
      <p className={classes.body}>
        Ads appearing on our website may be delivered to users by advertising
        partners, who may set cookies. These cookies allow the ad server to
        recognize your computer each time they send you an online advertisement
        to compile information about you or others who use your computer.
        This information allows ad networks to, among other things, deliver
        targeted advertisements that they believe will be of most interest to
        you. This Privacy Policy covers the use of cookies by IOT My World
        and does not cover the use of cookies by any advertisers.
      </p>

      <h5 className={classes.heading}>
        Links To External Sites
      </h5>
      <p className={classes.body}>
        Our Service may contain links to external sites that are not operated
        by us. If you click on a third party link, you will be directed to that
        third party's site. We strongly advise you to review the Privacy Policy
        and terms and conditions of every site you visit.
      </p>
      <p className={classes.body}>
        We have no control over, and assume no responsibility for the content,
        privacy policies or practices of any third party sites, products or
        services.
      </p>
      <h5 className={classes.heading}>
        Protection of Certain Personally-Identifying Information
      </h5>
      <p className={classes.body}>
        IOT My World discloses potentially personally-identifying and
        personally-identifying information only to those of its employees,
        contractors and affiliated organizations that (i) need to know that
        information in order to process it on IOT My World's behalf or to
        provide services available at IOT My World's website, and (ii) that
        have agreed not to disclose it to others. Some of those employees,
        contractors and affiliated organizations may be located outside of your
        home country; by using IOT My World's website, you consent to the
        transfer of such information to them. IOT My World will not rent or
        sell potentially personally-identifying and personally-identifying
        information to anyone. Other than to its employees, contractors and
        affiliated organizations, as described above, IOT My World discloses
        potentially personally-identifying and personally-identifying
        information only in response to a subpoena, court order or other
        governmental request, or when IOT My World believes in good faith that
        disclosure is reasonably necessary to protect the property or rights of
        IOT My World, third parties or the public at large.
      </p>
      <p className={classes.body}>
        If you are a registered user of https://www.iotmyworld.com and have
        supplied your email address, IOT My World may occasionally send you an
        email to tell you about new features, solicit your feedback, or just
        keep you up to date with what's going on with IOT My World and our
        products. We primarily use our site to communicate this type of
        information, so we expect to keep this type of email to a minimum. If
        you send us a request (for example via a support email or via one of
        our feedback mechanisms), we reserve the right to publish it in order
        to help us clarify or respond to your request or to help us support
        other users. IOT My World takes all measures reasonably necessary to
        protect against the unauthorized access, use, alteration or destruction
        of potentially personally-identifying and personally-identifying
        information.
      </p>

      <h5 className={classes.heading}>
        Aggregated Statistics
      </h5>
      <p className={classes.body}>
        IOT My World may collect statistics about the behavior of visitors to
        its website. IOT My World may display this information publicly or
        provide it to others. However, IOT My World does not disclose your
        personally-identifying information.
      </p>

      <h5 className={classes.heading}>
        Affiliate Disclosure
      </h5>
      <p className={classes.body}>
        This site may use affiliate links and may earn a commission from
        certain links. This does not affect your purchases or the price you
        may pay.
      </p>
      <h5 className={classes.heading}>Cookies</h5>
      <p className={classes.body}>
        To enrich and perfect your online experience, IOT My World may use
        "Cookies", similar technologies and services provided by others to
        display personalized content, appropriate advertising and store your
        preferences on your computer.
      </p>
      <p className={classes.body}>
        A cookie is a string of information that a website stores on a
        visitor's computer, and that the visitor's browser provides to the
        website each time the visitor returns. IOT My World may use cookies to
        help IOT My World identify and track visitors, their usage of
        https://www.iotmyworld.com, and their website access preferences. IOT
        My World visitors who do not wish to have cookies placed on their
        computers should set their browsers to refuse cookies before using IOT
        My World's websites, with the drawback that certain features of IOT
        My World's websites may not function properly without the aid of
        cookies.
      </p>
      <p className={classes.body}>
        By continuing to navigate our website without changing your cookie
        settings, you hereby acknowledge and agree to IOT My World's use of
        cookies.
      </p>
      <h5 className={classes.heading}>
        E-commerce
      </h5>
      <p className={classes.body}>
        Those who engage in transactions with IOT My World – by purchasing IOT
        My World's services or products, are asked to provide additional
        information, including as necessary the personal and financial
        information required to process those transactions. In each case, IOT
        My World collects such information only insofar as is necessary or
        appropriate to fulfill the purpose of the visitor's interaction with
        IOT My World. IOT My World does not disclose personally-identifying
        information other than as described below. And visitors can always
        refuse to supply personally-identifying information, with the caveat
        that it may prevent them from engaging in certain website-related
        activities.
      </p>
      <h5 className={classes.heading}>
        Business Transfers
      </h5>
      <p className={classes.body}>
        If IOT My World, or substantially all of its assets, were acquired, or
        in the unlikely event that IOT My World goes out of business or enters
        bankruptcy, user information would be one of the assets that is
        transferred or acquired by a third party. You acknowledge that such
        transfers may occur, and that any acquirer of IOT My World may continue
        to use your personal information as set forth in this policy.
      </p>

      <h5 className={classes.heading}>
        Privacy Policy Changes
      </h5>
      <p className={classes.body}>
        Although most changes are likely to be minor, IOT My World may change
        its Privacy Policy from time to time, and in IOT My World's sole
        discretion. IOT My World encourages visitors to frequently check this
        page for any changes to its Privacy Policy. Your continued use of this
        site after any change in this Privacy Policy will constitute your
        acceptance of such change.
      </p>
    </div>
  )
}

PrivacyPolicy.propTypes = {
  classes: PropTypes.object.isRequired,
}

PrivacyPolicy.defaultProps = {}

const StyledPrivacyPolicy = withStyles(styles)(PrivacyPolicy)

export default StyledPrivacyPolicy