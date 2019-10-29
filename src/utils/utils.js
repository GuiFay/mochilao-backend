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

module.exports = { getPermutations, listToMatrix, teste }