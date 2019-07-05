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

function TermsConditionsAndPrivacy(props) {
  const {classes} = props
  return (
    <div className={classes.root}>
      <h3 className={classes.heading}>
        Terms and Conditions
      </h3>
      <p className={classes.body}>
        These terms and conditions outline the rules and regulations for the use
        of IOT My World's Website.
      </p>
      <p className={classes.body}>
        By accessing this website we assume you accept these terms and
        conditions in full.
        Do not continue to use IOT My World's website if you do not accept all
        of the terms
        and conditions stated on this page.
      </p>
      <p className={classes.body}>
        The following terminology applies to these Terms and Conditions, Privacy
        Statement and Disclaimer Notice
        and any or all Agreements: "Client", "You" and "Your" refers to you, the
        person accessing this website
        and accepting the Organisation's terms and conditions. "The
        Organisation", "Ourselves", "We", "Our" and "Us", refers
        to IOT My World. "Party", "Parties", or "Us", refers to both the Client
        and ourselves, or either the Client
        or ourselves. All terms refer to the offer, acceptance and consideration
        of payment necessary to undertake
        the process of our assistance to the Client in the most appropriate
        manner, whether by formal meetings
        of a fixed duration, or any other means, for the express purpose of
        meeting the Client's needs in respect
        of provision of the Organisation's stated services/products, in
        accordance with and subject to, prevailing international law.
        Any use of the above terminology or other words in the singular, plural,
        capitalisation and/or he/she or they, are taken as interchangeable and
        therefore as referring to same.
      </p>
      <h5 className={classes.heading}>
        License
      </h5>
      <p className={classes.body}>
        Unless otherwise stated all content is provided under the
        <a
          href={'https://opensource.org/licenses/AGPL-3.0'}
          target={'_blank'}
          className={classes.link}
        >
          {' GNU Affero General Public License v3.0'}
        </a>.
        Permissions of this strongest copyleft license are conditioned on making
        available complete source code of licensed works and modifications,
        which include larger works using a licensed work, under the same
        license.
        Copyright and license notices must be preserved. Contributors provide an
        express grant of patent rights. When a modified version is used to
        provide
        a service over a network, the complete source code of the modified
        version
        must be made available.
      </p>
      <p className={classes.heading}>
        User Comments
      </p>
      <ol className={classes.body}>
        <li>
          This Agreement shall begin on the date hereof.
        </li>
        <li>
          Certain parts of this website may offer the opportunity for users to
          post and exchange opinions, information,
          material and data ('Comments') in areas of the website. IOT My World
          does not screen, edit, publish
          or review Comments prior to their appearance on the website and
          Comments do not reflect the views or
          opinions of IOT My World, its agents or affiliates. Comments reflect
          the view and opinion of the
          person who posts such view or opinion. To the extent permitted by
          applicable laws IOT My World shall
          not be responsible or liable for the Comments or for any loss cost,
          liability, damages or expenses caused
          and or suffered as a result of any use of and/or posting of and/or
          appearance of the Comments on this
          website.
        </li>
        <li>
          IOT My World reserves the right to monitor all Comments and to
          remove any Comments which it considers
          in its absolute discretion to be inappropriate, offensive or
          otherwise in breach of these Terms and Conditions.
        </li>
        <li>You warrant and represent that:
          <ol>
            <li>
              You are entitled to post the Comments on our website and have
              all necessary licenses and consents to do so;
            </li>
            <li>
              The Comments do not infringe any intellectual property right,
              including without limitation copyright,
              patent or trademark, or other proprietary right of any third
              party;
            </li>
            <li>
              The Comments do not contain any defamatory, libelous, offensive,
              indecent or otherwise unlawful material
              or material which is an invasion of privacy
            </li>
            <li>
              The Comments will not be used to solicit or promote business or
              custom or present commercial activities
              or unlawful activity.
            </li>
          </ol>
        </li>
        <li>
          You hereby grant to <strong>IOT My World</strong> a non-exclusive
          royalty-free license to use, reproduce,
          edit and authorize others to use, reproduce and edit any of your
          Comments in any and all forms, formats
          or media.
        </li>
      </ol>
      <h5 className={classes.heading}>
        Hyperlinking to our Content
      </h5>
      <ol className={classes.body}>
        <li>The following organizations may link to our Web site without prior
          written approval:
          <ol>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors when they list us in the
              directory may link to our Web site in the same
              manner as they hyperlink to the Web sites of other listed
              businesses; and
            </li>
            <li>Systemwide Accredited Businesses.</li>
          </ol>
        </li>
      </ol>
      <ol start="2" className={classes.body}>
        <li>These organizations may link to our home page, to publications or
          to other Web site information so long
          as the link: (a) is not in any way misleading; (b) does not falsely
          imply sponsorship, endorsement or
          approval of the linking party and its products or services; and (c)
          fits within the context of the linking
          party's site.
        </li>
        <li>We may consider and approve in our sole discretion other link
          requests from the following types of organizations:
          <ol>
            <li>commonly-known consumer and/or business information sources
              such as Chambers of Commerce, American
              Automobile Association, AARP and Consumers Union;
            </li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities, including
              charity giving sites,
            </li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law and consulting firms whose primary clients are
              businesses; and
            </li>
            <li>educational institutions and trade associations.</li>
          </ol>
        </li>
      </ol>
      <p className={classes.body}>
        We will approve link requests from these organizations if we determine
        that: (a) the link would not reflect
        unfavorably on us or our accredited businesses (for example, trade
        associations or other organizations
        representing inherently suspect types of business, such as work-at-home
        opportunities, shall not be allowed
        to link); (b)the organization does not have an unsatisfactory record
        with us; (c) the benefit to us from
        the visibility associated with the hyperlink outweighs the absence of
        IOT My World; and (d) where the
        link is in the context of general resource information or is otherwise
        consistent with editorial content
        in a newsletter or similar product furthering the mission of the
        organization.
      </p>
      <p className={classes.body}>
        These organizations may link to our home page, to publications or to
        other Web site information so long as
        the link: (a) is not in any way misleading; (b) does not falsely imply
        sponsorship, endorsement or approval
        of the linking party and it products or services; and (c) fits within
        the context of the linking party's
        site.
      </p>
      <p className={classes.body}>
        Approved organizations may hyperlink to our Web site as follows:
      </p>
      <ol className={classes.body}>
        <li>By use of our name; or</li>
        <li>
          By use of the uniform resource locator (Web address) being linked
          to; or
        </li>
        <li>
          By use of any other description of our Web site or material being
          linked to that makes sense within the context and format of content
          on the linking party's site.
        </li>
      </ol>
      <p className={classes.body}>
        No use of IOT My World's logo or other artwork will be allowed for
        linking absent a trademark license agreement.
      </p>
      <h5 className={classes.heading}>
        Iframes
      </h5>
      <p className={classes.body}>
        Without prior approval and express written permission, you may not
        create frames around our Web pages or
        use other techniques that alter in any way the visual presentation or
        appearance of our Web site.
      </p>
      <h5 className={classes.heading}>
        Reservation of Rights
      </h5>
      <p className={classes.body}>
        We reserve the right at any time and in its sole discretion to request
        that you remove all links or any particular link to our Web site.
        You agree to immediately remove all links to our Web site upon such
        request.
        We also reserve the right to amend these terms and conditions and its
        linking
        policy at any time. By continuing to link to our Web site, you agree to
        be bound
        to and abide by these linking terms and conditions.
      </p>
      <h5 className={classes.heading}>
        Removal of links from our website
      </h5>
      <p className={classes.body}>
        If you find any link on our Web site or any linked web site
        objectionable
        for any reason, you may contact us about this. We will consider requests
        to remove links but will have no obligation to do so or to respond
        directly to you.
      </p>
      <p className={classes.body}>
        Whilst we endeavour to ensure that the information on this website is
        correct, we do not warrant its completeness or accuracy; nor do we
        commit
        to ensuring that the website remains available or that the material on
        the website is kept up to date.
      </p>
      <h5 className={classes.heading}>
        Content Liability
      </h5>
      <p className={classes.body}>
        We shall have no responsibility or liability for any content appearing
        on your Web site. You agree to indemnify and defend us against all
        claims arising out of or based upon your Website. No link(s) may appear
        on any page on your Web site or within any context containing content or
        materials that may be interpreted as libelous, obscene or criminal,
        or which infringes, otherwise violates, or advocates the infringement or
        other violation of, any third party rights.
      </p>
      <h5 className={classes.heading}>
        Disclaimer
      </h5>
      <p className={classes.body}>
        To the maximum extent permitted by applicable law, we exclude all
        representations, warranties and conditions relating to our website and
        the use of this website (including, without limitation, any warranties
        implied by law in respect of satisfactory quality, fitness for purpose
        and/or the use of reasonable care and skill). Nothing in this disclaimer
        will:
      </p>
      <ol className={classes.body}>
        <li>limit or exclude our or your liability for death or personal
          injury
          resulting from negligence;
        </li>
        <li>limit or exclude our or your liability for fraud or fraudulent
          misrepresentation;
        </li>
        <li>limit any of our or your liabilities in any way that is not
          permitted under applicable law; or
        </li>
        <li>exclude any of our or your liabilities that may not be excluded
          under applicable law.
        </li>
      </ol>
      <p className={classes.body}>
        The limitations and exclusions of liability set out in this Section and
        elsewhere in this disclaimer: (a)
        are subject to the preceding paragraph; and (b) govern all liabilities
        arising under the disclaimer or
        in relation to the subject matter of this disclaimer, including
        liabilities arising in contract, in tort
        (including negligence) and for breach of statutory duty.
      </p>
      <p className={classes.body}>
        To the extent that the website and the information and services on the
        website are provided free of charge, we will not be liable for any loss
        or damage of any nature.
      </p>
      <h3 className={classes.heading}>
        Privacy Policy
      </h3>
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

TermsConditionsAndPrivacy.propTypes = {
  classes: PropTypes.object.isRequired,
}

TermsConditionsAndPrivacy.defaultProps = {}

const StyledTermsConditionsAndPrivacy = withStyles(styles)(TermsConditionsAndPrivacy)

export default StyledTermsConditionsAndPrivacy