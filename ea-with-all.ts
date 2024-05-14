const lowerBoundaryX: number = 0.5;
const upperBoundaryX: number = 7.5;
const lowerBoundaryY: number = -4.0;
const upperBoundaryY: number = 2.85;
const mutationValue: number = 0.3;

interface Individual {
    x: number;
    y: number;
    fitness: number;
}

const getFitness = (x: number, y: number): number => parseFloat((7 * x - 2.65 * y).toFixed(5));

const sortPopulation = (population: Individual[]): Individual[] => population.sort((a, b) => b.fitness - a.fitness);

const getRandomNumber = (min: number, max: number): number => Math.random() * (max - min) + min;

const initializePopulation = (populationSize: number): Individual[] => {
    const population: Individual[] = [];

    for (let i = 0; i < populationSize; i++) {
        const x: number = parseFloat(getRandomNumber(7.5, 0.5).toFixed(5));
        const y: number = parseFloat(getRandomNumber(2.85, -4.0).toFixed(5));
        const fitness: number = getFitness(x, y);
        population.push({ x, y, fitness });
    }

    return sortPopulation(population);
};

const fitnessProportionSelection = (population: Individual[]): Individual => {
    const totalFitness: number = population.reduce((sum, individual) => sum + Math.max(individual.fitness, 0), 0);
    const randomValue: number = Math.random() * totalFitness;

    let cumulativeFitness: number = 0;
    for (const individual of population) {
        cumulativeFitness += Math.max(individual.fitness, 0);
        if (cumulativeFitness >= randomValue) {
            return individual;
        }
    }

    return population[population.length - 1];
};

const rankBasedSelection = (population: Individual[]): Individual => {
    const sortedPopulation: Individual[] = population.slice().sort((a, b) => a.fitness - b.fitness);
    const selectionProbability = (rank: number): number => 2 / (population.length * (population.length + 1)) * rank;
    const randomSelectionProbability: number = Math.random();
    let cumulativeProbability: number = 0;

    for (let i = 0; i < population.length; i++) {
        cumulativeProbability += selectionProbability(i + 1);
        if (randomSelectionProbability <= cumulativeProbability) {
            return sortedPopulation[i];
        }
    }

    return sortedPopulation[population.length - 1];
};

const binaryTournamentSelection = (population: Individual[]): Individual => {
    const randomIndex1: number = Math.floor(Math.random() * population.length);
    let randomIndex2: number = Math.floor(Math.random() * population.length);
    while (randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * population.length);
    }
    const individual1: Individual = population[randomIndex1];
    const individual2: Individual = population[randomIndex2];
    return individual1.fitness > individual2.fitness ? individual1 : individual2;
};

const crossover = (population: Individual[], selectionMethod: (population: Individual[]) => Individual): Individual[] => {
    const length: number = population.length;
    const newPopulation: Individual[] = [];

    for (let i = 0; i < length; i++) {
        const child1: Individual = selectionMethod(population);
        const child2: Individual = selectionMethod(population);

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

const mutate = (population: Individual[]): Individual[] => {
    for (let i = 0; i < population.length; i++) {
        if (Math.random() * 100 <= 50) {
            if (Math.random() * 100 > 50) {
                population[i].x += mutationValue;
            } else {
                population[i].x -= mutationValue;
            }
            population[i].x = parseFloat(population[i].x.toFixed(5));
            population[i].x = Math.min(upperBoundaryX, Math.max(lowerBoundaryX, population[i].x));
        }
        if (Math.random() * 100 <= 50) {
            if (Math.random() * 100 > 50) {
                population[i].y += mutationValue;
            } else {
                population[i].y -= mutationValue;
            }
            population[i].y = parseFloat(population[i].y.toFixed(5));
            population[i].y = Math.min(upperBoundaryY, Math.max(lowerBoundaryY, population[i].y));
        }
    }

    return population;
};

const survival = (population: Individual[], length: number, selectionMethod: (population: Individual[]) => Individual): Individual[] => {
    const selectedIndividuals: Individual[] = [];

    for (let i = 0; i < length; i++) {
        const selectedIndividual: Individual = selectionMethod(population);
        selectedIndividuals.push(selectedIndividual);
        population.splice(population.indexOf(selectedIndividual), 1);
    }
    return sortPopulation(selectedIndividuals);
};

const evolutionAlgorithm = (populationSize: number, generations: number): number[] => {
    let population: Individual[] = initializePopulation(populationSize);
    const bestFitnesses: number[] = [population[0].fitness];
    let consecutiveSameFitnessCount: number = 0;
    let prevBestFitness: number = population[0].fitness;

    for (let i = 0; i < generations; i++) {
        const newGen: Individual[] = crossover(population, rankBasedSelection);
        const selected: Individual[] = survival(newGen, 10, binaryTournamentSelection);
        const mutatedGen: Individual[] = mutate(selected);

        population = mutatedGen;
        const currentBestFitness: number = population[0].fitness;

        bestFitnesses.push(currentBestFitness);

        if (currentBestFitness === prevBestFitness) {
            consecutiveSameFitnessCount++;

            if (consecutiveSameFitnessCount === 5) {
                console.log(`Evolution stopped at generation ${i + 1} .`);
                break;
            }
        } else {
            consecutiveSameFitnessCount = 0;
        }

        prevBestFitness = currentBestFitness;
    }

    return bestFitnesses;
};

console.log(evolutionAlgorithm(10, 100));
