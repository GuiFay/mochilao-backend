const moment = require('moment');

function generateroutes(origem, startDate, destinos) {

    const cities = Object.keys(destinos)
    const dates = Object.values(destinos)
    const firstDate = moment(startDate).format('YYYY-MM-DD');
    const perm = getPermutations(cities, 3)


    //console.log(perm)

    let routes = {
        "rotas": {

        }
    }

    perm.map((x, index) => {
        const routeName = `route${index}`
        routes["rotas"] = { ...routes["rotas"], [routeName]: [] }
        let lastCity = ""
        x.map((y, indice) => {
            if (indice == 0) {
                routes["rotas"][routeName].push({
                    "origem": origem,
                    "destino": y,
                    "dia": firstDate
                })
            } else {
                routes["rotas"][routeName].push({
                    "origem": lastCity,
                    "destino": y,
                    "dia": "2019-10-31"
                })
            }
            if (indice >= x.length - 1) {
                routes["rotas"][routeName].push({
                    "origem": y,
                    "destino": origem,
                    "dia": "2019-10-31"
                })

            }

            lastCity = y


        })

    })
    //console.log(JSON.stringify(routes, null, 4))

    // const route = {
    //     [routeName]: []

    // }

    // route[routeName].push({
    //     "origem": origem,
    //     "destino": perm[index],
    //     "dia": "2019-10-31"
    // })



    //console.log(route)




    return destinos

}

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
                if (!currPerm.includes(list[k])) {
                    perm.push(currPerm.concat(list[k]));
                }
            }
        }
        // Recurse
        return generate(perm, maxLen, currLen + 1);
    };
    // Start with size 1 because of initial values
    return generate(perm, maxLen, 1);
};


teste = {
    "rotas": {
        "rota1": [
            {
                "origem": "BSB-sky",
                "destino": "GRU-sky",
                "dia": "2019-10-31"
            },
            {
                "origem": "GIG-sky",
                "destino": "POA-sky",
                "dia": "2019-11-01"
            },
            {
                "origem": "POA-sky",
                "destino": "BSB-sky",
                "dia": "2019-11-03"
            }
        ],
        "rota2": [
            {
                "origem": "BSB-sky",
                "destino": "POA-sky",
                "dia": "2019-10-31"
            },
            {
                "origem": "POA-sky",
                "destino": "GIG-sky",
                "dia": "2019-11-01"
            },
            {
                "origem": "GIG-sky",
                "destino": "BSB-sky",
                "dia": "2019-11-03"
            }
        ]
    }
}

module.exports = { generateroutes, teste }