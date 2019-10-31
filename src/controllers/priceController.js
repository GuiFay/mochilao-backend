const axios = require('axios');
const utils = require("../utils/utils.js")

async function getPrices(config, country, currency, locale, rotas) {
    let prices = {};

    for (const x in rotas) {
        route = rotas[x]
        routeName = x
        console.log(routeName)
        prices[x] = []
        for (const y in route) {
            const { origem, destino, dia } = route[y]

            try {
                console.log(`Buscando preço de ${origem} para ${destino} para o dia ${dia}`)
                const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${origem}/${destino}/${dia}`, config)

                if (response.data.Quotes[0] == undefined) {
                    console.log(`${origem} -> ${destino} : 0`)
                    prices[x].push(0)
                } else {
                    console.log(`${origem} -> ${destino} : ${response.data.Quotes[0].MinPrice}`)
                    prices[x].push(response.data.Quotes[0].MinPrice)
                }

            } catch (error) {
                prices.push(Infinity);
            }
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
        const {
            destinos, startDate, origem
        } = req.body



        try {

            //const { rotas } = utils.teste

            const routes = await utils.generateroutes(origem, startDate, destinos)
            // console.log(routes)



            // get all prices for all routes
            // const prices = await getPrices(config, country, currency, locale, rotas)

            // const reducer = (accumulator, currentValue) => accumulator + currentValue;
            // result = Object.values(prices).map((route => route.reduce(reducer)))


            return res.json(result);



        } catch (error) {
            return res.json({
                "ok:": false
            });
        }
    }
}