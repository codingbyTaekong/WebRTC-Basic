/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io */ "socket.io");
/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var wrtc__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wrtc */ "wrtc");
/* harmony import */ var wrtc__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(wrtc__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! process */ "process");
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(process__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _socket_io_cluster_adapter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @socket.io/cluster-adapter */ "@socket.io/cluster-adapter");
/* harmony import */ var _socket_io_cluster_adapter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_socket_io_cluster_adapter__WEBPACK_IMPORTED_MODULE_5__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


 // ????????????
// import  {Socket}  from "socket.io";
// admin ui??? ????????? ???






var _require = __webpack_require__(/*! @socket.io/sticky */ "@socket.io/sticky"),
    setupWorker = _require.setupWorker;

var port = 3001;
var app = express__WEBPACK_IMPORTED_MODULE_1___default()();
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");
app.use('/public', express__WEBPACK_IMPORTED_MODULE_1___default()["static"](__dirname + "/public"));
app.get('/', function (req, res) {
  return res.render('home');
});
app.get('/*', function (req, res) {
  return res.redirect('/');
}); // app.listen(3000, handleListen);
//http ??? ws ????????? ?????? ???????????? ?????? ??????

var httpServer = (0,http__WEBPACK_IMPORTED_MODULE_0__.createServer)();
var io = new socket_io__WEBPACK_IMPORTED_MODULE_2__.Socket(httpServer);
io.adapter((0,_socket_io_cluster_adapter__WEBPACK_IMPORTED_MODULE_5__.createAdapter)());
setupWorker(io);
var roomName = "bigchoi";

function publicRooms() {
  // const {sids, rooms} = io.sockets.adapter
  // const socketIds = sids;
  // const rooms = rooms;
  var _io$sockets$adapter = io.sockets.adapter,
      sids = _io$sockets$adapter.sids,
      rooms = _io$sockets$adapter.rooms;
  var publicRooms = [];
  rooms.forEach(function (value, key) {
    sids.get(key) === undefined ? publicRooms.push(key) : null;
  });
  console.log('sids::::::', sids);
  return publicRooms;
}

function countRoom(roomName) {
  var _io$sockets$adapter$r;

  return (_io$sockets$adapter$r = io.sockets.adapter.rooms.get(roomName)) === null || _io$sockets$adapter$r === void 0 ? void 0 : _io$sockets$adapter$r.size;
}

function getListOfSocketsInRoom(roomName) {
  return io.sockets.adapter.rooms.get(roomName);
}

function handleTrackEvent(e, peer) {
  senderStream = e.streams[0];
}

; // ????????? ????????? P2P??? ???????????? RTC objects

var users = new Map(); // const 
// ?????? ????????? ???????????? ???????????? ?????? ????????? ???????????? RTC???????????? ????????????.
// ?????? ????????? offer??? ????????????, ??????????????? ????????? ????????????????????? ?????? ?????? - ????????????????????? RTC???????????? ??????????????? ?????????
// ????????? ????????? ????????? ?????? ????????????
// ??? id?????? (?????? ?????? - ????????????????????? RTC?????????)??? value??? ????????? ?????????????????? ???
// ????????? ?????? ????????? 1:1??? ???????????? ?????? object??? ?????? ?????? ??????????????? ???????????? ????????? object??? ?????? ??? ??????????????? ??????

