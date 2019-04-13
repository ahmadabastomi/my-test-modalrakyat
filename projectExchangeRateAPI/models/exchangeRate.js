const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


let ExchangeRateSchema = new Schema({
    symbol: { type: String, required: true, max: 100 },
    e_rate: {
        beli: SchemaTypes.Double,
        jual: SchemaTypes.Double
    },
    tt_counter: {
        beli: SchemaTypes.Double,
        jual: SchemaTypes.Double
    },
    bank_notes: {
        beli: SchemaTypes.Double,
        jual: SchemaTypes.Double
    },
    date: { type: Date, required: true }
});

// Export the model
module.exports = mongoose.model('exchangeRate', ExchangeRateSchema);