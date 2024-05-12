var X_UPPER_BOUND = 15;
var Y_UPPER_BOUND = 20;
var X_LOWER_BOUND = -15;
var Y_LOWER_BOUND = -25;
var NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED = 10;
var NUMBER_OF_CHILDS_TO_BE_GENERATED = 10;
var individuals = [];
var newIndividuals = [];
var avgFitnessOfEachGeneration = [];
var fittestIndividualsOfEachGeneration = [];
var Individual = /** @class */ (function () {
    function Individual(x, y, fitness) {
        this.x = x;
        this.y = y;
        this.fitness = fitness;
    }
    return Individual;
}());
var EvolutionaryAlgorithm = /** @class */ (function () {
    function EvolutionaryAlgorithm() {
    }
    EvolutionaryAlgorithm.prototype.runAlgorithm = function () {
        this.initializeIndividuals();
        while (true) {
            console.log("YES");
            individuals.sort(function (a, b) { return b.fitness - a.fitness; }); // Sort individuals by fitness
            fittestIndividualsOfEachGeneration.push(individuals[0]); // Store the fittest individual of this generation
            avgFitnessOfEachGeneration.push(this.calculateAverageFitness(individuals)); // Calculate and store the average fitness
            if (avgFitnessOfEachGeneration.length >= 10 && this.isStoppingCriteriaSatisfied()) {
                console.log("Stopping criteria satisfied.");
                break;
            }
            newIndividuals = [];
            while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
                var parent1 = individuals[Math.floor(Math.random() * individuals.length)];
                var parent2 = individuals[Math.floor(Math.random() * individuals.length)];
                var child = this.reproduce(parent1, parent2);
                newIndividuals.push(child);
            }
            individuals = individuals.concat(newIndividuals).slice(0, NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED);
        }
        console.log("Fittest individuals of each generation:");
        fittestIndividualsOfEachGeneration.forEach(function (individual, index) { return console.log("Generation ".concat(index + 1, ": ").concat(individual.x, ", ").concat(individual.y, ", Fitness: ").concat(individual.fitness)); });
        console.log("Average fitness of each generation:", avgFitnessOfEachGeneration);
    };
    EvolutionaryAlgorithm.prototype.initializeIndividuals = function () {
        for (var i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
            var x = this.randomNumberBetween(X_LOWER_BOUND, X_UPPER_BOUND);
            var y = this.randomNumberBetween(Y_LOWER_BOUND, Y_UPPER_BOUND);
            var fitness = this.calculateFitness(x, y);
            individuals.push(new Individual(x, y, fitness));
        }
    };
    EvolutionaryAlgorithm.prototype.reproduce = function (parent1, parent2) {
        var childX = (parent1.x + parent2.x) / 2;
        var childY = (parent1.y + parent2.y) / 2;
        var childFitness = this.calculateFitness(childX, childY);
        return new Individual(childX, childY, childFitness);
    };
    EvolutionaryAlgorithm.prototype.calculateFitness = function (x, y) {
        return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
    };
    EvolutionaryAlgorithm.prototype.calculateAverageFitness = function (individuals) {
        var totalFitness = individuals.reduce(function (acc, individual) { return acc + individual.fitness; }, 0);
        return totalFitness / individuals.length;
    };
    EvolutionaryAlgorithm.prototype.isStoppingCriteriaSatisfied = function () {
        var lastTenGenerationsAvgFitness = avgFitnessOfEachGeneration.slice(-10);
        var differences = lastTenGenerationsAvgFitness.slice(1).map(function (avgFitness, index) { return Math.abs(avgFitness - lastTenGenerationsAvgFitness[index]); });
        return differences.every(function (diff) { return diff <= 0.001; });
    };
    EvolutionaryAlgorithm.prototype.randomNumberBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return EvolutionaryAlgorithm;
}());
var evolutionaryAlgorithm = new EvolutionaryAlgorithm();
evolutionaryAlgorithm.runAlgorithm();
