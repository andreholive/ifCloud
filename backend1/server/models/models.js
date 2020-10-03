const mongoose = require('../database');

const ModelSchema = new mongoose.Schema({
    configurations:{
            NOME_DISP: {type: String},
            tipo: {type: String},
            },
        openstackID: {type: String},
        status: {
            type: Number, 
            default: 2
        },
        id: {type: String},
        network: {
            type: String,
            default: null
        },
        subnet_id: {
            type: String,
            default: null        
        },
        cidr: {
            type: String,
            default: null
        },
        locked: {
            type: Boolean,
            default: false        
        },
        ports: {type: Array},
        selected: {
            type: Boolean,
            default: false
        },
        type: {type: String},
        x: {type: Number},
        y: {type: Number},
});

const Model = mongoose.model('Model', ModelSchema);

module.exports = Model;