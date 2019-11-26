module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
  
      // First application
      {
        name      : 'cloud_worker',
        script    : './index.js',
        env: {
          NODE_ENV: 'develop'
        },
        env_production : {
          NODE_ENV: 'production'
        }
    },

    // Second application
    //{
    //  name      : 'WEB',
    //  script    : 'web.js'
    //}
  ]
};
