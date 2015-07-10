var models = require('../models/models.js');

//Autoload - Factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		} 
		).catch(function(error) { next(error);});
};


// GET /quizes
exports.index = function(req, res) {
	/*models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
	}).catch(function(error) { next(error);})*/
    var busqueda = {};
    var consulta = 'Introduzca texto a buscar';
    if (req.query.search) {
        consulta = req.query.search;
        var cadena = '%' + req.query.search + '%';
        // Además reemplazamos los espacios
        cadena = cadena.replace(" ",'%');
        // Se termina el objeto de búsqueda
        busqueda = {where:["pregunta like ?", cadena],
                    order: 'pregunta ASC'
                    }
    }
    models.Quiz.findAll(busqueda).then(function(quizes){
        res.render('quizes/index', {quizes: quizes, consulta: consulta});
     }).catch(function(error) {next(error);});
};

// GET quizes/:id
exports.show = function(req, res) {
	//res.render('quizes/question', {pregunta: 'Capital de italia'});
	//models.Quiz.find(req.params.quizId).then(function(quiz) {
	res.render('quizes/show', { quiz: req.quiz});
	//})
};

// GET quizes/:id/answer
exports.answer = function(req, res) {
	//models.Quiz.find(req.params.quizId).then(function(quiz) {
		//if (req.query.respuesta === 'Roma') {
	var resultado = 'Incorrecto';		
	if (req.query.respuesta === req.quiz.respuesta) {
			//res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto'});
		resultado = 'Correcto';
	} //else {
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});		
		//}
	//})	
};
