define({ "api": [
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/DISCONNECT",
    "title": "(Client -> Server) Soccer socket event DISCONNECT",
    "version": "1.1.0",
    "name": "DISCONNECT",
    "group": "SOCCER_EVENT",
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/EVENT_HEARTBEAT",
    "title": "(Client -> Server) Soccer socket event EVENT_HEARTBEAT",
    "version": "1.1.0",
    "name": "EVENT_HEARTBEAT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/EVENT_REMOTE_SHOT",
    "title": "(Client -> Server) Soccer socket event EVENT_REMOTE_SHOT",
    "version": "1.1.0",
    "name": "EVENT_REMOTE_SHOT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/EVENT_REMOTE_SHOT_GETDEVICES",
    "title": "(Client -> Server) Soccer socket event EVENT_REMOTE_SHOT_GETDEVICES",
    "version": "1.1.0",
    "name": "EVENT_REMOTE_SHOT_GETDEVICES",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/EVENT_REMOTE_SHOT_GET_PICS",
    "title": "(Client -> Server) Soccer socket event EVENT_REMOTE_SHOT_GET_PICS",
    "version": "1.1.0",
    "name": "EVENT_REMOTE_SHOT_GET_PICS",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/EVENT_SOCCER_CMD",
    "title": "(Client -> Server) Soccer socket event EVENT_SOCCER_CMD",
    "version": "1.1.0",
    "name": "EVENT_SOCCER_CMD",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/GOAL_EVENT",
    "title": "(Client -> Server) Soccer socket event GOAL_EVENT",
    "version": "1.1.0",
    "name": "GOAL_EVENT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/SINGLE_VIDEO_UPLOADED_EVENT",
    "title": "(Client -> Server) Soccer socket event SINGLE_VIDEO_UPLOADED_EVENT",
    "version": "1.1.0",
    "name": "SINGLE_VIDEO_UPLOADED_EVENT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/SITES_CONFIG_EVENT",
    "title": "(Client -> Server) Soccer socket event SITES_CONFIG_EVENT",
    "version": "1.1.0",
    "name": "SITES_CONFIG_EVENT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/SITES_MATCH_EVENT",
    "title": "(Client -> Server) Soccer socket event SITES_MATCH_EVENT",
    "version": "1.1.0",
    "name": "SITES_MATCH_EVENT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>Client account: data.role</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.deviceId",
            "description": "<p>Client password: data.deviceId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.camera",
            "description": "<p>Client camera: data.camera</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "socket",
    "url": "/SOCCER_EVENT/SITES_UNMATCH_EVENT",
    "title": "(Client -> Server) Soccer socket event SITES_UNMATCH_EVENT",
    "version": "1.1.0",
    "name": "SITES_UNMATCH_EVENT",
    "group": "SOCCER_EVENT",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.deviceId",
            "description": "<p>Client deviceId: data.deviceId</p>"
          }
        ]
      }
    },
    "filename": "src/activity/soccer.service.ts",
    "groupTitle": "SOCCER_EVENT"
  },
  {
    "type": "get",
    "url": "/account/v2/account_delete",
    "title": "Make account to inactive",
    "version": "1.1.0",
    "name": "account_delete",
    "group": "account_v2_",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>&quot;No accounts&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "get",
    "url": "/account/v2/account_getInfo",
    "title": "Get account info",
    "version": "1.1.0",
    "name": "account_getInfo",
    "group": "account_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accesstoken",
            "description": "<p>user accesstoken</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>&quot;No accounts&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "get",
    "url": "/account/v2/account_getlists",
    "title": "Get account list",
    "version": "1.1.0",
    "name": "account_getlists",
    "group": "account_v2_",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>&quot;No accounts&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "post",
    "url": "/account/v2/account_matchSites",
    "title": "Match account with siteId",
    "version": "1.1.0",
    "name": "account_matchSites",
    "group": "account_v2_",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return &quot;Update matchSites successful&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "post",
    "url": "/account/v2/account_register",
    "title": "Create cloud admin account",
    "version": "1.1.0",
    "name": "account_register",
    "group": "account_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>register data object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.account",
            "description": "<p>user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.password",
            "description": "<p>user password</p>"
          },
          {
            "group": "Parameter",
            "type": "Enum",
            "optional": false,
            "field": "data.role",
            "description": "<p>user role</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.desc",
            "description": "<p>user description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return &quot;register success&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "get",
    "url": "/account/v2/getSites",
    "title": "Get siteId and siteName by accessToken",
    "version": "1.1.0",
    "name": "getSites",
    "group": "account_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>user account (BT/Soccor/Basketball)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>user access_token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "siteNameArr",
            "description": "<p>return siteName Array</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account_v2_"
  },
  {
    "type": "post",
    "url": "/account/add_user",
    "title": "Add user account into cloud database",
    "version": "1.1.0",
    "name": "add_user",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return &quot;add_user save success&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "post",
    "url": "/account/add_user",
    "title": "Add user account into cloud database",
    "version": "1.0.0",
    "name": "add_user",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "account",
            "optional": false,
            "field": "user",
            "description": "<p>account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ret.code",
            "optional": false,
            "field": "return",
            "description": "<ol start=\"0\"> <li></li> </ol>"
          }
        ]
      }
    },
    "filename": "src/account/_apidoc.js",
    "groupTitle": "account"
  },
  {
    "type": "get",
    "url": "/account/get_soccer_account",
    "title": "Get soccer account list",
    "version": "1.0.0",
    "name": "get_soccer_account",
    "group": "account",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>return Accounts</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "get",
    "url": "/account/get_account_list",
    "title": "Get account list",
    "version": "1.1.0",
    "name": "get_user_list",
    "group": "account",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>&quot;No accounts&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "post",
    "url": "/account/login",
    "title": "Confirm Cloud/admin login",
    "version": "1.1.0",
    "name": "login",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>Login account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Login password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "expires_in",
            "description": "<p>expire time of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>access token of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": false,
            "field": "error",
            "description": "<p>Show error INTERNAL_SERVER_ERROR</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "post",
    "url": "/account/login",
    "title": "Confirm Cloud/admin login",
    "version": "1.0.0",
    "name": "login",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Login name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": "<p>Login password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "expires_in",
            "description": "<p>expire time of the user.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "access_token",
            "description": "<p>access token of the user.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "Object",
            "optional": true,
            "field": "error",
            "description": "<p>Show error INTERNAL_SERVER_ERROR</p>"
          }
        ]
      }
    },
    "filename": "src/account/_apidoc.js",
    "groupTitle": "account"
  },
  {
    "type": "get",
    "url": "/account/logout",
    "title": "Confirm Cloud/admin logout",
    "version": "1.1.0",
    "name": "logout",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>User accessToken</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "string",
            "description": "<p>return &quot;Logout successful&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "post",
    "url": "/account/soccerLogin",
    "title": "Mobile login soccer accont",
    "version": "1.0.0",
    "name": "soccerLogin",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "account",
            "description": "<p>user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>user password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>deviceId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>return accessToken</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "get",
    "url": "/account/soccerLogout",
    "title": "Mobile logout soccer accont",
    "version": "1.0.0",
    "name": "soccerLogout",
    "group": "account",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "accessToken",
            "description": "<p>user accessToken</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "string",
            "description": "<p>return &quot;Soccer logout&quot;</p>"
          }
        ]
      }
    },
    "filename": "src/account/account.controller.ts",
    "groupTitle": "account"
  },
  {
    "type": "get",
    "url": "/datareport/download_file",
    "title": "Download data report (Construction)",
    "version": "1.2.0",
    "name": "download_file",
    "group": "datareport",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>return client.MakeAuth()</p>"
          }
        ]
      }
    },
    "filename": "src/datareport/datareport.controller.ts",
    "groupTitle": "datareport"
  },
  {
    "type": "get",
    "url": "/datareport/get_data",
    "title": "Get data report",
    "version": "1.1.0",
    "name": "get_data",
    "group": "datareport",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          }
        ]
      }
    },
    "filename": "src/datareport/datareport.controller.ts",
    "groupTitle": "datareport"
  },
  {
    "type": "get",
    "url": "/datareport/import_data",
    "title": "Import data report (Construction)",
    "version": "1.2.0",
    "name": "import_data",
    "group": "datareport",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "filename": "src/datareport/datareport.controller.ts",
    "groupTitle": "datareport"
  },
  {
    "type": "post",
    "url": "/datareport/point_page",
    "title": "Create/update data report",
    "version": "1.1.0",
    "name": "point_page",
    "group": "datareport",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.mode",
            "description": "<p>Client mode: data.mode (play, like, share, download, ...)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/datareport/datareport.controller.ts",
    "groupTitle": "datareport"
  },
  {
    "type": "post",
    "url": "/device/add_device",
    "title": "Add devices lists (Construction)",
    "version": "1.2.0",
    "name": "add_device",
    "group": "device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>no use</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return device lists</p>"
          }
        ]
      }
    },
    "filename": "src/device/device.controller.ts",
    "groupTitle": "device"
  },
  {
    "type": "get",
    "url": "/device/get_device_list",
    "title": "Get devices lists (Construction)",
    "version": "1.2.0",
    "name": "get_device_list",
    "group": "device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "type",
            "description": "<p>no use</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return device lists</p>"
          }
        ]
      }
    },
    "filename": "src/device/device.controller.ts",
    "groupTitle": "device"
  },
  {
    "type": "get",
    "url": "/device/get_device_status",
    "title": "Get devices status",
    "version": "1.1.0",
    "name": "get_device_status",
    "group": "device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>Site ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return account lists</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/device/device.controller.ts",
    "groupTitle": "device"
  },
  {
    "type": "post",
    "url": "/edgeadmin/adjust_data",
    "title": "adjust_data (Obsolete)",
    "version": "1.0.0",
    "name": "adjust_data",
    "group": "edgeadmin",
    "filename": "src/edgeadmin/edgeadmin.controller.ts",
    "groupTitle": "edgeadmin"
  },
  {
    "type": "get",
    "url": "/notification/alert",
    "title": "alert (Obsolete)",
    "version": "1.0.0",
    "name": "alert",
    "group": "notification",
    "filename": "src/notification/notification.controller.ts",
    "groupTitle": "notification"
  },
  {
    "type": "get",
    "url": "/notification/get_test",
    "title": "get_test (Obsolete)",
    "version": "1.0.0",
    "name": "get_test",
    "group": "record",
    "filename": "src/record/record.controller.ts",
    "groupTitle": "record"
  },
  {
    "type": "get",
    "url": "/notification/post_test",
    "title": "post_test (Obsolete)",
    "version": "1.0.0",
    "name": "post_test",
    "group": "record",
    "filename": "src/record/record.controller.ts",
    "groupTitle": "record"
  },
  {
    "type": "get",
    "url": "/notification/start_record",
    "title": "start_record (Obsolete)",
    "version": "1.0.0",
    "name": "start_record",
    "group": "record",
    "filename": "src/record/record.controller.ts",
    "groupTitle": "record"
  },
  {
    "type": "get",
    "url": "/site/v2/bind",
    "title": "Binding device on site setting DeviceConfig",
    "version": "1.1.0",
    "name": "bind",
    "group": "site_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "access_token",
            "description": "<p>Client assess_token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>Client siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Client type (SOCCOR/BASKETBALL)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deviceId",
            "description": "<p>Client deviceId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Client role (admin/GoalCam/VideoCam)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "position",
            "description": "<p>Client position (0/1/2)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site_v2_"
  },
  {
    "type": "get",
    "url": "/site/v2/get_site_setting",
    "title": "Get all site setting by type",
    "version": "1.1.0",
    "name": "get_site_setting",
    "group": "site_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query",
            "description": "<p>Client data type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return specific site details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site_v2_"
  },
  {
    "type": "post",
    "url": "/site/v2/get_site_setting_info",
    "title": "Get site setting by siteId",
    "version": "1.1.0",
    "name": "get_site_setting_info",
    "group": "site_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Client object body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.type",
            "description": "<p>Client data type: body.type(SOCCOR/BT/BASKETBALL)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.siteId",
            "description": "<p>user siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.accesstoken",
            "description": "<p>user accesstoken</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return specific site details</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site_v2_"
  },
  {
    "type": "post",
    "url": "/site/v2/post_site_setting",
    "title": "Create site setting by type",
    "version": "1.1.0",
    "name": "post_site_setting",
    "group": "site_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Client object body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.type",
            "description": "<p>Client data type: body.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site_v2_"
  },
  {
    "type": "post",
    "url": "/site/v2/update_site_setting",
    "title": "Update site setting by type",
    "version": "1.1.0",
    "name": "update_site_setting",
    "group": "site_v2_",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Client object body</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.type",
            "description": "<p>Client data type: body.type(soccer/bt/basketball)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site_v2_"
  },
  {
    "type": "post",
    "url": "/site/add_CameraSetting",
    "title": "Add new camera setting",
    "version": "1.1.0",
    "name": "add_CameraSetting",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.commonset",
            "description": "<p>Client camera set: data.commonset</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/add_account_match_sites",
    "title": "Add new account_match_sites setting (Obsolete)",
    "version": "1.0.0",
    "name": "add_account_match_sites",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.account",
            "description": "<p>Client account: data.account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/add_site",
    "title": "Create site setting",
    "version": "1.1.0",
    "name": "add_site",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>error description</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/add_template",
    "title": "",
    "version": "1.1.0",
    "name": "add_template",
    "group": "site",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/change_DeviceConfig",
    "title": "Update new device config in specific site",
    "version": "1.1.0",
    "name": "change_DeviceConfig",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data.deviceConfig",
            "description": "<p>Client deviceConfig: data.deviceConfig</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "get",
    "url": "/site/get_CameraSetting",
    "title": "Get camera setting",
    "version": "1.1.0",
    "name": "get_CameraSetting",
    "group": "site",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "get",
    "url": "/site/get_account_match_sites",
    "title": "Get all account_match_sites details (Obsolete)",
    "version": "1.0.0",
    "name": "get_account_match_sites",
    "group": "site",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "get",
    "url": "/site/get_binding_table",
    "title": "Get all binding tables details (Obsolete)",
    "version": "1.0.0",
    "name": "get_binding_table",
    "group": "site",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/get_site_detail",
    "title": "Get site details",
    "version": "1.1.0",
    "name": "get_site_detail",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return specific site details</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/get_site_lists",
    "title": "Get all soccer site details (Obsolete)",
    "version": "1.0.0",
    "name": "get_site_lists",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.account",
            "description": "<p>Client account: data.account</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>return array of all site details</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/get_site_names",
    "title": "Get all site names",
    "version": "1.1.0",
    "name": "get_site_names",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>return site settings</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "get",
    "url": "/site/get_template",
    "title": "",
    "version": "1.1.0",
    "name": "get_template",
    "group": "site",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/set_binding_table",
    "title": "Set a new binding table (Obsolete)",
    "version": "1.0.0",
    "name": "set_binding_table",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.deviceId",
            "description": "<p>Client device id: data.deviceId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>Client device role: data.role</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "post",
    "url": "/site/update_site",
    "title": "Update specific site details",
    "version": "1.1.0",
    "name": "update_site",
    "group": "site",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/site/site.controller.ts",
    "groupTitle": "site"
  },
  {
    "type": "get",
    "url": "/system/edgeversion",
    "title": "Return edge version",
    "version": "1.1.0",
    "name": "edgeversion",
    "group": "system",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "edgeadmin",
            "optional": false,
            "field": "edgemin",
            "description": "<p>version</p>"
          },
          {
            "group": "Success 200",
            "type": "edgeserver",
            "optional": false,
            "field": "edgeserver",
            "description": "<p>version</p>"
          },
          {
            "group": "Success 200",
            "type": "time",
            "optional": false,
            "field": "time",
            "description": ""
          }
        ]
      }
    },
    "filename": "src/system/system.controller.ts",
    "groupTitle": "system"
  },
  {
    "type": "post",
    "url": "/system/get_apk_version",
    "title": "Get newest soccer apk version (Obsolete)",
    "version": "1.0.0",
    "name": "get_apk_version",
    "group": "system",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "type",
            "optional": false,
            "field": "type",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "subType",
            "optional": false,
            "field": "subType",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ret",
            "optional": false,
            "field": "apk",
            "description": "<p>version</p>"
          }
        ]
      }
    },
    "filename": "src/system/system.controller.ts",
    "groupTitle": "system"
  },
  {
    "type": "get",
    "url": "/system/get_apk_version_from_db",
    "title": "Get all device's apk version (Obsolete)",
    "version": "1.0.0",
    "name": "get_apk_version_from_db",
    "group": "system",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>device's apk version</p>"
          }
        ]
      }
    },
    "filename": "src/system/system.controller.ts",
    "groupTitle": "system"
  },
  {
    "type": "post",
    "url": "/system/save_apk_version",
    "title": "Update specific device soccer apk version (Obsolete)",
    "version": "1.0.0",
    "name": "save_apk_version",
    "group": "system",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.siteId",
            "description": "<p>Client siteId: data.siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.deviceId",
            "description": "<p>Client deviceId: data.deviceId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.role",
            "description": "<p>Client role: data.role</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.apkVersion",
            "description": "<p>Specific device's apkVersion: data.siteId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/system/system.controller.ts",
    "groupTitle": "system"
  },
  {
    "type": "get",
    "url": "/system/version",
    "title": "Return version and name",
    "version": "1.1.0",
    "name": "version",
    "group": "system",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "version",
            "optional": false,
            "field": "version",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "name",
            "optional": false,
            "field": "name",
            "description": ""
          }
        ]
      }
    },
    "filename": "src/system/system.controller.ts",
    "groupTitle": "system"
  },
  {
    "type": "post",
    "url": "/task/effect_task_finish",
    "title": "Update effect task state to finish",
    "version": "1.1.0",
    "name": "effect_task_finish",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.msg",
            "description": "<p>Client messenge: data.msg</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return task</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "get",
    "url": "/task/effect_task_get",
    "title": "Get single effect task",
    "version": "1.1.0",
    "name": "effect_task_get",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": "<p>Client object query</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return task</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/get_bt_single_task_status",
    "title": "",
    "version": "1.1.0",
    "name": "get_bt_single_task_status",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.taskId",
            "description": "<p>Client taskId: data.taskId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.userId",
            "description": "<p>Client userId: data.userId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.state",
            "description": "<p>Client state: data.state</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/get_task_file_lists",
    "title": "Get all soccer task videos in ucloud (Obsolete)",
    "version": "1.0.0",
    "name": "get_task_file_lists",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.taskId",
            "description": "<p>Client taskId: data.taskId</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/task_abort",
    "title": "Abort specific task",
    "version": "1.1.0",
    "name": "task_abort",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.msg",
            "description": "<p>Client messenge: data.msg</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return task</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/task_cancel",
    "title": "Update task state to cancel",
    "version": "1.1.0",
    "name": "task_cancel",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.taskId",
            "description": "<p>Client taskId: data.taskId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.msg",
            "description": "<p>Client messenge: data.msg</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/task_create",
    "title": "Create new task",
    "version": "1.1.0",
    "name": "task_create",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/task_finish",
    "title": "",
    "version": "1.1.0",
    "name": "task_finish",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return task</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "get",
    "url": "/task/task_get",
    "title": "Get single task",
    "version": "1.1.0",
    "name": "task_get",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": "<p>Client object query</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return task</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "get",
    "url": "/task/task_list_get",
    "title": "",
    "version": "1.1.0",
    "name": "task_list_get",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": "<p>Client object query</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return tasklists</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/task/task_update",
    "title": "Update task state",
    "version": "1.1.0",
    "name": "task_update",
    "group": "task",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data.type",
            "description": "<p>Client data type: data.type(soccer/bt)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return specific site details</p>"
          }
        ]
      }
    },
    "filename": "src/task/task.controller.ts",
    "groupTitle": "task"
  },
  {
    "type": "post",
    "url": "/users/add_user",
    "title": "Add user",
    "version": "1.1.0",
    "name": "add_user",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game_id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "wechat",
            "description": "<p>User wechat</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/auto_push",
    "title": "Auto push",
    "version": "1.0.0",
    "name": "auto_push",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/auto_push",
    "title": "Auto update",
    "version": "1.1.0",
    "name": "auto_update",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_time",
            "description": "<p>User gametime</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/find",
    "title": "Find user",
    "version": "1.1.0",
    "name": "find",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "post",
    "url": "/users/get_users",
    "title": "Get user",
    "version": "1.1.0",
    "name": "get_users",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game_id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "wechat",
            "description": "<p>User wechat</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return users</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/get_video",
    "title": "Get video",
    "version": "1.1.0",
    "name": "get_video",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "ret.description",
            "description": "<p>return description</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/give_like",
    "title": "Give like",
    "version": "1.1.0",
    "name": "give_like",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game_id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/user_test",
    "title": "User test",
    "version": "1.1.0",
    "name": "give_like",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>User game_id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "get",
    "url": "/users/is_reservate",
    "title": "Check is reservate",
    "version": "1.1.0",
    "name": "is_reservate",
    "group": "users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>User code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>User state</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/users/users.controller.ts",
    "groupTitle": "users"
  },
  {
    "type": "post",
    "url": "/wechat_payment/create_wechatpay",
    "title": "",
    "name": "create_wechatpay",
    "group": "wechat_payment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "data",
            "optional": false,
            "field": "sidatateId",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/wechat_payment/wechat_payment.controller.ts",
    "groupTitle": "wechat_payment"
  },
  {
    "type": "get",
    "url": "/wechat_payment/get_order_list",
    "title": "",
    "name": "get_order_list",
    "group": "wechat_payment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "siteId",
            "optional": false,
            "field": "siteId",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/wechat_payment/wechat_payment.controller.ts",
    "groupTitle": "wechat_payment"
  },
  {
    "type": "get",
    "url": "/wechat_payment/get_users_order",
    "title": "",
    "name": "get_users_order",
    "group": "wechat_payment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "siteId",
            "optional": false,
            "field": "siteId",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "openid",
            "optional": false,
            "field": "openid",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "taskId",
            "optional": false,
            "field": "taskId",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/wechat_payment/wechat_payment.controller.ts",
    "groupTitle": "wechat_payment"
  },
  {
    "type": "post",
    "url": "/wechat_payment/is_pay",
    "title": "",
    "name": "is_pay",
    "group": "wechat_payment",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "data",
            "optional": false,
            "field": "sidatateId",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/wechat_payment/wechat_payment.controller.ts",
    "groupTitle": "wechat_payment"
  },
  {
    "type": "get",
    "url": "/wechat/auto_push",
    "title": "",
    "version": "1.1.0",
    "name": "auto_push",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>siteId</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "post",
    "url": "/wechat/create_number",
    "title": "",
    "version": "1.1.0",
    "name": "create_number",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>data</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/create_qrcode",
    "title": "",
    "version": "1.1.0",
    "name": "create_qrcode",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>siteId</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/deleteVideo",
    "title": "",
    "version": "1.1.0",
    "name": "deleteVideo",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "videoname",
            "description": "<p>videoname</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/downloadVideo",
    "title": "",
    "version": "1.1.0",
    "name": "downloadVideo",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "videoname",
            "description": "<p>videoname</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_code",
    "title": "",
    "version": "1.1.0",
    "name": "get_code",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_data",
    "title": "",
    "version": "1.1.0",
    "name": "get_data",
    "group": "wechat",
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_jsapi_ticket",
    "title": "",
    "version": "1.1.0",
    "name": "get_jsapi_ticket",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>siteId</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_like",
    "title": "",
    "version": "1.1.0",
    "name": "get_like",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>data</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_siteId",
    "title": "",
    "version": "1.1.0",
    "name": "get_siteId",
    "group": "wechat",
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_token",
    "title": "",
    "version": "1.1.0",
    "name": "get_token",
    "group": "wechat",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_video_name",
    "title": "",
    "version": "1.1.0",
    "name": "get_video_name",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>siteId</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "openid",
            "description": "<p>openid</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_videos",
    "title": "",
    "version": "1.1.0",
    "name": "get_videos",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/get_wechatuser",
    "title": "",
    "version": "1.1.0",
    "name": "get_wechatuser",
    "group": "wechat",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/is_user",
    "title": "",
    "version": "1.1.0",
    "name": "is_user",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/test",
    "title": "",
    "version": "1.1.0",
    "name": "test",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "post",
    "url": "/wechat/video_name",
    "title": "",
    "version": "1.1.0",
    "name": "video_name",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "data",
            "description": "<p>data</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/web_login",
    "title": "",
    "version": "1.1.0",
    "name": "web_login",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/wechatApplogin",
    "title": "",
    "version": "1.1.0",
    "name": "wechatApplogin",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "siteId",
            "description": "<p>siteId</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/wechatapp",
    "title": "",
    "version": "1.1.0",
    "name": "wechatapp",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p>signature</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "echostr",
            "description": "<p>echostr</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nonce",
            "description": "<p>nonce</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/wpp_get_code",
    "title": "",
    "version": "1.1.0",
    "name": "wpp_get_code",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>code</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "state",
            "description": "<p>state</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret.result",
            "description": "<p>return result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Error 4xx",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 1</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "post",
    "url": "/wechat/wpp_get_tickets",
    "title": "",
    "version": "1.1.0",
    "name": "wpp_get_tickets",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>Client object data</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "ret",
            "description": "<p>Return object</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ret.code",
            "description": "<p>return 0</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  },
  {
    "type": "get",
    "url": "/wechat/wx",
    "title": "",
    "version": "1.1.0",
    "name": "wx",
    "group": "wechat",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "signature",
            "description": "<p>signature</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "echostr",
            "description": "<p>echostr</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nonce",
            "description": "<p>nonce</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "echostr",
            "description": "<p>return echostr</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "string",
            "description": "<p>return string</p>"
          }
        ]
      }
    },
    "filename": "src/wechat/wechat.controller.ts",
    "groupTitle": "wechat"
  }
] });
