const moment = require('moment');

function generateRoutes(origem, startDate, destinos) {

    const cities = Object.keys(destinos)
    const firstDate = moment(startDate).format('YYYY-MM-DD');
    const perm = getPermutations(cities, 3)

    let routes = {
        "rotas": {

        }
    }

    perm.map((x, index) => {
        const routeName = `${index}`
        routes["rotas"] = { ...routes["rotas"], [routeName]: [] }
        let lastCity = ""
        let date
        x.map((y, indice) => {
            let dateIncrease = destinos[y]

            if (indice == 0) {
                date = firstDate
                routes["rotas"][routeName].push({
                    "origem": origem,
                    "destino": y,
                    "dia": date
                })
            } else {
                routes["rotas"][routeName].push({
                    "origem": lastCity,
                    "destino": y,
                    "dia": date
                })

            }
            if (indice >= x.length - 1) {
                date = moment(date).add(dateIncrease, 'days');
                date = moment(date).format('YYYY-MM-DD');
                routes["rotas"][routeName].push({
                    "origem": y,
                    "destino": origem,
                    "dia": date
                })
            }
            date = moment(date).add(dateIncrease, 'days');
            date = moment(date).format('YYYY-MM-DD');

            lastCity = y


        })

    })
    //console.log(JSON.stringify(routes, null, 4))

    return routes

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

module.exports = { generateRoutes }