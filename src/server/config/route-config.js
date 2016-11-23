(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const map = require('../routes/map');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/map', map);

  };

})(module.exports);
