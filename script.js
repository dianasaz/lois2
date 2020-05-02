var symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '0'];
var operations = ['~', '->', '|', '&', '!'];
var constants = ['1', '0'];
var formula;
var table;
var variables;
var subFormulas;

function findInArray(array, temp) {
    for (var index = 0; index < array.length; index++) {
        if (array[index].toString() == temp.toString()) {
            return true;
        }
    }
    return false;
}

function getSubFormula(memory, priority) {
    var open = 0;
    var close = 0;
    var subFormula = '';

    for (var index = memory; index < formula.length; index++) {
        subFormula += formula[index];
        if (formula[index] == '(') {
            open++;
        }

        if (formula[index] == ')') {
            close++;
        }

        if (open == close) {
            if (findInArray(subFormulas, subFormula) == false) {
                var temp = new Array();
                temp.push(priority);
                temp.push(subFormula);
                subFormulas.push(temp);
            }
            return;
        }
    }
}

function findSubformulas() {
    var numOfOpen = 0;
    for (var index = 0; index < formula.length; index++) {
        if (formula[index] == '(') {
            numOfOpen++;
            getSubFormula(index, numOfOpen);
        }

        else if (formula[index] == ')') {
            numOfOpen--;
        }

        else if ((findInArray(symbols, formula[index]) || findInArray(constants, formula[index])) && !findInArray(variables, formula[index])) {
            variables.push(formula[index]);
        }
    }
}

function changeConstant(constant) {
    if (constant == 0) {
        return 1;
    }
    else {
        return 0;
    }
}

function calculateNumberOfVars() {
    var number = 0;
    for (var indexI = 0; indexI < variables.length; indexI++) {
        if (!findInArray(constants, variables[indexI])) {
            number++;
        }
    }
    return number;
}

function createTable() {
    var number = calculateNumberOfVars() - 1;
    var numberOfValues = number + 1;
    for (var indexI = variables.length - 1; indexI >= 0; indexI--) {
        var row = new Array();
        if (!findInArray(constants, variables[indexI])) {
            var changeConst = Math.pow(2, number);    //чередование 0 и 1 в ТИ 
            var constant = 0;
            for (var indexJ = 0; indexJ < Math.pow(2, numberOfValues); indexJ++) {
                row.push(constant);
                if ((indexJ + 1) % changeConst == 0) {
                    constant = changeConstant(constant);
                }
            }
            number--;
        } else {
            var constant;
            if (variables[indexI] == '1') {
                constant = 1;
            } else if (variables[indexI] == '0') {
                constant = 0;
            }

            for (var indexJ = 0; indexJ < Math.pow(2, numberOfValues); indexJ++) {
                row.push(constant);
            }
        }

        var field = new Array();
        field.push(variables[indexI]);
        field.push(row);
        table.push(field);
    }
}

function findIndexOfOperation(sub) {
    var open = 0;
    var close = 0;
    for (var index = 0; index < sub.length; index++) {
        if (open - close == 1) {
            if (findInArray(operations, sub[index])) {
                return index;
            }

            else if (sub[index] == '-' && sub[index + 1] == ">") {
                return index;
            }
        }

        if (sub[index] == "(") {
            open++;
        }

        if (sub[index] == ")") {
            close++;
        }
    }
}

function findCol(variable) {
    for (var index = 0; index < table.length; index++) {
        if (table[index][0] == variable) {
            return table[index][1];
        }

    }
}

function findLeftPart(sub, indexOfOperation) {
    var leftPart = "";
    for (var index = 1; index < indexOfOperation; index++) {
        leftPart += sub[index];
    }
    return leftPart;
}

function findRightPart(sub, indexOfOperation) {
    var begin = indexOfOperation + 1;
    var rightPart = "";
    if (sub[indexOfOperation] == "-") {
        begin++;
    }

    for (var index = begin; index < sub.length - 1; index++) {
        rightPart += sub[index];
    }

    return rightPart;
}

