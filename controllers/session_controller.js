//MW auterizacion accesos restringidos
exports.loginRequired = function(req, res, next) {
	if(req.session.user) { 
		next();
	} else {
		res.redirect('/login');
	}
};

// GET /login --formulario
exports.new = function(req, res) {
	var errors = req.session.errors | {};
	req.session.errors = {};

	res.render('sessions/new',{errors: errors});
};

//POST /login --crear la session
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;
	var marcaT = (new Date()).getTime();

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + error }];
			res.redirect("/login");
			return;
		}

		req.session.user = {id:user.id, username:user.username, tacceso:marcaT};	

		res.redirect(req.session.redir.toString());
	});
};

//DELETE /logout --destruir session
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString());
};