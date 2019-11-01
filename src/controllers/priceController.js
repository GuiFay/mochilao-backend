const axios = require('axios');
const utils = require("../utils/utils.js")

async function getPrices(config, country, currency, locale, rotas) {

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    let prices = {};

    for (const x in rotas) {
        route = rotas[x]
        routeName = x
        prices[x] = []
        console.log(`Rota ${routeName}`)

        for (const y in route) {
            const { origem, destino, dia } = route[y]

            try {
                console.log(`Buscando preço de ${origem} para ${destino} para o dia ${dia}`)
                await sleep(2000);
                const response = await axios.get(` https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/${origem}/${destino}/${dia}`, config)
                const price = parseInt(response.data.Quotes[0].MinPrice)

                if (price == undefined || isNaN(price)) {
                    console.log(`${origem} -> ${destino} : 0`)
                    prices[x].push(0)
                } else {
                    console.log(`${origem} -> ${destino} : ${price}`)
                    prices[x].push(price)
                }
            } catch (error) {
                console.log(`ERRO! TENTANDO NOVAMENTE`)
                getPrices()
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
        const { destinos, startDate, origem } = req.body

        try {
            //generate all routes
            console.log("GERANDO ROTAS...")
            const routes = await utils.generateRoutes(origem, startDate, destinos)

            //get all prices for all routes
            console.log("BUSCANDO PREÇOS NA API...")
            const prices = await getPrices(config, country, currency, locale, routes.rotas)

            //reduce all values to sum of values
            console.log("CALCULANDO MELHOR ROTA...")
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            result = Object.values(prices).map((route => route.reduce(reducer)))
            const minValueIndex = result.indexOf(Math.min(...result))
            const minValue = Math.min(...result)

            for (var prop in routes.rotas) {
                if (prop == minValueIndex) {
                    let bestRoute = { ...routes.rotas[prop], "Price": minValue };
                    return res.json(bestRoute);
                }
            }

        } catch (error) {
            return res.json({
                "ok:": false
            });
        }
    }
}