import LockIcon from '@material-ui/icons/Lock'
import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import DomainIcon from '@material-ui/icons/Domain'
import HomeIcon from '@material-ui/icons/Home'
import ConfigurationIcon from '@material-ui/icons/Settings'
import DeviceIcon from '@material-ui/icons/DevicesOther'
import DashboardIcon from '@material-ui/icons/Dashboard'
import GPSFixedIcon from '@material-ui/icons/GpsFixed'
import TimelineIcon from '@material-ui/icons/Timeline'
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
import UserContainer from 'views/configuration/user/UserContainer'
import APIUserContainer from 'views/configuration/apiUser/APIUserContainer'
import DeviceContainer from 'views/configuration/device/DeviceContainer'
import LiveTrackingDashboardContainer
  from 'views/dashboard/tracking/live/LiveContainer'
import HistoricalTrackingDashboardContainer
  from 'views/dashboard/tracking/historical/HistoricalContainer'
import ZX303DeviceDiagnosticsContainer
  from 'views/deviceDiagnostics/zx303/ZX303Container'
import {ClientPartyType, CompanyPartyType} from 'brain/party/types'
import PartyProfileContainer from 'views/partyProfile/PartyProfileContainer'

const partyProfileRouteBuilder = (party, partyType) => {
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

  return {
    path: '/app/profile/party',
    name: party.name,
    icon: partyProfileIcon,
    component: PartyProfileContainer,
  }
}

const dashRoutes = [
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
        path: '/app/configuration/device',
        name: 'Device',
        viewPermission: DeviceConfiguration,
        mini: 'AP',
        icon: DeviceIcon,
        component: DeviceContainer,
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
export default dashRoutes

const appRouteBuilder = (partyType, viewPermissions, user, party) => {
  return {
    userProfileRoute: {},
    partyProfileRoute: {},
    partyHomeViewRoute: {},
    sidebarLinkRoutes: dashRoutes,
  }
}

export {
  appRouteBuilder,
}
