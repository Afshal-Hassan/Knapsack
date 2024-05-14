var lowerBoundaryX = 0.5;
var upperBoundaryX = 7.5;
var lowerBoundaryY = -4.0;
var upperBoundaryY = 2.85;
var mutationValue = 0.3;
var getFitness = function (x, y) { return parseFloat((7 * x - 2.65 * y).toFixed(5)); };
var sortPopulation = function (population) { return population.sort(function (a, b) { return b.fitness - a.fitness; }); };
var getRandomNumber = function (min, max) { return Math.random() * (max - min) + min; };
var initializePopulation = function (populationSize) {
    var population = [];
    for (var i = 0; i < populationSize; i++) {
        var x = parseFloat(getRandomNumber(7.5, 0.5).toFixed(5));
        var y = parseFloat(getRandomNumber(2.85, -4.0).toFixed(5));
        var fitness = getFitness(x, y);
        population.push({ x: x, y: y, fitness: fitness });
    }
    return sortPopulation(population);
};
var fitnessProportionSelection = function (population) {
    var totalFitness = population.reduce(function (sum, individual) { return sum + Math.max(individual.fitness, 0); }, 0);
    var randomValue = Math.random() * totalFitness;
    var cumulativeFitness = 0;
    for (var _i = 0, population_1 = population; _i < population_1.length; _i++) {
        var individual = population_1[_i];
        cumulativeFitness += Math.max(individual.fitness, 0);
        if (cumulativeFitness >= randomValue) {
            return individual;
        }
    }
    return population[population.length - 1];
};
var rankBasedSelection = function (population) {
    var sortedPopulation = population.slice().sort(function (a, b) { return a.fitness - b.fitness; });
    var selectionProbability = function (rank) { return 2 / (population.length * (population.length + 1)) * rank; };
    var randomSelectionProbability = Math.random();
    var cumulativeProbability = 0;
    for (var i = 0; i < population.length; i++) {
        cumulativeProbability += selectionProbability(i + 1);
        if (randomSelectionProbability <= cumulativeProbability) {
            return sortedPopulation[i];
        }
    }
    return sortedPopulation[population.length - 1];
};
var binaryTournamentSelection = function (population) {
    var randomIndex1 = Math.floor(Math.random() * population.length);
    var randomIndex2 = Math.floor(Math.random() * population.length);
    while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * population.length);
    }
    var individual1 = population[randomIndex1];
    var individual2 = population[randomIndex2];
    return individual1.fitness > individual2.fitness ? individual1 : individual2;
};
var crossover = function (population, selectionMethod) {
    var length = population.length;
    var newPopulation = [];
    for (var i = 0; i < length; i++) {
        var child1 = selectionMethod(population);
        var child2 = selectionMethod(population);
        newPopulation.push({
            x: child1.x,
            y: child2.y,
            fitness: getFitness(child1.x, child2.y)
        });
        newPopulation.push({
            x: child2.x,
            y: child1.y,
            fitness: getFitness(child2.x, child1.y)
        });
    }
    return sortPopulation(newPopulation);
};
var mutate = function (population) {
    for (var i = 0; i < population.length; i++) {
        if (Math.random() * 100 <= 50) {
            if (Math.random() * 100 > 50) {
                population[i].x += mutationValue;
            }
            else {
                population[i].x -= mutationValue;
            }
            population[i].x = parseFloat(population[i].x.toFixed(5));
            population[i].x = Math.min(upperBoundaryX, Math.max(lowerBoundaryX, population[i].x));
        }
        if (Math.random() * 100 <= 50) {
            if (Math.random() * 100 > 50) {
                population[i].y += mutationValue;
            }
            else {
                population[i].y -= mutationValue;
            }
            population[i].y = parseFloat(population[i].y.toFixed(5));
            population[i].y = Math.min(upperBoundaryY, Math.max(lowerBoundaryY, population[i].y));
        }
    }
    return population;
};
var survival = function (population, length, selectionMethod) {
    var selectedIndividuals = [];
    for (var i = 0; i < length; i++) {
        var selectedIndividual = selectionMethod(population);
        selectedIndividuals.push(selectedIndividual);
        population.splice(population.indexOf(selectedIndividual), 1);
    }
    return sortPopulation(selectedIndividuals);
};
var evolutionAlgorithm = function (populationSize, generations) {
    var population = initializePopulation(populationSize);
    var bestFitnesses = [population[0].fitness];
    var consecutiveSameFitnessCount = 0;
    var prevBestFitness = population[0].fitness;
    for (var i = 0; i < generations; i++) {
        var newGen = crossover(population, rankBasedSelection);
        var selected = survival(newGen, 10, binaryTournamentSelection);
        var mutatedGen = mutate(selected);
        population = mutatedGen;
        var currentBestFitness = population[0].fitness;
        bestFitnesses.push(currentBestFitness);
        if (currentBestFitness === prevBestFitness) {
            consecutiveSameFitnessCount++;
            if (consecutiveSameFitnessCount === 5) {
                console.log("Evolution stopped at generation ".concat(i + 1, " ."));
                break;
            }
        }
        else {
            consecutiveSameFitnessCount = 0;
        }
        prevBestFitness = currentBestFitness;
    }
    return bestFitnesses;
};
console.log(evolutionAlgorithm(10, 100));
