"use strict";

// using code from DomoMaker E by Aidan Kaufman
var catRenderer = void 0;
var shopForm = void 0;
var ShopFormClass = void 0;
var CatListClass = void 0;
var Happiness = void 0;

var handleCat = function handleCat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide' }, 350);

  if ($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#shopForm").attr("action"), $("#shopForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

var select = function select(cat) {
  console.log('select pressed');
  console.dir(cat);

  CatSelect = React.createClass({
    displayName: "CatSelect",

    render: renderCatSelect
  });

  catRenderer = ReactDOM.render(React.createElement(CatListClass, { csrf: csrf }), document.querySelector("#cats"));

  //  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function() {
  //    catRenderer.loadCatsFromServer();
  //  });

  return false;
};

var renderCatSelect = function renderCatSelect() {

  var thisCat = void 0;

  sendAjax('POST', '/findByID', cat._id, function (data, callback) {
    thisCat = data;
  });

  return React.createElement(
    "div",
    { key: cat._id, className: "cat" },
    React.createElement("img", { src: "/assets/img/catFace.png", alt: "cat face", className: "catFace" }),
    React.createElement(
      "h3",
      { className: "catName" },
      " Name: ",
      cat.name,
      " "
    ),
    React.createElement(
      "h3",
      { className: "catAge" },
      " Age: ",
      cat.age,
      " "
    ),
    React.createElement(
      "h3",
      { className: "catHappiness" },
      " Happiness: ",
      cat.happiness,
      " "
    )
  );
};

var renderShop = function renderShop() {
  return React.createElement(
    "form",
    { id: "shopForm",
      onSubmit: this.handleSubmit,
      name: "shopForm",
      action: "/maker",
      method: "POST",
      className: "shopForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "catName", type: "text", name: "name", placeholder: "Cat Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "catAge", type: "text", name: "age", placeholder: "Cat Age" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeCatSubmit", type: "submit", value: "Buy Cat" })
  );
};

var renderCatList = function renderCatList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "catList" },
      React.createElement(
        "h3",
        { className: "emptyCat" },
        "No Cats yet"
      )
    );
  }

  console.dir(this.props.csrf);
  var csrf = this.props.csrf;

  var catNodes = this.state.data.map(function (cat) {
    return React.createElement(
      "div",
      { key: cat._id, className: "cat" },
      React.createElement("img", { src: "/assets/img/catFace.png", alt: "cat face", className: "catFace" }),
      React.createElement(
        "h3",
        { className: "catName" },
        " Name: ",
        cat.name,
        " "
      ),
      React.createElement(
        "form",
        { id: "petForm",
          name: "petForm",
          onSubmit: function onSubmit() {
            select(cat);
          },
          action: "/select",
          method: "POST",
          className: "petForm"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: cat._id }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: csrf }),
        React.createElement("input", { className: "petCat", type: "submit", value: "Select Cat" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

var CreateShopFormClass = function CreateShopFormClass(csrf) {
  // cat buying render
  ShopFormClass = React.createClass({
    displayName: "ShopFormClass",

    handleSubmit: handleCat,
    render: renderShop
  });

  shopForm = ReactDOM.render(React.createElement(ShopFormClass, { csrf: csrf }), document.querySelector("#cats"));
};

var CreateCatListClass = function CreateCatListClass(csrf) {
  // cat list render
  CatListClass = React.createClass({
    displayName: "CatListClass",

    loadCatsFromServer: function loadCatsFromServer() {
      console.dir(this);
      sendAjax('GET', '/getCats', null, function (data) {
        this.setState({ data: data.cats });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadCatsFromServer();
    },
    render: renderCatList
  });

  catRenderer = ReactDOM.render(React.createElement(CatListClass, { csrf: csrf }), document.querySelector("#cats"));
};

var setupCatMaker = function setupCatMaker(csrf) {

  var shopButton = document.querySelector("#shopButton");
  shopButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateShopFormClass(csrf);
    return false;
  });

  var catListButton = document.querySelector("#catListButton");
  catListButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateCatListClass(csrf);
    return false;
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupCatMaker(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// using code from DomoMaker E by Aidan Kaufman
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#catMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#catMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  console.dir(action);
  $.ajax({

    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {

      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
