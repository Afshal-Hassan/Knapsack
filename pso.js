var Individual = /** @class */ (function () {
    function Individual(x, y, pbest, fitness) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.pbest = pbest;
        this.fitness = fitness;
    }
    Individual.prototype.toString = function () {
        return "Individual{x=".concat(this.x, ", y=").concat(this.y, ", vx=").concat(this.vx, ", vy=").concat(this.vy, ", fitness=").concat(this.fitness, "}\n");
    };
    return Individual;
}());
var C1 = 2;
var C2 = 2;
var LOWER_X = -5;
var UPPER_X = 5;
var LOWER_Y = -1;
var UPPER_Y = 20;
var PSOAlgorithm = /** @class */ (function () {
    function PSOAlgorithm() {
    }
    PSOAlgorithm.initializeIndividuals = function (individuals) {
        for (var i = 0; i < 10; i++) {
            individuals.push(PSOAlgorithm.initializeIndividual());
        }
    };
    PSOAlgorithm.initializeIndividual = function () {
        var x = Math.random() * (UPPER_X - LOWER_X) + LOWER_X;
        var y = Math.random() * (UPPER_Y - LOWER_Y) + LOWER_Y;
        var fitness = PSOAlgorithm.calculateFitness(x, y);
        var initialPbest = null;
        return new Individual(x, y, initialPbest, fitness);
    };
    PSOAlgorithm.calculateFitness = function (x, y) {
        return (100 - Math.pow(x, 2)) + (Math.pow(y, 2) - 56 * x * y) - Math.pow(Math.sin(x / 2), 2);
    };
    PSOAlgorithm.updateVelocityAndPosition = function (I, gbest) {
        I.vx = I.vx + C1 * Math.random() * (I.pbest.x - I.x) + C2 * Math.random() * (gbest.x - I.x);
        I.vy = I.vy + C1 * Math.random() * (I.pbest.y - I.y) + C2 * Math.random() * (gbest.y - I.y);
        I.x = Math.max(LOWER_X, Math.min(UPPER_X, I.x + I.vx));
        I.y = Math.max(LOWER_Y, Math.min(UPPER_Y, I.y + I.vy));
        return I;
    };
    PSOAlgorithm.calculatePbest = function (I) {
        if (!I.pbest || I.pbest.fitness < I.fitness) {
            I.pbest = I;
        }
        return I;
    };
    PSOAlgorithm.findGlobalBest = function (Iarr) {
        var globalBest = Iarr[0];
        for (var i = 1; i < Iarr.length; i++) {
            if (Iarr[i].fitness > globalBest.fitness) {
                globalBest = Iarr[i];
            }
        }
        return globalBest;
    };
    PSOAlgorithm.checkFitnessDifferenceZero = function (Iarr, gBest, step) {
        if (step === 1) {
            return true;
        }
        var allIndividualsFitnessSum = 0;
        for (var i = 0; i < 10; i++) {
            allIndividualsFitnessSum += Iarr[i].fitness;
        }
        var avgFitness = allIndividualsFitnessSum / 10;
        var difference = Math.abs(avgFitness - gBest.fitness);
        return difference > Number.MIN_VALUE;
    };
    PSOAlgorithm.calculateAverage = function (individuals) {
        var sumOfIndividualsFitness = PSOAlgorithm.getSumOfIndividualsFitness(individuals);
        return sumOfIndividualsFitness / individuals.length;
    };
    PSOAlgorithm.getSumOfIndividualsFitness = function (individuals) {
        return individuals.reduce(function (sum, individual) { return sum + individual.fitness; }, 0);
    };
    PSOAlgorithm.psoAlgorithm = function () {
        var individualArray = [];
        PSOAlgorithm.initializeIndividuals(individualArray);
        var gbest = PSOAlgorithm.findGlobalBest(individualArray);
        var step = 1;
        while (PSOAlgorithm.checkFitnessDifferenceZero(individualArray, gbest, step)) {
            console.log("-----------------------------STEP NO : ".concat(step, "-----------------------------"));
            for (var _i = 0, individualArray_1 = individualArray; _i < individualArray_1.length; _i++) {
                var I = individualArray_1[_i];
                I.fitness = PSOAlgorithm.calculateFitness(I.x, I.y);
                I.pbest = PSOAlgorithm.calculatePbest(I);
            }
            gbest = PSOAlgorithm.findGlobalBest(individualArray);
            PSOAlgorithm.avgFitnessOfEachIteration.push(PSOAlgorithm.calculateAverage(individualArray));
            PSOAlgorithm.gBestOfEachIteration.push(gbest.fitness);
            for (var _a = 0, individualArray_2 = individualArray; _a < individualArray_2.length; _a++) {
                var I = individualArray_2[_a];
                PSOAlgorithm.updateVelocityAndPosition(I, gbest);
            }
            console.log(individualArray);
            step++;
        }
        console.log("Avg fitness of each iteration: " + PSOAlgorithm.avgFitnessOfEachIteration);
        console.log("Gbest fitnses of each iteration: " + PSOAlgorithm.gBestOfEachIteration);
    };
    PSOAlgorithm.main = function () {
        PSOAlgorithm.psoAlgorithm();
    };
    PSOAlgorithm.rand = {
        nextDouble: function (min, max) {
            return Math.random() * (max - min) + min;
        }
    };
    PSOAlgorithm.avgFitnessOfEachIteration = [];
    PSOAlgorithm.gBestOfEachIteration = [];
    return PSOAlgorithm;
}());
function Random() {
    return {
        nextDouble: function (min, max) {
            return Math.random() * (max - min) + min;
        }
    };
}
PSOAlgorithm.main();