var connectionsExceptMe = new Map();
var iceConfig = {
  iceServers: [{
    urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"]
  }]
};
io.on("connection", function (socket) {
  socket.emit('mySocketID', socket.id);
  socket.join('bigchoi');
  socket.on('join_room', /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
      var newConnection, desc, answer, otherUsers, _iterator, _step, _step$value, key, value, otherUser;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              // ????????? ????????? ???????????? ???????????? ????????????, 
              newConnection = new (wrtc__WEBPACK_IMPORTED_MODULE_3___default().RTCPeerConnection)(iceConfig); // user map??? ?????? ????????? ???????????? ????????????.

              users.set(socket.id, {
                conn: newConnection,
                nickname: data.nickname
              }); // ????????? ????????? ??????

              newConnection.ontrack = /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          users.get(socket.id).stream = e.streams[0]; // await newConnection.addTrack()

                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }(); // ????????? ???????


              desc = new (wrtc__WEBPACK_IMPORTED_MODULE_3___default().RTCSessionDescription)(data.sdp); // ?????? offer??? setRemoteDescription??? ????????????.(??????????????????..)

              _context2.next = 7;
              return newConnection.setRemoteDescription(desc);

            case 7:
              _context2.next = 9;
              return newConnection.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
              });

            case 9:
              answer = _context2.sent;
              _context2.next = 12;
              return newConnection.setLocalDescription(answer);

            case 12:
              // console.log(users.get(socket.id))
              newConnection.addEventListener('connectionstatechange', function (e) {
                // console.log(e.connectionState)
                if (newConnection.connectionState === "connected") {
                  console.log("?????????????????????!");
                }
              });
              newConnection.addEventListener('icecandidate', function (e) {
                // console.log("icecandidate???????????? ?????????????????????.")
                if (e.candidate) {
                  socket.emit('returnIce', e.candidate);
                }
              });
              socket.emit('payload', answer); // socket.to(roomName).emit("welcome", nickname)
              // ?????? ?????? ?????? ????????? ??????

              otherUsers = [];
              _iterator = _createForOfIteratorHelper(users);

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], value = _step$value[1];
                  console.log(socket.id, key);

                  if (socket.id !== key) {
                    otherUser = {
                      id: key,
                      nickname: value.nickname
                    };
                    otherUsers.push(otherUser);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              if (otherUsers.length > 0) {
                console.log('?????? ?????????', otherUsers.length); // ??? ???????????? ?????? ?????? ?????? ????????? ???????????? ????????????.

                socket.emit('otherUsers', otherUsers);
              }

              try {
                // ?????? ?????? ?????? ??????????????? ?????? ??????????????? ????????????.(?????? ??????????????? ???????????????)
                socket.broadcast.to('bigchoi').emit('newClient', {
                  id: socket.id,
                  nickname: data.nickname
                });
              } catch (error) {// console.log("??? ??? ????????????")
              }

              _context2.next = 25;
              break;

            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 22]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()); // ?????????????????? 1:1 ???????????? ????????? ice ?????????

  socket.on('ice', /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ice, roomName) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              if (!users.has(socket.id)) {
                _context3.next = 5;
                break;
              }

              _context3.next = 4;
              return users.get(socket.id).conn.addIceCandidate(ice);

            case 4:
              console.log("iceCandidate??? add????????????.");

            case 5:
              _context3.next = 9;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 7]]);
    }));

    return function (_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }()); // ????????? ????????? ???????????? ?????? ??????????????? ????????? ????????? ???????????? ????????????
  // ?????? ????????? ??????????????????.

  socket.on('otherUserOffer', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
      var newConnection, connections, answer;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // return console.log(data)
              // ????????? offer(?????? ?????? ?????? ??????)??? ????????? ????????? ???????????? ?????????
              newConnection = new (wrtc__WEBPACK_IMPORTED_MODULE_3___default().RTCPeerConnection)(iceConfig);
              users.get(data.mySocketID).stream.getTracks().forEach(function (track) {
                newConnection.addTrack(track, users.get(data.mySocketID).stream);
              }); // ??????????????? ????????????.

              if (connectionsExceptMe.has(data.mySocketID)) {
                // ????????? ?????????
                connections = connectionsExceptMe.get(data.mySocketID).connections;
                console.log(connections);
                connections.map(function (obj) {
                  return obj.id !== data.id ? connections.push({
                    id: data.id,
                    conn: newConnection
                  }) : null;
                });
              } else {
                // ????????? conntions ????????? ???????????? ????????????.
                connectionsExceptMe.set(data.mySocketID, {
                  connections: [{
                    id: data.id,
                    conn: newConnection
                  }]
                });
              }

              newConnection.addEventListener('icecandidate', function (e) {
                // ????????? ????????? ???????????? ???????????? icecandidate?????????
                if (e.candidate) {
                  console.log('????????? ????????? ???????????? ???????????? icecandidate????????? ??????!');
                  io.to(data.mySocketID).emit('newClientIce', {
                    mySocketID: data.mySocketID,
                    id: data.id,
                    candidate: e.candidate
                  });
                }
              });
              newConnection.addEventListener('connectionstatechange', function (e) {
                // console.log(e.connectionState)
                if (newConnection.connectionState === "connected") {
                  console.log("".concat(data.id, "\uC640 \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4!"));
                }
              }); // return console.log(connectionsExceptMe.get(data.mySocketID).connections)
              // const desc = await new wrtc.RTCSessionDescription(data.offer);
              // return console.log(data.offer);

              _context4.next = 7;
              return newConnection.setRemoteDescription(data.offer);

            case 7:
              _context4.next = 9;
              return newConnection.createAnswer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false
              });

            case 9:
              answer = _context4.sent;
              _context4.next = 12;
              return newConnection.setLocalDescription(answer);

            case 12:
              console.log(data.mySocketID);
              io.to(data.mySocketID).emit('newClientAnswer', {
                mySocketID: data.mySocketID,
                id: data.id,
                answer: answer
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }());
  socket.on('otherUsersIce', function (data) {
    var connections = connectionsExceptMe.get(data.mySocketID).connections;
    connections.map(function (obj) {
      return obj.id === data.id ? obj.conn.addIceCandidate(data.candidate) : null;
    });
  });
  socket.on('disconnecting', function () {// socket.id ?????? ?????? ??? map?????? ??????
  });
  socket.on('disconnect', function () {
    console.log("".concat(socket.id, "\uAC00 \uB098\uAC14\uC2B5\uB2C8\uB2E4."));
    console.log(users.get(socket.id));

    try {
      if (users.has(socket.id)) {
        users.get(socket.id).conn.close();
        io.to(roomName).emit('outuser', socket.id);
        users["delete"](socket.id);
      }
    } catch (error) {// console.log(error)
    } // socket.id??? ???????????? ?????? ?????? ????????? ??????

  });
});

var handleListen = function handleListen() {
  return console.log("Listening on http://localhost:".concat(port));
};

httpServer.listen(port, handleListen);

/***/ }),

/***/ "@babel/polyfill":
/*!**********************************!*\
  !*** external "@babel/polyfill" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@babel/polyfill");

/***/ }),

/***/ "@socket.io/cluster-adapter":
/*!*********************************************!*\
  !*** external "@socket.io/cluster-adapter" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@socket.io/cluster-adapter");

/***/ }),

/***/ "@socket.io/sticky":
/*!************************************!*\
  !*** external "@socket.io/sticky" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@socket.io/sticky");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),

/***/ "wrtc":
/*!***********************!*\
  !*** external "wrtc" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("wrtc");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("process");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	__webpack_require__("@babel/polyfill");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map