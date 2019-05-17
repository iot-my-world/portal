import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import DomainIcon from '@material-ui/icons/Domain'
import ConfigurationIcon from '@material-ui/icons/Settings'
import DeviceIcon from '@material-ui/icons/DevicesOther'
import DashboardIcon from '@material-ui/icons/Dashboard'
import GPSFixedIcon from '@material-ui/icons/GpsFixed'
import TimelineIcon from '@material-ui/icons/Timeline'
import PartyProfileContainer from 'views/partyProfile/PartyProfileContainer'
import ProfileContainer from 'views/profile/ProfileContainer'
import SystemHomeContainer from 'views/home/system/SystemContainer'
import CompanyHomeContainer from 'views/home/company/CompanyContainer'
import ClientHomeContainer from 'views/home/client/ClientContainer'
import UserContainer from 'views/configuration/user/UserContainer'
import APIUserContainer from 'views/configuration/apiUser/APIUserContainer'
import ZX303DeviceContainer from 'views/configuration/device/DeviceContainer'
import LiveTrackingDashboardContainer
  from 'views/dashboard/tracking/live/LiveContainer'
import HistoricalTrackingDashboardContainer
  from 'views/dashboard/tracking/historical/HistoricalContainer'
import ZX303DeviceDiagnosticsContainer
  from 'views/deviceDiagnostics/zx303/ZX303Container'
import CompanyContainer from 'views/configuration/company/CompanyContainer'
import ClientContainer from 'views/configuration/client/ClientContainer'
import {
  APIUserConfiguration as ViewAPIUserConfiguration,
  DeviceConfiguration,
  HistoricalTrackingDashboard as ViewHistoricalTrackingDashboard,
  LiveTrackingDashboard as ViewLiveTrackingDashboard,
  PartyClientConfiguration,
  PartyCompanyConfiguration,
  PartyUserConfiguration, ViewZX303DeviceDiagnostics,
} from 'brain/security/permission/view/permission'
import {
  ClientPartyType,
  CompanyPartyType,
  SystemPartyType,
} from 'brain/party/types'


const appSideBarLinkRoutes = [
  // {
  //   path: '/app/dashboard',
  //   name: 'Dashboard',
  //   icon: ConfigurationIcon,
  //   component: () => <div></div>,
  // },
  {
    collapse: true,
    path: '/app/dashboard',
    name: 'Dashboard',
    state: 'openDashboard',
    icon: DashboardIcon,
    views: [
      {
        path: '/app/dashboard/liveTracking',
        name: 'Live Tracking',
        viewPermission: ViewLiveTrackingDashboard,
        icon: GPSFixedIcon,
        component: LiveTrackingDashboardContainer,
      },
      {
        path: '/app/dashboard/historicalTracking',
        name: 'Historical Tracking',
        viewPermission: ViewHistoricalTrackingDashboard,
        icon: TimelineIcon,
        component: HistoricalTrackingDashboardContainer,
      },
    ],
  },
  {
    collapse: true,
    path: '/app/configuration',
    name: 'Configuration',
    state: 'openConfiguration',
    icon: ConfigurationIcon,
    views: [
      {
        path: '/app/configuration/company',
        name: 'Company',
        viewPermission: PartyCompanyConfiguration,
        mini: 'CO',
        icon: DomainIcon,
        component: CompanyContainer,
      },
      {
        path: '/app/configuration/client',
        name: 'Client',
        viewPermission: PartyClientConfiguration,
        mini: 'CL',
        icon: PeopleIcon,
        component: ClientContainer,
      },
      {
        path: '/app/configuration/user',
        name: 'User',
        viewPermission: PartyUserConfiguration,
        mini: 'US',
        icon: PersonIcon,
        component: UserContainer,
      },
      {
        path: '/app/configuration/apiUser',
        name: 'API User',
        viewPermission: ViewAPIUserConfiguration,
        mini: 'AP',
        icon: PersonIcon,
        component: APIUserContainer,
      },
      {
        path: '/app/configuration/zx303device',
        name: 'ZX303 Device',
        viewPermission: DeviceConfiguration,
        icon: DeviceIcon,
        component: ZX303DeviceContainer,
      },
    ],
  },
  {
    collapse: true,
    path: '/app/deviceDiagnostics',
    name: 'Device Diagnostics',
    state: 'openDeviceDiagnostics',
    icon: ConfigurationIcon,
    views: [
      {
        path: '/app/deviceDiagnostics/zx303',
        name: 'ZX303',
        viewPermission: ViewZX303DeviceDiagnostics,
        icon: DeviceIcon,
        component: ZX303DeviceDiagnosticsContainer,
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
  }


  // build home route
  switch (partyType) {
    case SystemPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: SystemHomeContainer,
      }
      break

    case CompanyPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: CompanyHomeContainer,
      }
      break

    case ClientPartyType:
      appRoutes.partyHomeViewRoute = {
        text: 'Home',
        path: '/app',
        component: ClientHomeContainer,
      }
      break

    default:
      throw new TypeError(
        `invalid party type given to home root builder ${partyType}`
      )
  }

  return appRoutes
}

export {
  appRouteBuilder,
}
