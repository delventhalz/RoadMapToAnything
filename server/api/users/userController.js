var User = require('./userModel.js');
//user controller methods

module.exports = {

  createUser : function(req, res, next){
    //request.body should have a username and password
    var newUser = req.body;
    console.log('creating user with', req);
    User(newUser).save()
      .then(function(createdUserResults){ 
        res.status(201).json(createdUserResults)
      })
      .catch(function(err){
        next(err);
      });
  },

  login : function(req, res, next){
    var credentials = {
      username: req.query.username,
      password: req.query.password,
    };

    User.findOne(credentials)
      .then(function(validUser){
        if (!validUser) res.sendStatus(401); 
        else res.status(200).json(validUser);
      })
      .catch(function(err){
        next(err);
      });
  }
}
