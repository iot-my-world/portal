import React from 'react'
import LockIcon from '@material-ui/icons/Lock'
import PeopleIcon from '@material-ui/icons/People'
import PersonIcon from '@material-ui/icons/Person'
import DomainIcon from '@material-ui/icons/Domain'
import HomeIcon from '@material-ui/icons/Home'
import CompanyContainer from 'views/party/company/CompanyContainer'
import ClientContainer from 'views/party/client/ClientContainer'
import UserContainer from 'views/party/user/UserContainer'

const AppRoots = [
  // each array in this roots array  is a group which will
  // be separated by a divider

  [
    // each array contains root 'objects' or root 'objectGroup'
    // the difference is that objectGroups contain group: true

    { // this is an individual root
      text: 'Home',
      icon: <HomeIcon/>,
      path: '/app',
    },

    { // this is an individual root
      text: 'Logout',
      icon: <LockIcon/>,
      path: '/logout',
    },

    { // this is a root group
      group: true,
      text: 'Party',
      icon: <PeopleIcon/>,
      roots: [
        { // this is an individual root
          text: 'Company',
          icon: <DomainIcon/>,
          path: '/app/party/company',
          component: CompanyContainer,
        },
        {
          text: 'Client',
          icon: <PeopleIcon/>,
          path: '/app/party/client',
          component: ClientContainer,
        },
        {
          text: 'User',
          icon: <PersonIcon/>,
          path: '/app/party/user',
          component: UserContainer,
        },
      ],
    },
  ],

  // -------- divider here --------

  // [
  //   { // this is an individual root
  //     text: 'Client',
  //     icon: <PeopleIcon/>,
  //   },
  //
  //   { // this is a root group
  //     group: true,
  //     text: 'Party',
  //     icon: <PeopleIcon/>,
  //     roots: [
  //       { // this is an individual root
  //         text: 'Company',
  //         icon: <DomainIcon/>,
  //       },
  //       {
  //         text: 'Client',
  //         icon: <PeopleIcon/>,
  //       },
  //       {
  //         text: 'User',
  //         icon: <PersonIcon/>,
  //       },
  //     ],
  //   },
  // ],
]

export default AppRoots