// Depedencias
var express = require('express')
, http = require('http')
, path = require('path')
, mongoose = require('mongoose')
, bodyParser = require('body-parser')
, methodOverride = require('method-override');


var Nota = require('./models/notas');
//var rutas = require('./routes/index');


// Configuracion
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


// Puerto y servidor
var server = http.createServer(app);
server.listen(8080);


//Conexion
mongoose.connect('mongodb://localhost/notas',function(err){
	if(!err){
		console.log("Conectado a mongo");
	}else{
		throw err;
	}
});


// CREATE
app.get('/nuevaNota',function(req , res){
    res.render('create',{
        put:false,
        action:'/create'
    });
});

app.post('/create',function(req , res){
		var nota =  new Nota({
			texto:req.body.texto
		});
		nota.save(function(err){
			if(err){
				res.redirect('/create');
			}else{
				res.redirect('/notas');
			}			
		});
});

// READ
app.get('/notas',function(req , res){
	Nota.find({},function(err,notas){
		res.render('index',{
			notas:notas
		});
	});
});

// UPDATE
app.get('/notas/:id', function(req, res){
    Nota.findById(req.params.id, function(err, documento){
        if(!err){
            res.render('create', {
                put: true,
                action: '/update/' + req.params.id,
                nota: documento
            });
        }
    });
});

app.put('/update/:id', function(req, res){
    Nota.findById(req.params.id, function(err, documento){
        if(!err){
            var nota = documento;
            nota.texto = req.body.texto;
            nota.save(function(err, documento){
                if(!err){
                    res.redirect('/notas');
                }
            });
        }
    });
});
// DELETE
app.delete('/notas/:id', function(req, res){
    Nota.remove({_id: req.params.id}, function(error){
        if(!error){
            res.redirect('/notas');
        }
    });
});


