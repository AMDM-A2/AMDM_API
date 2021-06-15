module.exports = {
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  },

  pwa: {
    name: 'Malaxage'
    /* iconPaths: {
      favicon32: 'img/favicon-32x32.png',
      favicon16: 'img/favicon-32x32.png',
      appleTouchIcon: 'img/apple-touch-icon-152x152.png',
      msTileImage: 'img/msapplication-icon-144x144.png'
    } */
  },

  transpileDependencies: [
    'vuetify'
  ]
}
