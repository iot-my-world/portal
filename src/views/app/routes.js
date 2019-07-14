import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import DomainIcon from '@material-ui/icons/Domain'
import TrackerIcon from '@material-ui/icons/DevicesOther'
import PartyProfileContainer from 'views/partyProfile/PartyProfileContainer'
import ProfileContainer from 'views/profile/ProfileContainer'
import SystemHomeContainer from 'views/home/system/SystemContainer'
import CompanyHomeContainer from 'views/home/company/CompanyContainer'
import ClientHomeContainer from 'views/home/client/ClientContainer'
import HumanUserContainer from 'views/user/human/HumanContainer'
import SF001TrackerContainer from 'views/tracker/sf001/SF001Container'
import CompanyContainer from 'views/party/company/CompanyContainer'
import ClientContainer from 'views/party/client/ClientContainer'
import {
  PartyCompanyViewPermission,
  PartyClientViewPermission,
  PartyUserViewPermission,
  TrackerSF001ViewPermission,
} from 'brain/security/permission/view/permission'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'

const appSideBarLinkRoutes = [
  {
    path: '/app/party/company',
    name: 'Companies',
    viewPermission: PartyCompanyViewPermission,
    mini: 'CO',
    icon: DomainIcon,
    component: CompanyContainer,
    sidebarLinkID: 'sidebarCompanyPartyManagementLink'
  },
  {
    path: '/app/party/client',
    name: 'Clients',
    viewPermission: PartyClientViewPermission,
    mini: 'CL',
    icon: PeopleIcon,
    component: ClientContainer,
    sidebarLinkID: 'sidebarClientPartyManagementLink'
  },
  {
    path: '/app/party/user',
    name: 'Users',
    viewPermission: PartyUserViewPermission,
    mini: 'US',
    icon: PersonIcon,
    component: HumanUserContainer,
    sidebarLinkID: 'sidebarHumanUserPartyManagementLink'
  },
  {
    collapse: true,
    path: '/app/devices/sigbug',
    name: 'Sigbug',
    state: 'opensigbug',
    icon: TrackerIcon,
    sidebarLinkID: 'sidebarSigbugDeviceMenuOpenLink',
    views: [
      {
        path: '/app/devices/sigbug/list',
        name: 'SF001 Tracker',
        viewPermission: TrackerSF001ViewPermission,
        icon: TrackerIcon,
        component: SF001TrackerContainer,
        sidebarLinkID: 'sidebarSigbugDeviceListManagementLink'
      },
    ],
  },
]

const appRouteBuilder = (partyType, viewPermissions, user, party) => {
  let appRoutes = {
    userProfileRoute: {
      text: user.name,
      icon: PersonIcon,
      path: '/app/profile/user',
      component: ProfileContainer,
      sidebarLinkID: 'sidebarUserProfileLink',
    },
    partyProfileRoute: {},
    partyHomeViewRoute: {},
    sidebarLinkRoutes: [],
  }

  // build sidebar link routes
  for (let route of appSideBarLinkRoutes) {
    if (route.collapse) {
      let collapsibleRoute = {
        ...route,
        views: [],
      }
      for (let view of route.views) {
        if (view.hasOwnProperty('viewPermission')) {
          // if the view has an assigned view permission
          if (viewPermissions.includes(view.viewPermission)) {
            // and this user has the view permission,
            // then add the view
            collapsibleRoute.views.push(view)
          }
        } else {
          // otherwise the view does not have an assigned permission
          // so add it
          collapsibleRoute.views.push(view)
        }
      }
      // if any views were assigned then add the whole
      // route with it's views
      if (collapsibleRoute.views.length > 0) {
        appRoutes.sidebarLinkRoutes.push(collapsibleRoute)
      }
    } else {
      if (route.hasOwnProperty('viewPermission')) {
        // if the view has an assigned view permission
        if (viewPermissions.includes(route.viewPermission)) {
          // and this user has the view permission,
          // then add the view
          appRoutes.sidebarLinkRoutes.push(route)
        }
      } else {
        // otherwise the view does not have an assigned permission
        // so add it
        appRoutes.sidebarLinkRoutes.push(route)
      }
    }
  }

  // build party profile route
  let partyProfileIcon = PersonIcon
  switch (partyType) {
    case CompanyPartyType:
      partyProfileIcon = DomainIcon
      break

    case ClientPartyType:
      partyProfileIcon = PeopleIcon
      break

    default:
  }
  appRoutes.partyProfileRoute = {
    path: '/app/profile/party',
    name: party.name,
    icon: partyProfileIcon,
    component: PartyProfileContainer,
    sidebarLinkID: 'sidebarPartyProfileLink',
  }

  // build home route
  switch (partyType) {
    case SystemPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: SystemHomeContainer,
        sidebarLinkID: 'sidebarSystemHomeLink',
      }
      break

    case CompanyPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: CompanyHomeContainer,
        sidebarLinkID: 'sidebarCompanyHomeLink',
      }
      break

    case ClientPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: ClientHomeContainer,
        sidebarLinkID: 'sidebarClientHomeLink',
      }
      break

    default:
      throw new TypeError(
        `invalid party type given to home root builder ${partyType}`,
      )
  }

  return appRoutes
}

export {
  appRouteBuilder,
}
