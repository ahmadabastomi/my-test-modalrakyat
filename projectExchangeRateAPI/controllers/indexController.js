const exchangeRate = require('../models/exchangeRate');
require('colors');
const request = require('request');
const cheerio = require('cheerio');
const dateFormat = require('dateformat');
const cheerioTableparser = require('cheerio-tableparser');
const { validationResult } = require('express-validator/check');
var numeral = require('numeral');
var validator = require('validator');
var data = []

/*
 * SCRAPING URL USING CHERRIO AND GET ALL DATA 
 */

exports.index = function (req, res) {
    let url = 'https://www.bca.co.id/id/Individu/Sarana/Kurs-dan-Suku-Bunga/Kurs-dan-Kalkulator';
    request(url, async function (err, response, body) {
        try {
            let $ = cheerio.load(body);
            await cheerioTableparser($);
            data = $("table.table-bordered").children('tbody').parsetable(true, true, true);
            var day = dateFormat(new Date(), "yyyy-mm-dd");
            await exchangeRate.find({ date: day }).exec(async function (err, docs) {
                if (docs.length > 0) {
                    await exchangeRate.find().exec(function (err, docs) {
                        if (docs.length === 0) {
                            return res.status(404).send({ message: 'Not Found' })
                        } else {
                            return res.status(200).json({ status: "skip", docs })
                        }
                    })
                } else {
                    for (let i = 0; i < data[0].length; i++) {
                        await exchangeRate.create({
                            symbol: data[0][i],
                            e_rate: {
                                beli: numeral(data[1][i].replace('.', '').replace(',', '.')).value(),
                                jual: numeral(data[2][i].replace('.', '').replace(',', '.')).value()
                            },
                            tt_counter: {
                                beli: numeral(data[3][i].replace('.', '').replace(',', '.')).value(),
                                jual: numeral(data[4][i].replace('.', '').replace(',', '.')).value()
                            },
                            bank_notes: {
                                beli: numeral(data[5][i].replace('.', '').replace(',', '.')).value(),
                                jual: numeral(data[6][i].replace('.', '').replace(',', '.')).value()
                            },
                            date: day
                        })
                    }
                    await exchangeRate.find().exec(function (err, docs) {
                        if (docs.length === 0) {
                            return res.status(404).send({ message: 'Not Found' })
                        } else {
                            return res.status(200).json({ status: "stored", docs })
                        }
                    })
                }
            })
        } catch (error) {
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
};

/*
 * DELETE DATA BY DATE YYYY:MM:DD
 */

exports.destroy = async function (req, res) {
    const { date } = req.params
    try {
        if (validator.isISO8601(date)) {
            await exchangeRate.deleteMany({ date: date }).exec(function (err, docs) {
                if (docs.deletedCount === 0) {
                    return res.status(404).send({ message: 'Not Found' })
                }
                else {
                    return res.status(200).json({ message: 'Data successfully deleted', docs })
                }
            })
        } else {
            return res.status(400).send({ message: "Bad Request" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
};

/*
 * GET ALL DATA BETWEEN STARTDATE AND ENDDATE 
 */

exports.showByDate = async function (req, res) {
    let { startdate, enddate } = req.query
    try {
        if (validator.isISO8601(startdate) && validator.isISO8601(enddate)) {
            await exchangeRate.find({
                date: {
                    $gte: startdate,
                    $lte: enddate
                }
            }).exec(function (err, docs) {
                if (docs.length === 0) {
                    return res.status(404).send({ message: 'Not Found' })
                } else {
                    return res.status(200).json(docs)
                }
            })
        } else {
            return res.status(400).send({ message: "Bad Request" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
};

/*
 * GET ALL DATA BY SYMBOL BETWEEN STARTDATE AND ENDDATE
 */

exports.showBySymbolDate = async function (req, res) {
    const { symbol } = req.params
    const { startdate, enddate } = req.query
    try {
        if (validator.isISO8601(startdate) && validator.isISO8601(enddate) && validator.isLength(symbol, { min: 3, max: 3 }) && validator.isAlpha(symbol)) {
            await exchangeRate.find({
                symbol: symbol,
                date: {
                    $gte: startdate,
                    $lte: enddate
                }
            }).exec(function (err, docs) {
                if (docs.length === 0) {
                    return res.status(404).send({ message: 'Not Found' })
                } else {
                    return res.status(200).json(docs)
                }
            })
        } else {
            return res.status(400).send({ message: "Bad Request" })
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal Server Error" })
    }
};

/*
 * CREATE NEW DATA
 */

exports.create = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Unprocessable Entity" });
    } else {
        try {
            await exchangeRate.find({ symbol: req.body.symbol, date: req.body.date }).exec(async function (err, docs) {
                if (docs.length === 0) {
                    try {
                        await exchangeRate.create(req.body)
                        return res.status(201).json(req.body)
                    } catch (err) {
                        return res.status(400).send({ message: "Bad Request" })
                    }
                } else {
                    return res.status(400).send({ message: 'Data Already Exist' })
                }
            })
        } catch (error) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }
};

/*
 * UPDATE DATA
 */

exports.update = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Unprocessable Entity" });
    } else {
        try {
            await exchangeRate.findOneAndUpdate({ symbol: req.body.symbol, date: req.body.date }, req.body, function (err, docs) {
                if (docs === null) {
                    return res.status(404).send({ message: "Not Found" })
                }
                else {
                    return res.status(200).json(req.body)
                }
            })
        } catch (error) {
            res.status(500).send({ message: "Internal Server Error" })
        }
    }
};


