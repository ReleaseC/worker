import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Task',
    icon: 'nb-list',
    link: '/pages/tasklist',
    home: true,
  },
  {
    title: '收益',
    icon: 'nb-sunny',
    link: '/pages/profit',
  },
  {
    title: '活动',
    icon: 'nb-volume-mute',
    link: '/pages/activity',
  },
  // {
  //   title: 'FileServer',
  //   icon: 'nb-shuffle',
  //   link: '/pages/fileServer',
  // },
  /*
  {
    title: 'Site',
    icon: 'nb-home',
    link: '/pages/site',
    children: [
      {
        title: 'Soccer',
        link: '/pages/site/site-soccer',
        children: [
          {
            title: 'Manage',
            link: '/pages/site/site-soccer/soccer-manage-site/',
          },
          {
            title: 'Query',
            link: '/pages/site/site-soccer/soccer-query-site/',
          },
          {
            title: 'Add',
            link: '/pages/site/site-soccer/soccer-add-site/',
          },
          {
            title: 'Match',
            link: '/pages/site/site-soccer/soccer-match-site/',
          },
        ],
      },
      {
        title: 'BulletTime',
        link: '/pages/site/site-bullettime',
        children: [
          {
            title: 'Manage',
            link: '/pages/site/site-bullettime/bullettime-manage-site/',
          },
        ],
      },
      {
        title: 'Basketball',
        link: '/pages/site/site-basketball',
        children: [
          {
            title: 'Manage',
            link: '/pages/site/site-basketball/basketball-manage-site/',
          },
        ],
      }
    ],
  },
  */
  {
    title: '数据统计',
    icon: 'nb-bar-chart',
    link: '/pages/data',
  },
  {
    title: '设备',
    icon: 'nb-audio',
    link: '/pages/device',
    children: [
      {
        title: '采集盒',
        link: '/pages/device/status',
      },
      {
        title: '显示盒',
        link: '/pages/fileServer',
      },
      {
        title: '测试',
        link: '/pages/test'
      }
    ],
  },
  {
    title: '客户',
    icon: 'nb-keypad',
    link: '/pages/customer',
  },
  {
    title: '报表',
    icon: 'nb-heart',
    link: '/pages/report',
  },
  /*
  {
    title: 'Soccer Task List',
    icon: 'nb-paper-plane',
    url: 'http://iva.siiva.com/nike-test/',
  },
  {
    title: 'Bullet Task Site',
    icon: 'nb-paper-plane',
    url: 'https://iva.siiva.com/bullet-task/',
  },
  */
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: '用户',
    icon: 'nb-paper-plane',
    children: [
      {
        title: '用户管理',
        link: '/pages/account/account-manage/',
        children: [
          {
            title: '全部',
            link: '/pages/account/account-manage/account-manage-userlists/',
          },
          {
            title: '添加',
            link: '/pages/account/account-manage/account-manage-register/',
          },
        ],
      },
      /*
      {
        title: 'Site Management',
        link: '/pages/site/site-management',
        children: [
          {
            title: 'Add new setting',
            link: '/pages/site/site-management/management-setting/',
          },
          {
            title: 'Update setting',
            link: '/pages/site/site-management/management-update/',
          },
          {
            title: 'Match setting',
            link: '/pages/site/site-management/management-match/',
          },
        ],
      },
      */
    ],
  },
  {
    title: '我的',
    icon: 'nb-locked',
    children: [
      {
        title: 'Logout',
        link: '/pages/auth/logout',
      },
      // {
      //   title: 'Register',
      //   link: '/auth/register',
      // },
      // {
      //   title: 'Request Password',
      //   link: '/auth/request-password',
      // },
      // {
      //   title: 'Reset Password',
      //   link: '/auth/reset-password',
      // },
    ],
  },
];
