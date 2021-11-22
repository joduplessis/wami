'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _apolloServerHapi = require('apollo-server-hapi');

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _helpers = require('./helpers');

var _plugins = require('./plugins');

var _PushNotification = require('./services/PushNotification');

var _PushNotification2 = _interopRequireDefault(_PushNotification);

var _onesignalNode = require('onesignal-node');

var _onesignalNode2 = _interopRequireDefault(_onesignalNode);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var good = require('good');
var sgMail = require('@sendgrid/mail');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var jwt = require('./helpers/jwt');
var config = require('config');
var moment = require('moment-timezone');
var mqtt = require('mqtt');
var configGood = config.get('Good');
var configMqtt = config.get('Mqtt');
var app = _hapi2.default.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
        cors: true
    }
});

// Create the dir if it doesn't exist
if (!fs.existsSync(_helpers.UPLOAD_PATH)) fs.mkdirSync(_helpers.UPLOAD_PATH);

// Amazon config
AWS.config.loadFromPath('./aws.json');

// SendGrid config
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var init = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var server, client;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _mongoose2.default.connect(process.env.MONGO_URI, {
                            useNewUrlParser: true
                        });

                        _context.next = 3;
                        return app.register([good, _plugins.AuthJwt, _plugins.AuthEmail]);

                    case 3:

                        app.auth.strategy('jwt', 'jwt');
                        app.auth.strategy('email', 'email');

                        (0, _helpers.initRoutes)(app);

                        server = new _apolloServerHapi.ApolloServer({
                            typeDefs: _helpers.typeDefs,
                            resolvers: _helpers.resolvers,
                            cache: false,
                            context: function context(_ref2) {
                                /*
                                // Check whether there is a token
                                if (!request.headers.authorization) {
                                    throw new AuthorizationError('Apollo: you must be logged in');
                                }
                                 if (!request.headers.authorization.split(' ')[1]) {
                                    throw new AuthorizationError('Apollo: you must be logged in');
                                }
                                 try {
                                    const { authorization } = request.headers;
                                    const token = authorization.split(' ')[1];
                                    const payload = jwt.decode(token, SECRET);
                                    const { sub, exp } = payload;
                                     // If it's expired
                                    if (exp < Date.now()/1000)  throw new AuthorizationError('Apollo: your token has expired');
                                     // add the user to the context
                                    return { user: sub };
                                 } catch (err) {
                                     console.log(err);
                                     throw new AuthorizationError('Apollo: general error');
                                }
                                */

                                var request = _ref2.request,
                                    h = _ref2.h;
                            }
                        });


                        server.applyMiddleware({ app: app });

                        _context.next = 10;
                        return app.start();

                    case 10:

                        // MQTT Initialization
                        client = mqtt.connect(process.env.MQTT_URI, {
                            clean: false,
                            queueQoSZero: true,
                            useSSL: false,
                            clientId: process.env.MQTT_CLIENT,
                            will: {
                                topic: 'death',
                                payload: 'me'
                            }
                        });


                        client.on('connect', function (e) {
                            console.log('Connected to MQTT broker at: ' + process.env.MQTT_URI);

                            // Always be available
                            global.mqtt = client;
                        });

                        client.on('disconnect', function (e) {
                            console.log('Disconnected MQTT connection', e);
                        });

                        client.on('close', function (e) {
                            console.log('Closed MQTT connection', e);
                        });

                        client.on('message', function (topic, data) {
                            var objectID = require('mongodb').ObjectID;

                            // If the client connection drops, then mark them as inactive
                            // So that they can receive push messages
                            if (topic == "death" && objectID.isValid(data.toString())) {
                                _models.UserModel.findOneAndUpdate({ _id: data.toString() }, { offline: true }).exec();
                            }
                        });

                        client.subscribe("death", { qos: 2 }, function (err) {
                            return console.log('Death subscription error: ', err);
                        });

                        console.log('Server running at: ' + app.info.uri);

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function init() {
        return _ref.apply(this, arguments);
    };
}();

process.on('unhandledRejection', function (err) {
    console.log(err);
    process.exit(1);
});

// Start the Hapi app
init();