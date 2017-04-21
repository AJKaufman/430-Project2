// using code from DomoMaker E by Aidan Kaufman
let catRenderer;
let catForm;
let CatFormClass;
let CatListClass;

const handleCat = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({ width: 'hide' }, 350);
  
  if($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  sendAjax('POST', $("#catForm").attr("action"), $("#catForm").serialize(), function() {
    catRenderer.loadCatsFromServer();
  });
  
  return false;
};

const handlePet = (e) => {
  console.log('pet pressed');
  
  sendAjax('POST', $("#petForm").attr("action"), $("#petForm").serialize(), function() {
    catRenderer.loadCatsFromServer();
  });
  
  return false;
};

const renderCat = function() {
  return (
   <form id="catForm" 
      onSubmit={this.handleSubmit}
      name="catForm"
      action="/maker"
      method="POST"
      className="catForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="catName" type="text" name="name" placeholder="Cat Name"/>
      <label htmlFor="age">Age: </label>
      <input id="catAge" type="text" name="age" placeholder="Cat Age"/>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeCatSubmit" type="submit" value="Buy Cat" />
    </form>  
  );
};

const renderCatList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="catList">
        <h3 className="emptyCat">No Cats yet</h3>
      </div>
    );
  }
  
  const catNodes = this.state.data.map(function(cat) {
    console.dir(cat.happiness);
    return (
    <div key={cat._id} className="cat">
      <img src="/assets/img/catFace.png" alt="cat face" className="catFace" />
      <h3 className="catName"> Name: {cat.name} </h3>
      <h3 className="catAge"> Age: {cat.age} </h3>
      <h3 className="catHappiness"> Happiness: {cat.happiness} </h3>
      <form id="petForm" 
        onSubmit={handlePet}
        name="petForm"
        action="/maker"
        method="POST"
        className="petForm"
      >
        <input type="hidden" name="_csrf" value={cat.csrf} />
        <input className="petCat" type="submit" value="Pet cat" />
      </form>
    </div>
    );    
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

const setupCatMaker = function(csrf) {
  CatFormClass = React.createClass({
    handleSubmit: handleCat,
    render: renderCat,
  });
    
  CatListClass = React.createClass({
    loadCatsFromServer: function() {
      sendAjax('GET', '/getCats', null, function(data) {
        this.setState({data:data.cats});
      }.bind(this));
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      this.loadCatsFromServer();
    },
    render: renderCatList
  });
  
  catForm = ReactDOM.render(
    <CatFormClass csrf={csrf} />, document.querySelector("#makeCat")
  );
  
  catRenderer = ReactDOM.render(
    <CatListClass />, document.querySelector("#cats")
  );

};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupCatMaker(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});


























