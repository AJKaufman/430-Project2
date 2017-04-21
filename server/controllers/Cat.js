// using code from DomoMaker E by Aidan Kaufman
const models = require('../models');

const Cat = models.Cat;


const makerPage = (req, res) => {
    
  Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), cats: docs });
  });
};

const makeCat = (req, res) => {
    
  console.dir(req);
  
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required' });
  }

  const catData = {
    name: req.body.name,
    age: req.body.age,
    happiness: 0,
    owner: req.session.account._id,
  };

  const newCat = new Cat.CatModel(catData);

  const catPromise = newCat.save();

  catPromise.then(() => res.json({ redirect: '/maker' }));

  catPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Cat already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return catPromise;
};

// lets you raise your cat's happiness
const pet = (req, res) => {
  
  const newHappiness = req.body.happiness + 1;
  
  const catPromise = req.body.save();

  catPromise.then(() => res.json({ name: req.body.name, age: req.body.age, happiness: newHappiness }));

  return catPromise;
}

const getCats = (request, response) => {
  const req = request;
  const res = response;
  
  return Cat.CatModel.findByOwner(req.session.account._id, (err, docs) => {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    
    return res.json({ cats: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getCats = getCats;
module.exports.make = makeCat;
module.exports.pet = pet;