function mainCalculations() {
    for (var index = subFormulas.length - 1; index >= 0; index--) {
        var indexOfOperation = findIndexOfOperation(subFormulas[index][1]);
        var operation = subFormulas[index][1][indexOfOperation];

        if (operation == "-" && subFormulas[index][1][indexOfOperation + 1] == ">") {
            operation += ">";
        }

        var row = new Array();
        if (operation == "!") {
            var variable = findRightPart(subFormulas[index][1], indexOfOperation);
            var col = findCol(variable);
            for (var indexJ = 0; indexJ < col.length; indexJ++) {
                var value = changeConstant(col[indexJ]);
                row.push(value);
            }
            var field = new Array();
            field.push(subFormulas[index][1]);
            field.push(row);
            table.push(field);
        } else {
            var leftPart = findLeftPart(subFormulas[index][1], indexOfOperation);
            var rightPart = findRightPart(subFormulas[index][1], indexOfOperation);
            var colForLeftPart = findCol(leftPart);
            var colForRightPart = findCol(rightPart);
            var newCol = new Array();
            if (operation == "&") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            } else if (operation == "|") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if (colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) {
                        newCol.push(0);
                    }
                    else {
                        newCol.push(1);
                    }
                }
            } else if (operation == "~") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if ((colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) || (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1)) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            } else if (operation == "->") {
                for (var indexI = 0; indexI < colForLeftPart.length; indexI++) {
                    if ((colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 0) || (colForLeftPart[indexI] == 0 && colForRightPart[indexI] == 1) || (colForLeftPart[indexI] == 1 && colForRightPart[indexI] == 1)) {
                        newCol.push(1);
                    }
                    else {
                        newCol.push(0);
                    }
                }
            }
            var newField = new Array();
            newField.push(subFormulas[index][1]);
            newField.push(newCol);
            table.push(newField);
        }
    }
}

function  getArrayWithLiteral(input) {
    let arrayWithLiteral = [];
    for (let index = 0; index < formula.length; index++) {
        let str = formula[index];
        if (str.match(/[A-Z]/) !== null && !arrayWithLiteral.includes(str)) {
            arrayWithLiteral.push(str);
        }
    }
    return arrayWithLiteral;
}

function renderTable(input, table, subFormulas) {
    let arrayWithLiteral = getArrayWithLiteral(input.value);
    let countRow = Math.pow(2, arrayWithLiteral.length);
    let tr = "<tr>";

    let size = Math.pow(2, variables.length);
    let innerHTML = "<thead>";
    
    innerHTML += "</thead>";
    innerHTML += "<tbody>";
    innerHTML += tr;
    for (let i = 0; i < table.length; i++) {
        let row = table[i];
        let rowTr = "<tr>";
        for (var index = 0; index < row.length; index++) {
            let val = row[index];
            rowTr += "<td>" + val + "</td>"
        }
        rowTr += "</tr>";
        innerHTML += rowTr;
    } 
    innerHTML += "</tbody>";
    document.getElementById("table").innerHTML = innerHTML;
}

function isNeitral() {
    let isFalse = false;
    let isTrue = false;
    var lastCol = table.length - 1;
    for (var index = 0; index < table[lastCol][1].length; index++) {
        if (table[lastCol][1][index] == 0) {
            isFalse = true;
        }
        if (table[lastCol][1][index] == 1) {
            isTrue = true;
        }
    }
    return (isTrue && isFalse);
}

function start() {
    var input = document.getElementById("formula").value;
    let choice = document.getElementById('chooseIfSDNF').value;
    let choiceAnswer = document.getElementById('choiceAnswer');
    let answer = document.getElementById('answer');
    subFormulas = new Array();
    variables = new Array();
    table = new Array();

    if (input == "" || input.Empty) {
        alert("Empty field! Please, enter a formula!")
        return;
    }

    var message;

    if (checkWithRegularExpressionFormula(input)) {

        formula = input;

        findSubformulas();
        createTable();
        mainCalculations();
            
        if (isNeitral()) {
            message = "Формула является нейтральной."
            if (choice == 0) {
                choiceAnswer.innerHTML = "Вы не правы";
            } else choiceAnswer.innerHTML = "Вы правы";
        } else {
            message = "Не нейтральная формула."
            if (choice == 1) {
                choiceAnswer.innerHTML = "Вы не правы";
            } else choiceAnswer.innerHTML = "Вы правы";
        }
        
        answer.innerHTML = message;

        renderTable(input, table, subFormulas);
    
    } else {
        answer.innerHTML = "Не формула";
    }

}

function checkWithRegularExpressionFormula(formula) {
    const FORMULA_REGEXP = new RegExp('([(]([A-Z]|[0-1])((->)|(&)|(\\|)|(~))([A-Z]|[0-1])[)])|([(][!]([A-Z]|[0-1])[)])|([A-Z])|([0-1])','g');
    let form = formula;

    if (form.length == 1 && form.match(/[A-Z]|[0-1]/)) {
        return true;
    } else {
        while (true) {
            let initLength = form.length;
            form = form.replace(FORMULA_REGEXP, '1')
            if (form.length === initLength) {
                break;
            }
        }
        if ((form.length === 1) && (form.match(/1/))) {
            return true;
        } else {
            return false;
        }
    }
}