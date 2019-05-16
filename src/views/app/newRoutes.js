import React from 'react'

// @material-ui/icons
import Apps from '@material-ui/icons/Apps'
import WidgetsIcon from '@material-ui/icons/Widgets'

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
import CompanyContainer from 'views/configuration/company/CompanyContainer'

const dashRoutes = [
  // {
  //   path: '/app/dashboard',
  //   name: 'Dashboard',
  //   icon: ConfigurationIcon,
  //   component: () => <div></div>,
  // },
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
        mini: 'C',
        component: CompanyContainer,
      },
    ],
  },
]
export default dashRoutes
