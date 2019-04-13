const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const should = chai.should();
chai.use(chaiHttp);


describe('(1)  /api/indexing', () => {
    it('it should GET all the Exhange Rate', (done) => {
        chai.request(app)
            .get('/api/indexing')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.docs.should.be.a('array');
                done();
            });
    });
});

describe('(3)  /api/kurs?startdate=:startdate&enddate=:enddate', () => {
    it('it should GET Exchange Rate not found between startdate and enddate ', (done) => {
        const startdate = '2017-04-10'
        const enddate = '2017-04-11'
        chai.request(app)
            .get(`/api/kurs/?startdate=${startdate}&enddate=${enddate}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Not Found');
                done();
            });
    });
    it('it should GET Exchange Rate between startdate and enddate ', (done) => {
        const startdate = '2019-04-10'
        const enddate = '2019-04-11'
        chai.request(app)
            .get(`/api/kurs/?startdate=${startdate}&enddate=${enddate}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('(4)  /api/kurs/:symbol?startdate=:startdate&enddate=:enddate', () => {
    it('it should GET Exchange Rate not found between by symbol startdate and enddate ', (done) => {
        const symbol = 'ZZZ'
        const startdate = '2017-04-10'
        const enddate = '2018-04-11'
        chai.request(app)
            .get(`/api/kurs/${symbol}?startdate=${startdate}&enddate=${enddate}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Not Found');
                done();
            });
    });
    it('it should GET Exchange Rate by symbol between startdate and enddate ', (done) => {
        const symbol = 'USD'
        const startdate = '2019-04-10'
        const enddate = '2019-04-11'
        chai.request(app)
            .get(`/api/kurs/${symbol}?startdate=${startdate}&enddate=${enddate}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('(5)  /api/kurs', () => {
    it('it should not POST Exhange Rate already exist ', (done) => {
        const exchangeRate = {
            "symbol": "USD",
            "e_rate": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "tt_counter": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "bank_notes": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "date": "2019-04-10"
        }
        chai.request(app)
            .post('/api/kurs')
            .send(exchangeRate)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Data Already Exist');
                done();
            });
    });
    it('it should POST Exhange Rate ', (done) => {
        const exchangeRate = {
            "symbol": "AAA",
            "e_rate": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "tt_counter": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "bank_notes": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "date": "2019-01-03"
        }
        chai.request(app)
            .post('/api/kurs')
            .send(exchangeRate)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('(6)  /api/kurs', () => {
    it('it should not PUT/UPDATE Exhange Rate', (done) => {
        const exchangeRate = {
            "symbol": "USD",
            "e_rate": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "tt_counter": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "bank_notes": {
                "jual": 1803.55,
                "beli": 1773.55
            },
            "date": "2005-04-10"
        }
        chai.request(app)
            .put('/api/kurs')
            .send(exchangeRate)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Not Found');
                done();
            });
    });
    it('it should PUT/UPDATE Exhange Rate ', (done) => {
        const exchangeRate = {
            "symbol": "AAA",
            "e_rate": {
                "jual": 10000.55,
                "beli": 10020.55
            },
            "tt_counter": {
                "jual": 50000.55,
                "beli": 50030.55
            },
            "bank_notes": {
                "jual": 20000.55,
                "beli": 20010.55
            },
            "date": "2019-01-03"
        }
        chai.request(app)
            .put('/api/kurs')
            .send(exchangeRate)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('(2)  /api/kurs/:date', () => {
    it('it should DELETE Exchange Rate not found', (done) => {
        const date = '2018-01-01'
        chai.request(app)
            .delete(`/api/kurs/${date}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Not Found');
                done();
            });
    });
    it('it should DELETE by date in Exhange Rate', (done) => {
        const date = '2019-01-03'
        chai.request(app)
            .delete(`/api/kurs/${date}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Data successfully deleted');
                done();
            });
    });
});



