"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
var readline = require("readline");
var crypto = require("crypto");
var EvolutionaryAlgorithmKnapSack = /** @class */ (function () {
    function EvolutionaryAlgorithmKnapSack() {
    }
    EvolutionaryAlgorithmKnapSack.prototype.runAlgo = function () {
        this.setItemsToBeSelectedForKnapSack();
        this.initializeIndividuals();
        this.sortIndividuals(EvolutionaryAlgorithmKnapSack.individuals);
        console.log("Starting gen: " + EvolutionaryAlgorithmKnapSack.individuals);
        EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithmKnapSack.individuals[0]);
        EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithmKnapSack.individuals));
        while (true) {
            while (EvolutionaryAlgorithmKnapSack.newIndividuals.length < EvolutionaryAlgorithmKnapSack.noOfChildrenToBeGenerated) {
                var individual1 = EvolutionaryAlgorithmKnapSack.individuals[this.generateRandomIndexForSelectingIndividual()];
                var indexForSecondParent = this.generateRandomIndexForSelectingIndividual();
                var individual2 = EvolutionaryAlgorithmKnapSack.individuals[indexForSecondParent];
                if (individual1.equals(individual2))
                    individual2 = EvolutionaryAlgorithmKnapSack.individuals[(indexForSecondParent + 1) % 10];
                this.reproduce(individual1, individual2);
            }
            var parentAndChildren = __spreadArray(__spreadArray([], EvolutionaryAlgorithmKnapSack.individuals, true), EvolutionaryAlgorithmKnapSack.newIndividuals, true);
            this.sortIndividuals(parentAndChildren);
            EvolutionaryAlgorithmKnapSack.selectedItems = parentAndChildren.slice(0, EvolutionaryAlgorithmKnapSack.noOfIndividualsToBeSelected);
            EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithmKnapSack.selectedItems[0]);
            console.log("Selected New Individuals: " + EvolutionaryAlgorithmKnapSack.selectedItems);
            console.log("Avg fitness Individuals: " + EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration);
            EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithmKnapSack.selectedItems));
            if (EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }
            EvolutionaryAlgorithmKnapSack.individuals = EvolutionaryAlgorithmKnapSack.selectedItems;
            EvolutionaryAlgorithmKnapSack.newIndividuals = [];
        }
        console.log("Fittest indv of each gen " + EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration);
        console.log("Avg fitness of each gen " + EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration);
        // Specify the file path
        var filePath = "fitness_data.txt";
        try {
            var writer = fs.createWriteStream(filePath);
            for (var _i = 0, _a = EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration; _i < _a.length; _i++) {
                var data = _a[_i];
                writer.write("".concat(data.calculateTotalWeight().toFixed(6), " ").concat(data.calculateTotalWorth().toFixed(6), "\n"));
            }
            console.log("Objects saved to file successfully.");
            writer.close();
        }
        catch (err) {
            console.error(err);
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.assignDifferentParent = function (individual1) {
        var individual2 = EvolutionaryAlgorithmKnapSack.individuals[(this.generateRandomIndexForSelectingIndividual() + 1) % 10];
        if (individual1.equals(individual2)) {
            console.log("Same parents" + individual2);
            return this.assignDifferentParent(individual1);
        }
        return individual2;
    };
    EvolutionaryAlgorithmKnapSack.loadFromFile = function () {
        try {
            var data = fs.readFileSync("fitness_data.txt", 'utf8').split('\n');
            var individuals = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var line = data_1[_i];
                var _a = line.split(' ').map(Number), weight = _a[0], worth = _a[1];
                individuals.push(new Individual(weight, worth));
            }
            return individuals;
        }
        catch (err) {
            console.error(err);
            return [];
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.readItems = function (fileName) {
        var items = [];
        var capacity = 0;
        var rl = readline.createInterface({
            input: fs.createReadStream(fileName),
            crlfDelay: Infinity
        });
        rl.on('line', function (line) {
            var parts = line.split(/\s+/);
            if (parts.length === 2) {
                var weight = parseFloat(parts[0]);
                var worth = parseFloat(parts[1]);
                items.push(new Item(weight, worth));
            }
            else if (parts.length === 1) {
                EvolutionaryAlgorithmKnapSack.maxWeightLimit = parseFloat(parts[0]);
            }
        });
        rl.on('close', function () {
            EvolutionaryAlgorithmKnapSack.availableItems = items;
        });
    };
    EvolutionaryAlgorithmKnapSack.prototype.reproduce = function (individual1, individual2) {
        var newChildrenPair = this.doUniformCrossOver(individual1, individual2);
        var randomValue = this.allowMutationBasedOnRandomNumber();
        if (newChildrenPair !== null) {
            if (randomValue !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[0]);
            }
            randomValue = this.allowMutationBasedOnRandomNumber();
            if (randomValue !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[1]);
            }
            EvolutionaryAlgorithmKnapSack.newIndividuals.push(newChildrenPair[0]);
            EvolutionaryAlgorithmKnapSack.newIndividuals.push(newChildrenPair[1]);
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.doNPointCossOver = function (individual1, individual2) {
        var newIndividual1 = new Individual();
        for (var i = 0; i < individual1.pickedItems.length; i++) {
            if (i % 2 === 0)
                newIndividual1.pickedItems.push(individual1.pickedItems[i]);
            else
                newIndividual1.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual1)) {
                return null;
            }
        }
        var newIndividual2 = new Individual();
        for (var i = 0; i < individual2.pickedItems.length; i++) {
            if (i % 2 === 0)
                newIndividual2.pickedItems.push(individual2.pickedItems[i]);
            else
                newIndividual2.pickedItems.push(individual1.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual2)) {
                return null;
            }
        }
        return [newIndividual1, newIndividual2];
    };
    EvolutionaryAlgorithmKnapSack.prototype.doUniformCrossOver = function (individual1, individual2) {
        var newIndividual1 = new Individual();
        var random;
        for (var i = 0; i < individual1.pickedItems.length; i++) {
            random = this.generateRandomDoubleForUniformCrossover();
            if (random >= 0 && random <= 0.5)
                newIndividual1.pickedItems.push(individual1.pickedItems[i]);
            else if (random > 0.5 && random <= 1)
                newIndividual1.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual1)) {
                return null;
            }
        }
        var newIndividual2 = new Individual();
        for (var i = 0; i < individual1.pickedItems.length; i++) {
            random = this.generateRandomDoubleForUniformCrossover();
            if (random >= 0 && random <= 0.5)
                newIndividual2.pickedItems.push(individual1.pickedItems[i]);
            else if (random > 0.5 && random <= 1)
                newIndividual2.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual2)) {
                return null;
            }
        }
        return [newIndividual1, newIndividual2];
    };
    EvolutionaryAlgorithmKnapSack.prototype.doMutationBitFlip = function (randomValue, individual) {
        var random = this.generateRandomIndexForSelectingIndividual();
        if (randomValue > 50) {
            individual.pickedItems[random] = true;
            if (!this.isElementWithinLimits(individual))
                individual.pickedItems[random] = false;
        }
        else {
            individual.pickedItems[random] = false;
            if (!this.isElementWithinLimits(individual))
                individual.pickedItems[random] = true;
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.doMutationBitsSwap = function (randomValue, individual) {
        var random1 = this.generateRandomIndexForSelectingIndividual();
        var random2 = this.generateRandomIndexForSelectingIndividual();
        var bitAtRandom1 = individual.pickedItems[random1];
        var bitAtRandom2 = individual.pickedItems[random2];
        individual.pickedItems[random1] = bitAtRandom2;
        individual.pickedItems[random2] = bitAtRandom1;
        if (!this.isElementWithinLimits(individual)) {
            individual.pickedItems[random1] = bitAtRandom1;
            individual.pickedItems[random2] = bitAtRandom2;
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.generateRandomIndexForSelectingIndividual = function () {
        return crypto.randomInt(0, 10);
    };
    EvolutionaryAlgorithmKnapSack.prototype.generateRandomDoubleForUniformCrossover = function () {
        var randomBytes = crypto.randomBytes(4); // 4 bytes for a 32-bit float
        var float = randomBytes.readUInt32LE(0) / 0xffffffff; // Convert bytes to a float between 0 and 1
        return float * 1.00001; // Scale to range [0, 1.00001)
    };
    EvolutionaryAlgorithmKnapSack.prototype.allowMutationBasedOnRandomNumber = function () {
        var randomNumber = crypto.randomInt(1, 401);
        if (randomNumber >= 1 && randomNumber <= 100)
            return randomNumber;
        else
            return -1;
    };
    EvolutionaryAlgorithmKnapSack.prototype.isElementWithinLimits = function (individual) {
        return individual.calculateTotalWeight() <= EvolutionaryAlgorithmKnapSack.maxWeightLimit;
    };
    EvolutionaryAlgorithmKnapSack.prototype.calculateAverage = function (individuals) {
        var sumOfIndividualsFitness = individuals.reduce(function (sum, indv) { return sum + indv.calculateTotalWorth(); }, 0);
        return sumOfIndividualsFitness / individuals.length;
    };
    EvolutionaryAlgorithmKnapSack.prototype.initializeIndividuals = function () {
        for (var i = 0; i < EvolutionaryAlgorithmKnapSack.noOfIndividualsToBeSelected; i++) {
            EvolutionaryAlgorithmKnapSack.individuals.push(this.initializeIndividual());
        }
    };
    EvolutionaryAlgorithmKnapSack.prototype.initializeIndividual = function () {
        var individual = new Individual();
        var random = crypto.randomBytes(EvolutionaryAlgorithmKnapSack.availableItems.length);
        for (var i = 0; i < EvolutionaryAlgorithmKnapSack.availableItems.length; i++) {
            individual.pickedItems.push(random[i] % 2 === 0);
            if (!this.isElementWithinLimits(individual))
                individual.pickedItems[i] = false;
        }
        return individual;
    };
    EvolutionaryAlgorithmKnapSack.prototype.isStoppingCriteria2Satisfied = function () {
        var startIndex = EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length - 10;
        for (; startIndex < EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration[startIndex] - EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001)
                return false;
        }
        return true;
    };
    EvolutionaryAlgorithmKnapSack.prototype.sortIndividuals = function (individuals) {
        individuals.sort(function (a, b) { return b.compareTo(a); });
    };
    EvolutionaryAlgorithmKnapSack.prototype.setItemsToBeSelectedForKnapSack = function () {
        this.readItems("D:/AI-CI/problem.txt");
    };
    EvolutionaryAlgorithmKnapSack.noOfChildrenToBeGenerated = 10;
    EvolutionaryAlgorithmKnapSack.noOfIndividualsToBeSelected = 10;
    EvolutionaryAlgorithmKnapSack.individuals = [];
    EvolutionaryAlgorithmKnapSack.availableItems = [];
    EvolutionaryAlgorithmKnapSack.newIndividuals = [];
    EvolutionaryAlgorithmKnapSack.selectedItems = [];
    EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration = [];
    EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration = [];
    EvolutionaryAlgorithmKnapSack.maxWeightLimit = 18;
    return EvolutionaryAlgorithmKnapSack;
}());
var Individual = /** @class */ (function () {
    function Individual(weight, worth) {
        if (weight === void 0) { weight = 0; }
        if (worth === void 0) { worth = 0; }
        this.pickedItems = [];
        this.weight = weight;
        this.worth = worth;
    }
    Individual.prototype.compareTo = function (other) {
        return this.calculateTotalWorth() - other.calculateTotalWorth();
    };
    Individual.prototype.equals = function (obj) {
        if (this === obj)
            return true;
        if (obj == null || !(obj instanceof Individual))
            return false;
        var individual = obj;
        return this.pickedItems.every(function (val, index) { return val === individual.pickedItems[index]; });
    };
    Individual.prototype.hashCode = function () {
        return crypto.createHash('sha256').update(this.worth.toString()).digest('base64').length;
    };
    Individual.prototype.toString = function () {
        return "{ Selected bits: ".concat(this.pickedItems, " weight : ").concat(this.calculateTotalWeight(), " Worth is: ").concat(this.calculateTotalWorth(), " } \n");
    };
    Individual.prototype.calculateTotalWorth = function () {
        var _a;
        var worth = 0.0;
        for (var i = 0; i < this.pickedItems.length; i++) {
            if (this.pickedItems[i])
                worth += (_a = EvolutionaryAlgorithmKnapSack.availableItems[i]) === null || _a === void 0 ? void 0 : _a.worth;
        }
        return worth;
    };
    Individual.prototype.calculateTotalWeight = function () {
        var _a;
        var weight = 0.0;
        for (var i = 0; i < this.pickedItems.length; i++) {
            if (this.pickedItems[i])
                weight += (_a = EvolutionaryAlgorithmKnapSack.availableItems[i]) === null || _a === void 0 ? void 0 : _a.weight;
        }
        return weight;
    };
    return Individual;
}());
var Item = /** @class */ (function () {
    function Item(weight, worth) {
        if (weight === void 0) { weight = 0; }
        if (worth === void 0) { worth = 0; }
        this.weight = weight;
        this.worth = worth;
    }
    Item.prototype.compareTo = function (other) {
        return this.worth - other.worth;
    };
    Item.prototype.equals = function (obj) {
        if (this === obj)
            return true;
        if (obj == null || !(obj instanceof Item))
            return false;
        var item = obj;
        return this.weight === item.weight && this.worth === item.worth;
    };
    Item.prototype.hashCode = function () {
        return crypto.createHash('sha256').update(this.worth.toString()).digest('base64').length;
    };
    Item.prototype.toString = function () {
        return "{ weight : ".concat(this.weight, " Worth is: ").concat(this.worth, " } \n");
    };
    return Item;
}());
var evolutionaryAlgorithm = new EvolutionaryAlgorithmKnapSack();
evolutionaryAlgorithm.runAlgo();
