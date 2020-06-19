"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddPost =
/*#__PURE__*/
function (_Stimulus$Controller) {
  _inherits(AddPost, _Stimulus$Controller);

  function AddPost() {
    _classCallCheck(this, AddPost);

    return _possibleConstructorReturn(this, (AddPost.__proto__ || Object.getPrototypeOf(AddPost)).apply(this, arguments));
  }

  _createClass(AddPost, [{
    key: "initialize",
    value: function initialize() {
      this.markdownUpdated = true;
    }
  }, {
    key: "mdupdate",
    value: function mdupdate() {
      this.markdownUpdated = true;
    }
  }, {
    key: "edit",
    value: function edit() {
      this.mdeditorTarget.classList.remove('hidden');
      this.mdpreviewTarget.classList.add('hidden');
    }
  }, {
    key: "preview",
    value: function preview() {
      var _this = this;

      if (!this.markdownUpdated) {
        this.mdeditorTarget.classList.add('hidden');
        this.mdpreviewTarget.classList.remove('hidden');
        return;
      }

      return axios.post('http://127.0.0.1:3333/posts/preview', {
        markdown: this.markdownTarget.value
      }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').getAttribute('value')
        }
      }).then(function (data) {
        _this.mdpreviewTarget.innerHTML = data.data.data;
        _this.markdownUpdated = false;

        _this.mdeditorTarget.classList.add('hidden');

        _this.mdpreviewTarget.classList.remove('hidden');
      });
    }
  }], [{
    key: "targets",
    get: function get() {
      return ['markdown', 'mdpreview', // hide while editing
      'mdeditor' // hide while previewing
      ];
    }
  }]);

  return AddPost;
}(Stimulus.Controller);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListItem =
/*#__PURE__*/
function (_Stimulus$Controller) {
  _inherits(ListItem, _Stimulus$Controller);

  function ListItem() {
    _classCallCheck(this, ListItem);

    return _possibleConstructorReturn(this, (ListItem.__proto__ || Object.getPrototypeOf(ListItem)).apply(this, arguments));
  }

  _createClass(ListItem, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "destroyItem",
    value: function destroyItem(evt) {
      evt.preventDefault();
      return axios.delete("http://127.0.0.1:3333/".concat(this.path, "/").concat(this.itemId)).then(function (resp) {
        location.reload();
      });
    }
  }, {
    key: "itemId",
    get: function get() {
      return this.data.get('id');
    }
  }, {
    key: "path",
    get: function get() {
      return this.data.get('path');
    }
  }], [{
    key: "targets",
    get: function get() {}
  }]);

  return ListItem;
}(Stimulus.Controller);
"use strict";

var app = Stimulus.Application.start();
app.register('add-post', AddPost);
app.register('list-item', ListItem);
document.addEventListener('turbolinks:load', function (evt) {
  feather.replace();
});