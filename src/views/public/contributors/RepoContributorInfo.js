/**
 * @typedef {{
 *      avatar_url: String,
 *      events_url: String,
 *      followers_url: String,
 *      following_url: String,
 *      gists_url: String,
 *      gravatar_id: String,
 *      html_url: String,
 *      id: Number,
 *      login: String,
 *      node_id: String,
 *      organizations_url: String,
 *      received_events_url: String,
 *      repos_url: String,
 *      site_admin: Boolean,
 *      starred_url: String,
 *      subscriptions_url: String,
 *      type: String,
 *      url: String,
 * }} AuthorInfo
 */

import {isObject} from 'utilities/type/type'
import {IdIdentifier} from 'brain/search/identifier/index'

/**
 * @typedef {{
 *      author: AuthorInfo,
 *      total: Number,
 *      weeks: {
 *        w: Number,
 *        a: Number,
 *        d: Number,
 *        c: Number,
 *      }[],
 * }} RepoContributorEntry
 */

export default class ContributorInfo {
  /**
   * Github Login Name of Contributor
   * @type {string}
   * @private
   */
  _githubLoginName = ''

  /**
   * Map of repo name to contributions
   * @type {{string: RepoContributorEntry}}
   * @private
   */
  _repoContributions = {}

  /**
   * constructs a new contributor info
   * object for user with githubLoginName
   * @param {String} githubLoginName
   */
  constructor(githubLoginName) {
    this._githubLoginName = githubLoginName
  }

  /**
   * add contribution information for a particular repo
   * @param {String} repoName
   * @param {RepoContributorEntry} info
   */
  addRepoContributionInfo(repoName, info) {
    this._repoContributions[repoName] = info
  }

  get githubLoginName() {
    return this._githubLoginName
  }
}

class AuthorInfo {
  /**

   * @type {string}
   * @private
   */
  _avatar_url = ''

  /**
   * @type {string}
   * @private
   */
  _events_url = ''

  /**
   * @type {string}
   * @private
   */
  _followers_url = ''

  /**
   * @type {string}
   * @private
   */
  _following_url = ''

  /**
   * @type {string}
   * @private
   */
  _gists_url = ''

  /**
   * @type {string}
   * @private
   */
  _gravatar_id = ''

  /**
   * @type {string}
   * @private
   */
  _html_url = ''

  /**
   * @type {number}
   * @private
   */
  _id = 0

  /**
   * @type {string}
   * @private
   */
  _login = ''

  /**
   * @type {string}
   * @private
   */
  _node_id = ''

  /**
   * @type {string}
   * @private
   */
  _organizations_url = ''

  /**
   * @type {string}
   * @private
   */
  _received_events_url = ''

  /**
   * @type {string}
   * @private
   */
  _repos_url = ''

  /**
   * @type {boolean}
   * @private
   */
  _site_admin = false

  /**
   * @type {string}
   * @private
   */
  _starred_url = ''

  /**
   * @type {string}
   * @private
   */
  _subscriptions_url = ''

  /**
   * @type {string}
   * @private
   */
  _type = ''

  /**
   * @type {string}
   * @private
   */
  _url = ''

  /**
   * construct a new AuthorInfo Object
   * @param {AuthorInfo|Object} [authorInfo]
   */
  constructor(authorInfo) {
    if (
      (authorInfo !== undefined) &&
      (
        (authorInfo instanceof AuthorInfo) ||
        isObject(authorInfo)
      )
    ) {
      try {
        this._avatar_url = authorInfo.avatar_url
        this._events_url = authorInfo.events_url
        this._followers_url = authorInfo.followers_url
        this._following_url = authorInfo.following_url
        this._gists_url = authorInfo.gists_url
        this._gravatar_id = authorInfo.gravatar_id
        this._html_url = authorInfo.html_url
        this._id = authorInfo.id
        this._login = authorInfo.login
        this._node_id = authorInfo.node_id
        this._organizations_url = authorInfo.organizations_url
        this._received_events_url = authorInfo.received_events_url
        this._repos_url = authorInfo.repos_url
        this._site_admin = authorInfo.site_admin
        this._starred_url = authorInfo.starred_url
        this._subscriptions_url = authorInfo.subscriptions_url
        this._type = authorInfo.type
        this._url = authorInfo.url
      } catch (e) {
        throw new Error(`error constructing author info object§ ${e}`)
      }
    }
  }

  get avatar_url() {
    return this._avatar_url
  }

  get events_url() {
    return this._events_url
  }

  get followers_url() {
    return this._followers_url
  }

  get following_url() {
    return this._following_url
  }

  get gists_url() {
    return this._gists_url
  }

  get gravatar_id() {
    return this._gravatar_id
  }

  get html_url() {
    return this._html_url
  }

  get id() {
    return this._id
  }

  get login() {
    return this._login
  }

  get node_id() {
    return this._node_id
  }

  get organizations_url() {
    return this._organizations_url
  }

  get received_events_url() {
    return this._received_events_url
  }

  get repos_url() {
    return this._repos_url
  }

  get site_admin() {
    return this._site_admin
  }

  get starred_url() {
    return this._starred_url
  }

  get subscriptions_url() {
    return this._subscriptions_url
  }

  get type() {
    return this._type
  }

  get url() {
    return this._url
  }
}