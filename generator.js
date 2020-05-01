function generate() {
    let countOfArgs = getRandomInt(3);
    let countOfGroups = getRandomInt(Math.pow(2, countOfArgs));
    let formula = '';
    var variablesCodes = [ 'A', 'B', 'C'];


    for (i = 0; i < countOfGroups; i++) {
        let countOfArgsInParticualarGroup = countOfArgs - getRandomInt(countOfArgs) + 1;
        let group = '';

        if (countOfGroups !== 1 && i < countOfGroups - 1) {
            formula += '(';
        }

        for (j = 0; j < countOfArgsInParticualarGroup; j++) {
            if (countOfArgsInParticualarGroup !== 1 && j < countOfArgsInParticualarGroup - 1) {
                group += '(';
            }

            let isNegative = (Math.random() >= 0.5);
            group += (isNegative ? '(!' : '') + variablesCodes[j] + (isNegative ? ')' : '');
            if (j < countOfArgsInParticualarGroup - 1) {
                let random  = Math.random();
                group += ((random >= 0.2) ? '|' : (random >= 0.1 ? '&' : (random >= 0.05 ? '~' : '->')));
            }
        }

        for (j = 0; j < countOfArgsInParticualarGroup - 1; j++) {
            if (countOfArgsInParticualarGroup !== 1) {
                group += ')';
            }
        }

        formula += group;

        if (i < countOfGroups - 1) {
            let random  = Math.random();
            formula += ((random >= 0.3) ? '|' : (random >= 0.2 ? '&' : (random >= 0.1 ? '~' : '->')));
        }
    }

    for (j = 0; j < countOfGroups - 1; j++) {
        if (countOfGroups !== 1) {
            formula += ')';
        }
    }
    document.getElementById('formula').value = formula;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}