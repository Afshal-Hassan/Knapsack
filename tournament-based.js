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
    }
    return Individual;
}());
var TournamentBasedEvolutionaryAlgorithm = /** @class */ (function () {
    function TournamentBasedEvolutionaryAlgorithm(tournamentSize) {
        this.tournamentSize = tournamentSize;
    }
    TournamentBasedEvolutionaryAlgorithm.prototype.runAlgo = function () {
        this.initializeIndividuals();
        this.sortIndividuals(individuals);
        fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
        avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));
        while (true) {
            while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
                var individual1 = this.selectByTournament(individuals);
                var individual2 = this.selectByTournament(individuals);
                this.reproduceOneChild(individual1, individual2);
            }
            var parentAndChildren = __spreadArray(__spreadArray([], individuals, true), newIndividuals, true);
            this.sortIndividuals(parentAndChildren);
            individuals = parentAndChildren.slice(0, NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED);
            fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
            avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));
            if (avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }
            newIndividuals = [];
        }
        console.log("Fittest indv of each Generation: ");
        fittestIndividualsOfEachGeneration.forEach(function (fittestIndividual) { return console.log(fittestIndividual); });
        console.log("\n\n*****************************************************");
        console.log("\nAvg fitness of each gen \n\n" + avgFitnesstOfEachGeneration);
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.selectByTournament = function (individuals) {
        var tournamentParticipants = [];
        while (tournamentParticipants.length < this.tournamentSize) {
            var randomIndex = Math.floor(Math.random() * individuals.length);
            tournamentParticipants.push(individuals[randomIndex]);
        }
        tournamentParticipants.sort(function (a, b) { return b.fitness - a.fitness; });
        return tournamentParticipants[0];
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.isStoppingCriteria2Satisfied = function () {
        var startIndex = avgFitnesstOfEachGeneration.length - 10;
        for (; startIndex < avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(avgFitnesstOfEachGeneration[startIndex] - avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) {
                return false;
            }
        }
        return true;
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.reproduceOneChild = function (individual1, individual2) {
        var newChild = this.doCrossover(individual1, individual2);
        var randomValue = this.allowMutationBasedOnRandomNumber();
        if (randomValue !== -1) {
            this.doMutation(randomValue, newChild);
        }
        newIndividuals.push(newChild);
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.doCrossover = function (individual1, individual2) {
        var newChildX = (individual1.x + individual2.x) / 2;
        var newChildY = (individual1.y + individual2.y) / 2;
        var fitness = this.calculateFitness(newChildX, newChildY);
        return new Individual(newChildX, newChildY, fitness);
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.allowMutationBasedOnRandomNumber = function () {
        var randomNumber = Math.floor(Math.random() * 400) + 1;
        return randomNumber >= 1 && randomNumber <= 100 ? randomNumber : -1;
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.doMutation = function (randomValue, individual) {
        if (randomValue > 50) {
            individual.x = this.resetBoundary(individual.x, -15, 15);
        }
        else {
            individual.y = this.resetBoundary(individual.y, -25, 20);
        }
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.resetBoundary = function (elementToBeChecked, lowerBoundary, upperBoundary) {
        if (elementToBeChecked < lowerBoundary)
            return lowerBoundary;
        if (elementToBeChecked > upperBoundary)
            return upperBoundary;
        return elementToBeChecked;
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.initializeIndividuals = function () {
        for (var i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
            var x = this.randomNumberBetween(-15, 15);
            var y = this.randomNumberBetween(-25, 20);
            var fitness = this.calculateFitness(x, y);
            individuals.push(new Individual(x, y, fitness));
        }
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.randomNumberBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.calculateFitness = function (x, y) {
        return 100 - Math.pow((x - 7 * y), 2) - Math.pow((x + y - 11), 2);
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.sortIndividuals = function (individuals) {
        individuals.sort(function (a, b) { return a.fitness - b.fitness; });
    };
    TournamentBasedEvolutionaryAlgorithm.prototype.calculateAverage = function (individuals) {
        var sum = individuals.reduce(function (total, individual) { return total + individual.fitness; }, 0);
        return sum / individuals.length;
    };
    return TournamentBasedEvolutionaryAlgorithm;
}());
var tournamentBasedEvolutionaryAlgorithm = new TournamentBasedEvolutionaryAlgorithm(3);
tournamentBasedEvolutionaryAlgorithm.runAlgo();
