var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var EvolutionaryAlgorithm = /** @class */ (function () {
    function EvolutionaryAlgorithm() {
    }
    EvolutionaryAlgorithm.prototype.runAlgo = function () {
        this.initializeIndividuals();
        this.sortIndividuals(EvolutionaryAlgorithm.individuals);
        console.log("Starting gen: " + EvolutionaryAlgorithm.individuals);
        EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithm.individuals[0]);
        EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithm.individuals));
        while (true) {
            if (this.hasNegativeFitness(EvolutionaryAlgorithm.individuals))
                this.makeFitnessPositive(EvolutionaryAlgorithm.individuals);
            this.addFitnessProportionOfEachIndv(EvolutionaryAlgorithm.individuals);
            this.addCommulativeFitnessProportionOfEachIndv(EvolutionaryAlgorithm.individuals);
            while (EvolutionaryAlgorithm.newIndividuals.length < EvolutionaryAlgorithm.noOfChildsToBeGenerated) {
                var individual1 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);
                var individual2 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);
                if (individual1.equals(individual2))
                    individual2 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);
                this.reproduceOneChild(individual1, individual2);
            }
            var parentAndChildren = __spreadArray(__spreadArray([], EvolutionaryAlgorithm.individuals, true), EvolutionaryAlgorithm.newIndividuals, true);
            this.sortIndividuals(parentAndChildren);
            EvolutionaryAlgorithm.selectedIndividuals = parentAndChildren.slice(0, EvolutionaryAlgorithm.noOfIndividualsToBeSelected);
            EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithm.selectedIndividuals[0]);
            EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithm.selectedIndividuals));
            if (EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }
            EvolutionaryAlgorithm.individuals = EvolutionaryAlgorithm.selectedIndividuals;
            EvolutionaryAlgorithm.newIndividuals = [];
        }
        console.log("Fittest indv of each gen " + EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration);
        console.log("Avg fitness of each gen " + EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration);
        // Write to file implementation goes here...
    };
    EvolutionaryAlgorithm.prototype.reproduceOneChild = function (individual1, individual2) {
        var newChild = this.doCrossOverOneChild(individual1, individual2);
        var randomValue = this.allowMutationBasedOnRandomNumber();
        if (randomValue !== -1)
            this.doMutation(randomValue, newChild);
        EvolutionaryAlgorithm.newIndividuals.push(newChild);
    };
    EvolutionaryAlgorithm.prototype.doCrossOverOneChild = function (individual1, individual2) {
        var newChildX = (individual1.x + individual2.x) / 2;
        var newChildY = (individual1.y + individual2.y) / 2;
        var fitness = this.calculateFitness(newChildX, newChildY);
        return new Individual(individual1.x, individual2.y, fitness);
    };
    EvolutionaryAlgorithm.prototype.allowMutationBasedOnRandomNumber = function () {
        var randomNumber = Math.floor(Math.random() * 400) + 1;
        if (randomNumber >= 1 && randomNumber <= 100)
            return randomNumber;
        else
            return -1;
    };
    EvolutionaryAlgorithm.prototype.doMutation = function (randomValue, individual) {
        if (randomValue > 50) { // mutate x
            if (randomValue % 2 === 0) { // if even, +ve update
                individual.x += EvolutionaryAlgorithm.stepSize;
                individual.x = this.reSetBoundary(individual.x, EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
            }
            else { // odd -> -ve update
                individual.x -= EvolutionaryAlgorithm.stepSize;
                individual.x = this.reSetBoundary(individual.x, EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
            }
        }
        else { // mutate y
            if (randomValue % 2 === 0) { // if even, +ve update
                individual.y += EvolutionaryAlgorithm.stepSize;
                individual.y = this.reSetBoundary(individual.y, EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
            }
            else { // odd -> -ve update
                individual.y -= EvolutionaryAlgorithm.stepSize;
                individual.y = this.reSetBoundary(individual.y, EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
            }
        }
    };
    EvolutionaryAlgorithm.prototype.reSetBoundary = function (elementToBeChecked, lowerBoundary, upperBoundary) {
        if (elementToBeChecked < lowerBoundary)
            return lowerBoundary;
        else if (elementToBeChecked > upperBoundary)
            return upperBoundary;
        return elementToBeChecked;
    };
    EvolutionaryAlgorithm.prototype.calculateFitness = function (x, y) {
        return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
    };
    EvolutionaryAlgorithm.prototype.hasNegativeFitness = function (individuals) {
        for (var _i = 0, individuals_1 = individuals; _i < individuals_1.length; _i++) {
            var individual = individuals_1[_i];
            if (individual.fitness < 0) {
                return true;
            }
        }
        return false;
    };
    EvolutionaryAlgorithm.prototype.makeFitnessPositive = function (individuals) {
        for (var _i = 0, individuals_2 = individuals; _i < individuals_2.length; _i++) {
            var individual = individuals_2[_i];
            individual.fitness += Math.abs(Math.min(0, Math.min(individual.x, individual.y)));
        }
    };
    EvolutionaryAlgorithm.prototype.addFitnessProportionOfEachIndv = function (individuals) {
        var totalFitness = 0;
        for (var _i = 0, individuals_3 = individuals; _i < individuals_3.length; _i++) {
            var individual = individuals_3[_i];
            totalFitness += individual.fitness;
        }
        for (var _a = 0, individuals_4 = individuals; _a < individuals_4.length; _a++) {
            var individual = individuals_4[_a];
            individual.fitnessProportion = individual.fitness / totalFitness;
        }
    };
    EvolutionaryAlgorithm.prototype.addCommulativeFitnessProportionOfEachIndv = function (individuals) {
        var commulativeFitnessProportion = 0;
        for (var _i = 0, individuals_5 = individuals; _i < individuals_5.length; _i++) {
            var individual = individuals_5[_i];
            commulativeFitnessProportion += individual.fitnessProportion;
            individual.commulativeProportion = commulativeFitnessProportion;
        }
    };
    EvolutionaryAlgorithm.prototype.selectByFitnessProportion = function (individuals) {
        var randomValue = Math.random();
        for (var _i = 0, individuals_6 = individuals; _i < individuals_6.length; _i++) {
            var individual = individuals_6[_i];
            if (randomValue <= individual.commulativeProportion) {
                return individual;
            }
        }
        // Return last individual if no individual was selected to prevent null pointer exception
        return individuals[individuals.length - 1];
    };
    EvolutionaryAlgorithm.prototype.isStoppingCriteria2Satisfied = function () {
        var startIndex = EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length - 10; // so that we always start with the last 10
        for (; startIndex < EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(EvolutionaryAlgorithm.avgFitnesstOfEachGeneration[startIndex] - EvolutionaryAlgorithm.avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001)
                return false;
        }
        return true;
    };
    EvolutionaryAlgorithm.prototype.calculateAverage = function (individuals) {
        var sum = 0;
        for (var _i = 0, individuals_7 = individuals; _i < individuals_7.length; _i++) {
            var individual = individuals_7[_i];
            sum += individual.fitness;
        }
        return sum / individuals.length;
    };
    EvolutionaryAlgorithm.prototype.sortIndividuals = function (individuals) {
        individuals.sort(function (a, b) { return b.fitness - a.fitness; });
    };
    EvolutionaryAlgorithm.prototype.initializeIndividuals = function () {
        for (var i = 0; i < EvolutionaryAlgorithm.noOfIndividualsToBeSelected; i++) {
            var x = this.randomNumberBetween(EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
            var y = this.randomNumberBetween(EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
            var fitness = this.calculateFitness(x, y);
            EvolutionaryAlgorithm.individuals.push(new Individual(x, y, fitness));
        }
    };
    EvolutionaryAlgorithm.prototype.randomNumberBetween = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    EvolutionaryAlgorithm.stepSize = 0.15;
    EvolutionaryAlgorithm.noOfChildsToBeGenerated = 10;
    EvolutionaryAlgorithm.noOfIndividualsToBeSelected = 10;
    EvolutionaryAlgorithm.individuals = [];
    EvolutionaryAlgorithm.newIndividuals = [];
    EvolutionaryAlgorithm.selectedIndividuals = [];
    EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration = [];
    EvolutionaryAlgorithm.avgFitnesstOfEachGeneration = [];
    EvolutionaryAlgorithm.xUpperBound = 15;
    EvolutionaryAlgorithm.yUpperBound = 20;
    EvolutionaryAlgorithm.xLowerBound = -15;
    EvolutionaryAlgorithm.yLowerBound = -25;
    return EvolutionaryAlgorithm;
}());
var Individual = /** @class */ (function () {
    function Individual(x, y, fitness) {
        this.x = x;
        this.y = y;
        this.fitness = fitness;
    }
    Individual.prototype.compareTo = function (other) {
        return this.fitness - other.fitness;
    };
    Individual.prototype.equals = function (obj) {
        if (this === obj)
            return true;
        if (obj == null || obj.constructor !== Individual)
            return false;
        var individual = obj;
        return this.x === individual.x && this.y === individual.y;
    };
    Individual.prototype.hashCode = function () {
        return this.fitness;
    };
    Individual.prototype.toString = function () {
        return "{ x: ".concat(this.x, ", y: ").concat(this.y, ", Fitness is: ").concat(this.fitness, " }\n");
    };
    return Individual;
}());
// Example usage
var ea = new EvolutionaryAlgorithm();
ea.runAlgo();
