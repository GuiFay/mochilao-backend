const axios = require('axios');
var solver = require('node-tspsolver')


function getPermutations(list, maxLen) {
    // Copy initial values as arrays
    var perm = list.map(function (val) {
        return [val];
    });
    // Our permutation generator
    function generate(perm, maxLen, currLen) {
        // Reached desired length
        if (currLen === maxLen) {
            return perm;
        }
        // For each existing permutation
        for (var i = 0, len = perm.length; i < len; i++) {
            var currPerm = perm.shift();
            // Create new permutation
            for (var k = 0; k < list.length; k++) {
                perm.push(currPerm.concat(list[k]));
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
};

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [],
        i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

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
        const outboundpartialdate = "2019-10-02";
        const {
            cities
        } = req.body

        try {
            // combine all possibilities of routes  2 on 2
            const citiesCombination = await getPermutations(cities, 2);
            // get all prices for all routes
            const prices = await getPrices(config, country, currency, locale, outboundpartialdate, citiesCombination)
            // generare the coast matrix for the Travelling salesman solver
            const costMatrix = await listToMatrix(prices, cities.length)
            console.log(costMatrix)

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