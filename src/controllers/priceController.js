const axios = require('axios');
const solver = require('node-tspsolver')
const utils = require("../utils/utils.js")

async function getPrices(config, country, currency, locale, outboundpartialdate, cities) {
    let prices = [];

    for (var i = 0; i < cities.length; i++) {

        try {
            console.log(`Tentando ${cities[i][0]} -> ${cities[i][1]}`)
            const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${cities[i][0]}/${cities[i][1]}/${outboundpartialdate}`, config)

            if (response.data.Quotes[0] == undefined) {
                console.log(`${cities[i][0]} -> ${cities[i][1]} : 0`)
                prices.push(0);
            } else {
                console.log(`${cities[i][0]} -> ${cities[i][1]} : ${response.data.Quotes[0].MinPrice}`)
                prices.push(response.data.Quotes[0].MinPrice)

            }

        } catch (error) {
            prices.push(Infinity);
        }
    }
    return prices
}

module.exports = {
    async index(req, res) {

        const config = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': '27dd665eafmsh05e7e181465dbd8p100153jsnb5d709e7fcc2'
            }
        };

        const country = "BR";
        const currency = "BRL";
        const locale = "pt-BR";
        const outboundpartialdate = "2019-10-31";
        const {
            cities
        } = req.body

        try {

            // combine all possibilities of routes  2 on 2
            const citiesCombination = await utils.getPermutations(cities, 2);


            // get all prices for all routes
            const prices = await getPrices(config, country, currency, locale, outboundpartialdate, citiesCombination)


            // generare the coast matrix for the Travelling salesman solver
            const costMatrix = await utils.listToMatrix(prices, cities.length)


            //solves the Travelling salesman problem
            solver
                .solveTsp(costMatrix, true, {})
                .then(function (result) {
                    return res.json(result);
                })


        } catch (error) {
            return res.json({
                "ok:": false
            });
        }
    }
}