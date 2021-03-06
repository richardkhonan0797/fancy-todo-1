// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script/group.js":[function(require,module,exports) {
var socket;
var oldroom;
var rooms = [];

function chat(groupId, groupName) {
  socket = io.connect('http://localhost:3000');
  event.preventDefault(); // if(!groups.includes(groupName)){
  //     groups.push(groupName)
  //     socket = io.connect(`http://localhost:3000/${groupName}`)
  //     $.ajax({
  //         method:'post',
  //         url:'http://localhost:3000/chat',
  //         data:{ groupName }
  //     })
  //     .done( data => {
  //     })
  //     .fail( err => {
  //         console.log(err)
  //     })
  // }

  if (rooms.includes(groupName)) {} else {
    rooms.push(groupName);

    if (oldroom) {
      socket.emit('leave', oldroom);
      socket.emit('join', "".concat(groupName));
    } else {
      socket.emit('join', "".concat(groupName));
      oldroom = groupName;
    }

    socket.on('message', function (msg) {
      $('#messages').append("\n                <li>\n                    <span style=\"display: inline-block; vertical-align=top;\">\n                        <p style=\"color: blue;\">".concat(msg.name, ": </p>\n                        ").concat(msg.message, "\n                    </span>\n                </li>\n            "));
      window.scrollTo(0, document.body.scrollHeight);
    });
  }
}

function sendChat(groupName, groupId) {
  event.preventDefault();
  socket.emit('send', {
    room: groupName,
    message: $('#m').val(),
    name: localStorage.getItem('name')
  });
  $('#m').val('');
  return false;
}

function appendMessage(groupId) {
  event.preventDefault();
}

function createGroup() {
  event.preventDefault();
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/group',
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      name: $('#groupName').val()
    }
  }).done(function (data) {
    Swal.fire({
      icon: 'success',
      title: 'Create Success',
      message: "Group ".concat(data.name, " created."),
      showConfirmButton: false,
      timer: 1500
    });
    $('#group-list').empty();
    $('#groupName').val('');
    getGroups();
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Create Failed',
      message: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
  });
}

function getGroups() {
  event.preventDefault();
  $.ajax({
    method: 'get',
    url: 'http://localhost:3000/group',
    headers: {
      token: localStorage.getItem('token')
    }
  }).done(function (data) {
    $('#group-list').empty();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var group = _step.value;
        $('#group-list').append("\n                <div id=\"group-name\" class=\"mb-3\" style=\"cursor: pointer;padding:10px;\" onclick=\"detail('".concat(group._id, "');chat('").concat(group._id, "','").concat(group.name, "');\">\n                    <h3>").concat(group.name, "</h3>\n                    <input type=\"email\" class=\"form-control\" placeholder=\"Enter user email\" id=\"inviteMember").concat(group._id, "\">\n                    <button class=\"btn btn-outline-dark mb-2 mt-3\" onclick=\"inviteMember('").concat(group._id, "')\">Invite Member</button>\n                </div>\n            "));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Get Groups Failed',
      message: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
  });
}

function detail(id) {
  group_id = id;
  event.preventDefault();
  $.ajax({
    method: 'get',
    url: "http://localhost:3000/group/".concat(id),
    headers: {
      token: localStorage.getItem('token')
    }
  }).done(function (data) {
    $('#member-list').empty();
    $('#group-todos').empty();
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = data.members[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var member = _step2.value;
        $('#member-list').append("\n                <div class=\"row\">\n                    <p class='float-left' style=\"margin-left:15%\">".concat(member.name, "</p>\n                </div>\n            "));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    $('#group-todos').append("\n            <div class=\"row d-flex mt-5\">\n                <h4 style=\"border-bottom: 2px solid rgba(0,0,0,0.5)\">Group's Todos</h4>\n            </div>\n            <div class=\"row d-flex\">\n                <div class=\"text-center col-md-4 mt-3\">\n                <h1 style=\"border-bottom: 2px solid rgba(0,0,0,0.5)\">Add Todo</h1>\n                    <form class=\"mt-3 mb-3\">\n                        <div class=\"form-group\">\n                            <label for=\"groupTodoName\">Name :</label>\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Todo name\" id=\"groupTodoName\">\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"groupTodoDescription\">Description :</label>\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Description name\" id=\"groupTodoDescription\">\n                        </div>\n                    <button class=\"btn btn-outline-dark\" onclick=\"createGroupTodo('".concat(data._id, "')\">Create Group's Todo</button>\n                </div>\n                <div id=\"group-single-todo\" class=\"droppable2 text-center col-md-4 mt-3\">\n                    <h1 style=\"border-bottom: 2px solid rgba(0,0,0,0.5)\">Todos</h1>\n                </div>\n                <div id=\"group-finished-todo\" class=\"droppable2 text-center col-md-4 mt-3\">\n                    <h1 style=\"border-bottom: 2px solid rgba(0,0,0,0.5)\">Finished</h1>\n                </div>\n            </div>\n        "));
    $('.droppable2').droppable({
      drop: handleGroupDropEvent
    });
    $('.message-form-container').empty();
    $('.message-form-container').show();
    $('.message-form-container').append("\n            <div class=\"mx-auto single-todo col-md-6 mt-3\">\n                <h1 class=\"text-center\">".concat(data.name, "'s chat</h1>\n                <ul id=\"messages\"></ul>\n                <form id=\"message-form\" onsubmit=\"sendChat('").concat(data.name, "','").concat(data._id, "')\">\n                    <input id=\"m\" autocomplete=\"off\" / class=\"mb-3\"><button class=\"button btn-outline-dark ml-3\">Send</button>\n                </form>\n            </div>\n        "));
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = data.todos[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var todo = _step3.value;

        if (todo.status === 'finished') {
          $('#group-finished-todo').append("\n                    <div class=\"single-todo draggable mt-3 mb-2 draggable\" id=\"".concat(todo._id, "\">\n                        <h3>").concat(todo.name, "</h3>\n                        <p>").concat(todo.description, "</p>\n                        <button class=\"btn btn-outline-dark mb-2\" onclick=\"showGroupTodoForm('").concat(todo._id, "','").concat(todo.name, "','").concat(todo.description, "','").concat(data._id, "')\">Actions</button>\n                    </div>\n                "));
        } else {
          $('#group-single-todo').append("\n                    <div class=\"single-todo draggable mt-3 mb-2 draggable\" id=\"".concat(todo._id, "\">\n                        <h3>").concat(todo.name, "</h3>\n                        <p>").concat(todo.description, "</p>\n                        <button class=\"btn btn-outline-dark mb-2\" onclick=\"showGroupTodoForm('").concat(todo._id, "','").concat(todo.name, "','").concat(todo.description, "','").concat(data._id, "')\">Actions</button>\n                    </div>\n                "));
        }

        $(".draggable").draggable();
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Get Detail Failed',
      text: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
  });
}

function inviteMember(groupId) {
  var val = $("#inviteMember".concat(groupId)).val();
  $.ajax({
    method: 'patch',
    url: 'http://localhost:3000/group',
    headers: {
      token: localStorage.getItem('token')
    },
    data: {
      email: $("#inviteMember".concat(groupId)).val(),
      groupId: groupId
    }
  }).done(function (data) {
    Swal.fire({
      icon: 'success',
      title: 'Invitation sent',
      showConfirmButton: false,
      timer: 1500
    });
    $("#inviteMember".concat(groupId)).val('');
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Invite failed.',
      message: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
    $("#inviteMember".concat(groupId)).val('');
  });
}

function createGroupTodo(groupId) {
  event.preventDefault();
  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/todo?group=1',
    data: {
      name: $('#groupTodoName').val(),
      description: $('#groupTodoDescription').val(),
      groupId: groupId
    },
    headers: {
      token: localStorage.getItem('token')
    }
  }).done(function (data) {
    Swal.fire({
      icon: 'success',
      title: "Create Group's Todo Success",
      showConfirmButton: false,
      timer: 1500
    });
    $('#groupTodoName').val('');
    $('#groupTodoDescription').val('');
    detail(groupId);
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: "Create Group's Todo Failed",
      text: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
    $('#groupTodoName').val('');
    $('#groupTodoDescription').val('');
  });
}

