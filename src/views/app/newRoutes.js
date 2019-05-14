import React from 'react'

// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard'
import Apps from '@material-ui/icons/Apps'
import GridOn from '@material-ui/icons/GridOn'
import Place from '@material-ui/icons/Place'
import WidgetsIcon from '@material-ui/icons/Widgets'

const dashRoutes = [
  {
    path: '/app/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    component: () => <div></div>,
  },
  {
    collapse: true,
    path: '/app/components',
    name: 'Components',
    state: 'openComponents',
    icon: Apps,
    views: [
      {
        path: '/app/components/buttons',
        name: 'Buttons',
        mini: 'B',
        component: () => <div>Buttons</div>,
      },
      {
        path: '/app/components/grid-system',
        name: 'Grid System',
        mini: 'GS',
        component: () => <div>Grid System</div>,
      },
      {
        path: '/app/components/panels',
        name: 'Panels',
        mini: 'P',
        component: () => <div>Panels</div>,
      },
      {
        path: '/app/components/sweet-alert',
        name: 'Sweet Alert',
        mini: 'SA',
        component: () => <div>Sweet Alert</div>,
      },
      {
        path: '/app/components/notifications',
        name: 'Notifications',
        mini: 'N',
        component: () => <div>Notifications</div>,
      },
      {
        path: '/app/components/icons',
        name: 'Icons',
        mini: 'I',
        component: () => <div>Icons</div>,
      },
      {
        path: '/app/components/typography',
        name: 'Typography',
        mini: 'T',
        component: () => <div>Typography</div>,
      },
    ],
  },
  {
    collapse: true,
    path: '/app/forms',
    name: 'Forms',
    state: 'openForms',
    icon: GridOn,
    views: [
      {
        path: '/app/forms/regular-forms',
        name: 'Regular Forms',
        mini: 'RF',
        component: () => <div>openForms</div>,
      },
      {
        path: '/app/forms/extended-forms',
        name: 'Extended Forms',
        mini: 'EF',
        component: () => <div>Extended Forms</div>,
      },
      {
        path: '/app/forms/validation-forms',
        name: 'Validation Forms',
        mini: 'VF',
        component: () => <div>Validation Forms</div>,
      },
      {
        path: '/app/forms/wizard',
        name: 'Wizard',
        mini: 'W',
        component: () => <div>Wizard</div>,
      },
    ],
  },
  {
    collapse: true,
    path: '/app/tables',
    name: 'Tables',
    state: 'openTables',
    icon: GridOn,
    views: [
      {
        path: '/app/tables/regular-tables',
        name: 'Regular Tables',
        mini: 'RT',
        component: () => <div>Tables</div>,
      },
      {
        path: '/app/tables/extended-tables',
        name: 'Extended Tables',
        mini: 'ET',
        component: () => <div>Extended Tables</div>,
      },
      {
        path: '/app/tables/react-tables',
        name: 'React Tables',
        mini: 'RT',
        component: () => <div>React Tables</div>,
      },
    ],
  },
  {
    collapse: true,
    path: '/app/maps',
    name: 'Maps',
    state: 'openMaps',
    icon: Place,
    views: [
      {
        path: '/app/maps/google-maps',
        name: 'Google Maps',
        mini: 'GM',
        component: () => <div>openMaps</div>,
      },
      {
        path: '/app/maps/full-screen-maps',
        name: 'Full Screen Map',
        mini: 'FSM',
        component: () => <div>Full Screen Map</div>,
      },
      {
        path: '/app/maps/vector-maps',
        name: 'Vector Map',
        mini: 'VM',
        component: () => <div>Vector Map</div>,
      },
    ],
  },
  {
    path: '/app/widgets',
    name: 'Widgets',
    icon: WidgetsIcon,
    component: () => <div>Widgets</div>,
  },
]
export default dashRoutes
