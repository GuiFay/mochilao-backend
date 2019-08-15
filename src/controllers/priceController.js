const unirest = require('unirest');
const axios = require('axios');
var solver = require('node-tspsolver')
var request = require("request");

module.exports = {
    async index(req, res) {
        try {
            const country = "BR";
            const currency = "BRL";
            const locale = "pt-BR";
            const outboundpartialdate = "2019-08-16";
            const { cities } = req.body
            const cities_combination = [].concat(...cities.map(
                (v, i) => cities.slice(i + 1).map(w => [v, w]))
            );
            let prices = [];

            const config = {
                headers: {
                    'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                    'x-rapidapi-key': '27dd665eafmsh05e7e181465dbd8p100153jsnb5d709e7fcc2'
                }
            };

            for (var i = 0; i < cities_combination.length; i++) {
                const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${cities_combination[i][0]}/${cities_combination[i][1]}/${outboundpartialdate}`, config)


                console.log(`${cities_combination[i][0]} -> ${cities_combination[i][1]} : ${response.data.Quotes[0].MinPrice}`)
                prices.push(response.data.Quotes[0].MinPrice)
            };


            let matrix = []
            for (i in prices) {
                const line_matrix = []
                for (z in prices) {
                    if (prices[i] == prices[z]) {
                        line_matrix.push(0);
                    } else {
                        line_matrix.push(prices[z]);
                    }

                }
                matrix.push(line_matrix);
            }
            // console.log(matrix)

            solver
                .solveTsp(matrix, true, {})
                .then((result) => {
                    // result.map((city) => {
                    //     route.push(cities[city]);
                    // })
                    return res.json(result) // result is an array of indices specifying the route.
                });


            // return res.json({ "ok:": true });
        } catch (error) {
            return res.json({ "ok:": false });
        }



    },
}