function updateGroupTodo(id, groupId) {
  event.preventDefault();
  $.ajax({
    method: 'put',
    url: "http://localhost:3000/todo/".concat(id),
    data: {
      name: $('#updateName').val(),
      description: $('#updateDescription').val()
    },
    headers: {
      token: localStorage.getItem('token')
    }
  }).done(function (result) {
    Swal.fire({
      icon: 'success',
      title: 'Update success',
      showConfirmButton: false,
      timer: 1500
    });
    detail(groupId);
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to update todo',
      text: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
  });
}

function deleteGroupTodo(id, groupId) {
  event.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(function (result) {
    if (result.value) {
      $.ajax({
        method: 'delete',
        url: "http://localhost:3000/todo/".concat(id),
        headers: {
          token: localStorage.getItem('token')
        }
      }).done(function (result) {
        Swal.fire({
          title: 'Success',
          text: "Contact deleted",
          showConfirmButton: false,
          timer: 1500
        });
        $('.single-todo').remove();
        detail(groupId);
      }).fail(function (err) {
        Swal.fire({
          icon: 'error',
          title: 'Something is wrong!',
          text: err.responseJSON.message,
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  });
}

function showGroupTodoForm(id, name, description, groupId) {
  if ($("#".concat(id, " .update-form")).length > 0) {
    $(".update-form").remove();
  } else {
    $("#".concat(id)).append("\n            <div class=\"update-form\">\n                <form class=\"mt-3 mb-3\">\n                    <div class=\"form-group\">\n                        <label for=\"updateName\">Name :</label>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter name\" id=\"updateName\" value=\"".concat(name, "\">\n                    </div>\n                    <div class=\"form-group\">\n                        <label for=\"updateDescription\">Description :</label>\n                        <input type=\"text\" class=\"form-control\" placeholder=\"Enter description\" id=\"updateDescription\" value=\"").concat(description, "\">\n                    </div>\n                    <button type=\"submit\" class=\"btn btn-outline-dark\" onclick=\"updateGroupTodo('").concat(id, "','").concat(groupId, "')\">Update</button>\n                    <button type=\"submit\" class=\"btn btn-outline-danger\" onclick=\"deleteGroupTodo('").concat(id, "','").concat(groupId, "')\">Delete</button>\n                </form>\n            </div>\n        "));
  }
}

function handleGroupDropEvent(event, ui) {
  var draggable = ui.draggable;
  var id = draggable.attr('id');
  $.ajax({
    method: 'patch',
    url: "http://localhost:3000/todo/".concat(id),
    headers: {
      token: localStorage.getItem('token')
    }
  }).done(function (res) {
    Swal.fire({
      icon: 'success',
      title: "Status changed",
      showConfirmButton: false,
      timer: 1500
    });
    detail(group_id);
  }).fail(function (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to switch todo',
      text: err.responseJSON.message,
      showConfirmButton: false,
      timer: 1500
    });
  });
}
},{}],"../../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41799" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../usr/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script/group.js"], null)
//# sourceMappingURL=/group.737ddaf6.js.map