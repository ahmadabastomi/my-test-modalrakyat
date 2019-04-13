const { body } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'post': {
            return [
                body('symbol', 'Invalid symbol').exists().isAlpha().isLength({ min: 3, max: 3 }),
                body('e_rate', 'Invalid e_rate').exists().isIn([{}]),
                body('e_rate.jual', 'Invalid e_rate jual').exists().isNumeric().not().isString(),
                body('e_rate.beli', 'Invalid e_rate beli').exists().isNumeric().not().isString(),
                body('tt_counter', 'Invalid tt_counter').exists().isIn([{}]),
                body('tt_counter.jual', 'Invalid tt_counter jual').exists().isNumeric().not().isString(),
                body('tt_counter.beli', 'Invalid tt_counter beli').exists().isNumeric().not().isString(),
                body('bank_notes', 'Invalid bank_notes').exists().isIn([{}]),
                body('bank_notes.jual', 'Invalid bank_notes jual').exists().isNumeric().not().isString(),
                body('bank_notes.beli', 'Invalid bank_notes beli').exists().isNumeric().not().isString(),
                body('date', 'Invalid date').exists().isISO8601(),
            ]
        }
        case 'put': {
            return [
                body('symbol', 'Invalid symbol').exists().isAlpha().isLength({ min: 3, max: 3 }),
                body('e_rate', 'Invalid e_rate').exists().isIn([{}]),
                body('e_rate.jual', 'Invalid e_rate jual').exists().isNumeric().not().isString(),
                body('e_rate.beli', 'Invalid e_rate beli').exists().isNumeric().not().isString(),
                body('tt_counter', 'Invalid tt_counter').exists().isIn([{}]),
                body('tt_counter.jual', 'Invalid tt_counter jual').exists().isNumeric().not().isString(),
                body('tt_counter.beli', 'Invalid tt_counter beli').exists().isNumeric().not().isString(),
                body('bank_notes', 'Invalid bank_notes').exists().isIn([{}]),
                body('bank_notes.jual', 'Invalid bank_notes jual').exists().isNumeric().not().isString(),
                body('bank_notes.beli', 'Invalid bank_notes beli').exists().isNumeric().not().isString(),
                body('date', 'Invalid date').exists().isISO8601(),
            ]
        }
    }
}
