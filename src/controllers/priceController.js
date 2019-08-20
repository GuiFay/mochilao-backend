const axios = require('axios');
var solver = require('node-tspsolver')


module.exports = {
    async index(req, res) {
        try {
            const country = "BR";
            const currency = "BRL";
            const locale = "pt-BR";
            const outboundpartialdate = "2019-09-01";
            const { cities } = req.body

            const cities_combination = []




            for (let i = 0; i < cities.length - 1; i++) {
                // This is where you'll capture that last value
                for (let j = i + 1; j < cities.length; j++) {
                    cities_combination.push([cities[i], cities[j]]);

                }
            }
            for (let i = 0; i < cities.length - 1; i++) {
                // This is where you'll capture that last value
                for (let j = i + 1; j < cities.length; j++) {
                    cities_combination.push([cities[j], cities[i]]);
                }
            }




            // let prices = [];

            // const config = {
            //     headers: {
            //         'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
            //         'x-rapidapi-key': '27dd665eafmsh05e7e181465dbd8p100153jsnb5d709e7fcc2'
            //     }
            // };

            // for (var i = 0; i < cities_combination.length; i++) {
            //     const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${cities_combination[i][0]}/${cities_combination[i][1]}/${outboundpartialdate}`, config)



            //     console.log(`${cities_combination[i][0]} -> ${cities_combination[i][1]} : ${response.data.Quotes[0].MinPrice}`)
            //     prices.push(response.data.Quotes[0].MinPrice)
            // };

            // prices = [496, 381, 421, 649, 353, 348]
            // prices = [ 496, 421, 353, 381, 649, 348 ]

            console.log(prices)

            let matrix = []
            const line_matrix = []
            for (i in prices) {
                for (z in prices) {
                    if (prices[i] == prices[z]) {
                        line_matrix.push(0);
                    } else {
                        line_matrix.push(prices[z]);
                        // console.log(line_matrix)
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


            return res.json({ "ok:": true });
        } catch (error) {
            return res.json({ "error:": "erro" });
        }




    },
}