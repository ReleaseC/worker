/**
   * @api {post} /account/login Confirm Cloud/admin login
   * @apiVersion 1.0.0
   * @apiName login 
   * @apiGroup account
   *
   * @apiParam {String} [name] Login name
   * @apiParam {String} [password] Login password
   *
   * @apiSuccess {String} [expires_in]  expire time of the user.
   * @apiSuccess {String} [access_token] access token of the user.
   *
   * @apiError (500) {Object} [error] Show error INTERNAL_SERVER_ERROR
   * 
  */

  /**
   * @api {post} /account/add_user Add user account into cloud database
   * @apiVersion 1.0.0
   * @apiName add_user
   * @apiGroup account
   *
   * @apiParam {account} user account
   * @apiParam {password} user password
   * @apiParam {group} user group
   * @apiParam {siteId} user siteId
   *
   * @apiSuccess {ret.code} return 0.
   * @apiSuccess {ret.description} return "add_user save success".
   * 
   */