"use strict";

// using code from DomoMaker E by Aidan Kaufman
var catRenderer = void 0;
var catForm = void 0;
var CatFormClass = void 0;
var CatListClass = void 0;

var handleCat = function handleCat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide' }, 350);

  if ($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#catForm").attr("action"), $("#catForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

var handlePet = function handlePet(e) {
  console.log('pet pressed');

  sendAjax('POST', $("#petForm").attr("action"), $("#petForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

var renderCat = function renderCat() {
  return React.createElement(
    "form",
    { id: "catForm",
      onSubmit: this.handleSubmit,
      name: "catForm",
      action: "/maker",
      method: "POST",
      className: "catForm"
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

  var catNodes = this.state.data.map(function (cat) {
    console.dir(cat.happiness);
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
      ),
      React.createElement(
        "form",
        { id: "petForm",
          onSubmit: handlePet,
          name: "petForm",
          action: "/maker",
          method: "POST",
          className: "petForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: cat.csrf }),
        React.createElement("input", { className: "petCat", type: "submit", value: "Pet cat" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

var setup = function setup(csrf) {
  CatFormClass = React.createClass({
    displayName: "CatFormClass",

    handleSubmit: handleCat,
    render: renderCat
  });

  CatListClass = React.createClass({
    displayName: "CatListClass",

    loadCatsFromServer: function loadCatsFromServer() {
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

  catForm = ReactDOM.render(React.createElement(CatFormClass, { csrf: csrf }), document.querySelector("#makeCat"));

  catRenderer = ReactDOM.render(React.createElement(CatListClass, null), document.querySelector("#cats"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// using code from DomoMaker E by Aidan Kaufman
var catRenderer = void 0;
var catForm = void 0;
var CatFormClass = void 0;
var CatListClass = void 0;

var handleCat = function handleCat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide' }, 350);

  if ($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#catForm").attr("action"), $("#catForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

var handlePet = function handlePet(e) {
  console.log('pet pressed');

  sendAjax('POST', $("#petForm").attr("action"), $("#petForm").serialize(), function () {
    catRenderer.loadCatsFromServer();
  });

  return false;
};

var renderCat = function renderCat() {
  return React.createElement(
    "form",
    { id: "catForm",
      onSubmit: this.handleSubmit,
      name: "catForm",
      action: "/maker",
      method: "POST",
      className: "catForm"
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
    React.createElement("input", { className: "makeCatSubmit", type: "submit", value: "Make Cat" })
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

  var catNodes = this.state.data.map(function (cat) {
    console.dir(cat.happiness);
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
      ),
      React.createElement(
        "form",
        { id: "petForm",
          onSubmit: handlePet,
          name: "petForm",
          action: "/maker",
          method: "POST",
          className: "petForm"
        },
        React.createElement("input", { type: "hidden", name: "_csrf", value: cat.csrf }),
        React.createElement("input", { className: "petCat", type: "submit", value: "Pet cat" })
      )
    );
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

var setup = function setup(csrf) {
  CatFormClass = React.createClass({
    displayName: "CatFormClass",

    handleSubmit: handleCat,
    render: renderCat
  });

  CatListClass = React.createClass({
    displayName: "CatListClass",

    loadCatsFromServer: function loadCatsFromServer() {
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

  catForm = ReactDOM.render(React.createElement(CatFormClass, { csrf: csrf }), document.querySelector("#makeCat"));

  catRenderer = ReactDOM.render(React.createElement(CatListClass, null), document.querySelector("#cats"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
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
