// Esquema de base


var mongoose = require('mongoose');

module.exports = mongoose.model('Notas',{
	id: String,
	texto: { type: String, require: true }, 
	fecha: {
        type: Date,
        default: Date.now
    }
});
