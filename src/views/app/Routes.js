import React from 'react'
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
import CameraIcon from '@material-ui/icons/Camera'
// Home Views
import SystemHomeContainer from 'views/home/system/SystemContainer'
import CompanyHomeContainer from 'views/home/company/CompanyContainer'
import ClientHomeContainer from 'views/home/client/ClientContainer'
// Profile View
import ProfileContainer from 'views/profile/ProfileContainer'
// Configuration
import CompanyContainer from 'views/configuration/company/CompanyContainer'
import ClientContainer from 'views/configuration/client/ClientContainer'
import UserContainer from 'views/configuration/user/UserContainer'
import Device from 'views/configuration/device/Device'
// Dashboards
import LiveTrackingDashboardContainer
  from 'views/dashboard/tracking/live/LiveContainer'
import HistoricalTrackingDashboardContainer
  from 'views/dashboard/tracking/historical/HistoricalContainer'

import BarcodeTest from 'views/barcodeTest/BarcodeTest'

// View Permissions
import {
  Configuration, PartyCompanyConfiguration, PartyClientConfiguration,
  PartyUserConfiguration, DeviceConfiguration, Dashboards,
  LiveTrackingDashboard as ViewLiveTrackingDashboard,
  HistoricalTrackingDashboard as ViewHistoricalTrackingDashboard,
} from 'brain/security/permission/view/permission'
import {
  SystemPartyType,
  CompanyPartyType,
  ClientPartyType,
} from 'brain/party/types'

const HomeRoute = {
  id: 'sidebarHomeLink',
  text: 'Home',
  icon: <HomeIcon/>,
  path: '/app',
}

const homeRouteBuilder = partyType => {
  switch (partyType) {
    case SystemPartyType:
      return {
        id: 'sidebarHomeLink',
        text: 'Home',
        icon: <HomeIcon/>,
        path: '/app',
        component: SystemHomeContainer,
      }
    case CompanyPartyType:
      return {
        id: 'sidebarHomeLink',
        text: 'Home',
        icon: <HomeIcon/>,
        path: '/app',
        component: CompanyHomeContainer,
      }
    case ClientPartyType:
      return {
        id: 'sidebarHomeLink',
        text: 'Home',
        icon: <HomeIcon/>,
        path: '/app',
        component: ClientHomeContainer,
      }
    default:
      throw new TypeError(
          `invalid party type given to home root builder ${partyType}`)
  }
}

const profileRouteBuilder = user => {
  return { // this is an individual route
    id: 'sidebarProfileLink',
    text: user.name,
    icon: <PersonIcon/>,
    path: '/app/profile',
    component: ProfileContainer,
  }
}

const AppRoutes = [
  // each array in this routes array  is a group which will
  // be separated by a divider

  [
    // each array contains route 'objects' or route 'objectGroup'
    // the difference is that objectGroups contain group: true

    { // this is a route group
      group: true,
      viewPermission: Configuration,
      id: 'sidebarConfigurationMenuOpen',
      text: 'Configuration',
      icon: <ConfigurationIcon/>,
      routes: [
        { // this is an individual route
          id: 'sidebarCompanyConfigurationLink',
          text: 'Company',
          icon: <DomainIcon/>,
          path: '/app/configuration/company',
          component: CompanyContainer,
          viewPermission: PartyCompanyConfiguration,
        },
        {
          id: 'sidebarClientConfigurationLink',
          text: 'Client',
          icon: <PeopleIcon/>,
          path: '/app/configuration/client',
          component: ClientContainer,
          viewPermission: PartyClientConfiguration,
        },
        {
          id: 'sidebarUserConfigurationLink',
          text: 'User',
          icon: <PersonIcon/>,
          path: '/app/configuration/user',
          component: UserContainer,
          viewPermission: PartyUserConfiguration,
        },
        {
          id: 'sidebarDeviceConfigurationLink',
          text: 'Device',
          icon: <DeviceIcon/>,
          path: '/app/configuration/device',
          component: Device,
          viewPermission: DeviceConfiguration,
        },
      ],
    },
  ],

  // -------- divider here --------
  [
    { // this is a route group
      group: true,
      viewPermission: Dashboards,
      id: 'sidebarDashboardsMenuOpen',
      text: 'Dashboards',
      icon: <DashboardIcon/>,
      routes: [
        {
          id: 'sidebarLiveTrackingDashboardLink',
          text: 'Live Tracking',
          icon: <GPSFixedIcon/>,
          path: '/app/dashboard/liveTracking',
          component: LiveTrackingDashboardContainer,
          viewPermission: ViewLiveTrackingDashboard,
        },
        {
          id: 'sidebarHistoricalTrackingDashboardLink',
          text: 'Historical Tracking',
          icon: <TimelineIcon/>,
          path: '/app/dashboard/historicalTracking',
          component: HistoricalTrackingDashboardContainer,
          viewPermission: ViewHistoricalTrackingDashboard,
        },
      ],
    },
  ],
  [
    { // this is an individual route
      id: 'barcodeTestMenuLink',
      text: 'Barcode Test',
      icon: <CameraIcon/>,
      path: '/app/barcodeTest',
      component: BarcodeTest,
    },
  ],
]

const appRouteBuilder = (partyType, viewPermissions, user) => {
  // initial routes added here
  let appRoutes = [
    [
      // build the profile root
      profileRouteBuilder(user),
      // build the home root
      homeRouteBuilder(partyType),
      { // this is an individual route
        id: 'sidebarLogoutLink',
        text: 'Logout',
        icon: <LockIcon/>,
        path: '/logout',
      },
    ],
  ]

  // go through each of the available routes ...
  for (let appRouteSection of AppRoutes) {
    let appRouteSectionArray = []

    for (let appRoute of appRouteSection) {

      // first consider the case of non group routes
      if (!appRoute.group) {
        if (
            // if view permission on this route is undefined
            (appRoute.viewPermission === undefined) ||
            // or if it isn't and this user has the view permission
            viewPermissions.includes(appRoute.viewPermission)
        ) {
          // then add the route
          appRouteSectionArray.push(appRoute)
        }
        continue
      }

      // otherwise the app route is a group
      if (
          // if the group has no assigned view permission
          (appRoute.viewPermission === undefined) ||
          // or if it does and this user has this view permission
          viewPermissions.includes(appRoute.viewPermission)
      ) {
        // then we build the route group
        let routeGroup = {
          group: true,
          id: appRoute.id,
          viewPermission: appRoute.viewPermission,
          text: appRoute.text,
          icon: appRoute.icon,
          routes: [],
        }
        // and go through all of the routes in the route group ...
        for (let route of appRoute.routes) {
          if (
              // if the route view permission is undefined
              (route.viewPermission === undefined) ||
              // or if it isn't and this user has the view permission
              viewPermissions.includes(route.viewPermission)
          ) {
            // then add the route
            routeGroup.routes.push(route)
          }
        }
        appRouteSectionArray.push(routeGroup)
      }
    }
    if (appRouteSectionArray.length > 0) {
      appRoutes.push(appRouteSectionArray)
    }
  }

  return appRoutes
}

export {
  HomeRoute,
  appRouteBuilder,
}
