const unirest = require('unirest');
const axios = require('axios');
var solver = require('node-tspsolver')
var request = require("request");

async function costMatrix(country, currency, locale, originplace, destinationplace, outboundpartialdate) {
    try {
        const config = {
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': '27dd665eafmsh05e7e181465dbd8p100153jsnb5d709e7fcc2'
            }
        };

        const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${originplace}/${destinationplace}/${outboundpartialdate}`, config)
        return response.data
    }
    catch (err) {
        console.log('fetch failed', err);
    }

    // const price = response_data.Quotes[0].MinPrice
    // console.log(response_data)
};

module.exports = {
    index(req, res) {


        const prices = []
        const { cities } = req.body
        const cities_combination = [].concat(...cities.map(
            (v, i) => cities.slice(i + 1).map(w => [v, w]))
        );

        cities_combination.forEach(element => {
            // console.log(`tentando ${element[0]} -> ${element[1]}`)
            costMatrix("BR", "BRL", "pt-BR", element[0], element[1], "2019-08-16")
                .then((data) => {
                    prices.push(data.Quotes[0].MinPrice)
                })

            // prices.push("data.Quotes[0].MinPrice")
        });


        console.log(prices)


        // const getData = async () => {
        //     return await Promise.all(cities.map(city => costMatrix("US", "USD", "en-US", city, "JFK-sky", "2019-08-15").Quotes[0].MinPrice
        //     ))
        // }   

        // const data = getData()
        // console.log(data)

        // const costMatrix = [
        //     [0, 1, 3, 4],
        //     [1, 0, 2, 3],
        //     [3, 2, 0, 5],
        //     [4, 3, 5, 0]
        // ]

        // var route = []

        // solver
        //     .solveTsp(costMatrix, true, {})
        //     .then((result) => {
        //         result.map((city) => {
        //             route.push(cities[city]);
        //         })
        //         return res.json(route) // result is an array of indices specifying the route.
        //     });

        // a = await costMatrix()      

        return res.json({ "ok:": true });

    },
}