var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var X_UPPER_BOUND = 15;
var Y_UPPER_BOUND = 20;
var X_LOWER_BOUND = -15;
var Y_LOWER_BOUND = -25;
var NUMBER_OF_CHILDS_TO_BE_GENERATED = 10;
var NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED = 10;
var individuals = [];
var newIndividuals = [];
var avgFitnesstOfEachGeneration = [];
var fittestIndividualsOfEachGeneration = [];
var Individual = /** @class */ (function () {
    function Individual(x, y, fitness) {
        this.x = x;
        this.y = y;
        this.fitness = fitness;
        this.rank = null;
    }
    return Individual;
}());
var RankBasedEvolutionaryAlgorithm = /** @class */ (function () {
    function RankBasedEvolutionaryAlgorithm() {
    }
    RankBasedEvolutionaryAlgorithm.prototype.runAlgo = function () {
        // Initializing Individuals
        this.initializeIndividuals();
        // Sorting individuals on basis of fitness
        this.sortIndividuals(individuals);
        // Give ranks to individuals
        this.giveRankOnBasisOfFitness(individuals);
        fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
        // Saving extra information of average fitness of every generation
        avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));
        while (true) {
            // Giving ranks to each individual on basis of fitness
            this.giveRankOnBasisOfFitness(individuals);
            while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
                // Select individuals for reproduction based on rank
                var individual1 = this.selectByRank(individuals);
                var individual2 = this.selectByRank(individuals);
                if (individual1 === individual2) // Check if the same individual is selected
                    individual2 = this.selectByRank(individuals);
                this.reproduceOneChild(individual1, individual2);
            }
            // Combine current individuals with new individuals
            var parentAndChildren = __spreadArray(__spreadArray([], individuals, true), newIndividuals, true);
            // Sort the combined array based on fitness
            parentAndChildren.sort(function (a, b) { return b.fitness - a.fitness; });
            // Select top individuals for the next generation
            individuals = parentAndChildren.slice(0, NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED);
            fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
            // Calculate and save the average fitness of the current generation
            avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));
            // Check stopping criteria
            if (avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }
            newIndividuals = [];
        }
        // console.log("Fittest indv of each Generation: ");
        // fittestIndividualsOfEachGeneration.forEach(fittestIndividual => console.log(fittestIndividual));
        console.log("*****************************************************");
        console.log("Avg fitness of each gen " + avgFitnesstOfEachGeneration);
    };
    RankBasedEvolutionaryAlgorithm.prototype.selectByRank = function (individuals) {
        // Calculate total ranks
        var totalRanks = individuals.reduce(function (sumOfTotalRank, individual) { return sumOfTotalRank + individual.fitness + sumOfTotalRank; }, 0);
        // Generate a random number between 1 and totalRanks
        var randomNumber = Math.random() * totalRanks;
        var sum = 0;
        var selectedIndividual = null;
        // Iterate through individuals and find the one corresponding to the random rank
        for (var _i = 0, individuals_1 = individuals; _i < individuals_1.length; _i++) {
            var individual = individuals_1[_i];
            // Calculate selection probability for the current individual
            var selectionProbability = individual.rank / totalRanks;
            sum += selectionProbability;
            if (sum >= randomNumber) {
                selectedIndividual = individual;
                break; // Exit loop once an individual is selected
            }
        }
        // Return the selected individual
        return selectedIndividual || individuals[individuals.length - 1]; // Fallback to last individual
    };
    RankBasedEvolutionaryAlgorithm.prototype.isStoppingCriteria2Satisfied = function () {
        var startIndex = avgFitnesstOfEachGeneration.length - 10; // so that we always start with the last 10
        for (; startIndex < avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(avgFitnesstOfEachGeneration[startIndex] - avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001)
                return false;
        }
        return true;
    };
    RankBasedEvolutionaryAlgorithm.prototype.reproduceOneChild = function (individual1, individual2) {
        var newChild = this.doCrossOverOneChild(individual1, individual2);
        var randomValue = this.allowMutationBasedOnRandomNumber();
        if (randomValue !== -1)
            this.doMutation(randomValue, newChild);
        newIndividuals.push(newChild);
    };
    RankBasedEvolutionaryAlgorithm.prototype.doCrossOverOneChild = function (individual1, individual2) {
        var newChildX = (individual1.x + individual2.x) / 2;
        var newChildY = (individual1.y + individual2.y) / 2;
        var fitness = this.calculateFitness(newChildX, newChildY);
        return new Individual(individual1.x, individual2.y, fitness);
    };
    RankBasedEvolutionaryAlgorithm.prototype.allowMutationBasedOnRandomNumber = function () {
        var randomNumber = Math.floor(Math.random() * 400) + 1;
        if (randomNumber >= 1 && randomNumber <= 100)
            return randomNumber;
        else
            return -1;
    };
    RankBasedEvolutionaryAlgorithm.prototype.doMutation = function (randomValue, individual) {
        if (randomValue > 50) {
            if (randomValue % 2 === 0) {
                individual.x = this.resetBoundary(individual.x, X_LOWER_BOUND, X_UPPER_BOUND);
            }
            else {
                individual.x = this.resetBoundary(individual.x, X_LOWER_BOUND, X_UPPER_BOUND);
            }
        }
        else {
            if (randomValue % 2 === 0) {
                individual.y = this.resetBoundary(individual.y, Y_LOWER_BOUND, Y_UPPER_BOUND);
            }
            else {
                individual.y = this.resetBoundary(individual.y, Y_LOWER_BOUND, Y_UPPER_BOUND);
            }
        }
    };
    RankBasedEvolutionaryAlgorithm.prototype.resetBoundary = function (elementToBeChecked, lowerBoundary, upperBoundary) {
        if (elementToBeChecked < lowerBoundary)
            return lowerBoundary;
        else if (elementToBeChecked > upperBoundary)
            return upperBoundary;
        return elementToBeChecked;
    };
    RankBasedEvolutionaryAlgorithm.prototype.initializeIndividuals = function () {
        for (var i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
            var x = this.randomNumberBetween(X_LOWER_BOUND, X_UPPER_BOUND);
            var y = this.randomNumberBetween(Y_LOWER_BOUND, Y_UPPER_BOUND);
            var fitness = this.calculateFitness(x, y);
            individuals.push(new Individual(x, y, fitness));
        }
    };
    RankBasedEvolutionaryAlgorithm.prototype.randomNumberBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    RankBasedEvolutionaryAlgorithm.prototype.calculateFitness = function (x, y) {
        return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
    };
    RankBasedEvolutionaryAlgorithm.prototype.sortIndividuals = function (individuals) {
        individuals.sort(function (a, b) { return a.fitness - b.fitness; });
    };
    RankBasedEvolutionaryAlgorithm.prototype.calculateAverage = function (individuals) {
        var sum = 0;
        for (var _i = 0, individuals_2 = individuals; _i < individuals_2.length; _i++) {
            var individual = individuals_2[_i];
            sum += individual.fitness;
        }
        return sum / individuals.length;
    };
    RankBasedEvolutionaryAlgorithm.prototype.giveRankOnBasisOfFitness = function (individuals) {
        var rank = 1;
        individuals.forEach(function (individual) {
            individual.rank = rank;
            rank++;
        });
    };
    return RankBasedEvolutionaryAlgorithm;
}());
var rankBasedEvolutionaryAlgorithm = new RankBasedEvolutionaryAlgorithm();
rankBasedEvolutionaryAlgorithm.runAlgo();
