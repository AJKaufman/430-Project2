// using code from DomoMaker E by Aidan Kaufman
let catRenderer;
let shopForm;
let ShopFormClass;
let CatListClass;
let CatSelect;
let CatList;
let CatDiv;
let CatBuySuccess;
let CatBuySuccessClass;
let Happiness;

const handleCat = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({ width: 'hide' }, 350);
  
  if($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  console.log('should display cat bought success soon');
  
  sendAjax('POST', $("#shopForm").attr("action"), $("#shopForm").serialize(), {function() {
    
    console.log('rendering cat bought success');
    
    CatBuySuccessClass = React.createClass({
      render: renderCatBuySuccessClass
    });
    
      
    CatBuySuccess = ReactDOM.render(
      <CatBuySuccessClass />, document.querySelector('#main')
    );
     
  }});
  
  return false;
};

const renderCatBuySuccessClass = (e) => {

  render(
    <h3>You bought a cat!</h3>
  );                                                                
};

const select = function(csrf, catID) {
  console.log('select pressed');
  
//  catRenderer = ReactDOM.render(
//    <CatList csrf={csrf} />, document.querySelector("#cats")
//  );
  
  console.dir(this);
  const data = `_csrf=${csrf}&_id=${catID}`
  
  console.dir(csrf);
  console.dir(catID);
  
  sendAjax('POST', '/findByID', data, function(catSelected, callback) {
    console.dir(catSelected); // AIDAN
  });
      
  
//  sendAjax('POST', $(e.target).attr("action"), $(e.target).serialize(), function() {
//    catRenderer.loadCatsFromServer();
//  });
  
  return false;
};

const renderCatSelect = function() {
 
  return(
    <div key={cat._id} className="cat">
      <img src="/assets/img/catFace.png" alt="cat face" className="catFace" />
      <h3 className="catName"> Name: {cat.name} </h3>
      <h3 className="catAge"> Age: {cat.age} </h3>
      <h3 className="catHappiness"> Happiness: {cat.happiness} </h3>
    </div>
  );
};

const renderShop = function() {
  return (
   <form id="shopForm" 
      onSubmit={this.handleSubmit}
      name="shopForm"
      action="/maker"
      method="POST"
      className="shopForm"
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

const renderCatDiv = function() {
  return(
    <div key={this.props.catID} className="cat">
      <img src="/assets/img/catFace.png" alt="cat face" className="catFace" />
      <h3 className="catName"> Name: {this.props.catName} </h3>
      
      <form id="petForm" 
        name="petForm"
        onSubmit={(e) => {
          e.preventDefault();
          select(this.props.csrf, this.props.catID);
          return false;
          }
        }
        action="/findByID"
        method="POST"
        className="petForm"
      >
        <input type="hidden" name="_id" value={this.props.catID} />
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="petCat" type="submit" value="Select Cat" />
      </form>
      
    </div>
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
  
  console.dir(this.props.csrf);
  const csrf = this.props.csrf;
  
  const catNodes = this.state.data.map(function(cat) {
    return(
      <CatDiv csrf={csrf} catName={cat.name} catID={cat._id} key={cat._id} />
    );
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

const CreateShopFormClass = function(csrf) {
  // cat buying render
  ShopFormClass = React.createClass({
    handleSubmit: handleCat,
    render: renderShop,
  });
  
  shopForm = ReactDOM.render(
    <ShopFormClass csrf={csrf} />, document.querySelector("#cats")
  );
};

const CreateCatListClass = function(csrf) {
  // cat list render
  CatListClass = React.createClass({
    loadCatsFromServer: function() {
      console.dir('this is : ' + this);
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
  
  catRenderer = ReactDOM.render(
    <CatListClass csrf={csrf} />, document.querySelector("#cats")
  );
};

const setupCatMaker = function(csrf) {
  
  const shopButton = document.querySelector("#shopButton");
  shopButton.addEventListener("click", (e) => {
    e.preventDefault();
    CreateShopFormClass(csrf);
    return false;
  });
  
  const catListButton = document.querySelector("#catListButton");
  catListButton.addEventListener("click", (e) => {
    e.preventDefault();
    CreateCatListClass(csrf);
    return false;
  });
  
  
  CatSelect = React.createClass({
    render: renderCatSelect
  });
  
  CatDiv = React.createClass({
    render: renderCatDiv
  });

};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupCatMaker(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});


























