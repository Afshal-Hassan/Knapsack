// const X_UPPER_BOUND: number = 15;
// const Y_UPPER_BOUND: number = 20;
// const X_LOWER_BOUND: number = -15;
// const Y_LOWER_BOUND: number = -25;
// const NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED: number = 10;
// const NUMBER_OF_CHILDS_TO_BE_GENERATED: number = 10;

// let individuals: Individual[] = [];
// let newIndividuals: Individual[] = [];
// const avgFitnessOfEachGeneration: number[] = [];
// const fittestIndividualsOfEachGeneration: Individual[] = [];

// class Individual {
//     x: number;
//     y: number;
//     fitness: number;

//     constructor(x: number, y: number, fitness: number) {
//         this.x = x;
//         this.y = y;
//         this.fitness = fitness;
//     }
// }

// class EvolutionaryAlgorithm {

//     runAlgorithm(): void {
//         this.initializeIndividuals();

//         while (true) {
//             individuals.sort((a, b) => b.fitness - a.fitness); // Sort individuals by fitness

//             fittestIndividualsOfEachGeneration.push(individuals[0]); // Store the fittest individual of this generation

//             avgFitnessOfEachGeneration.push(this.calculateAverageFitness(individuals)); // Calculate and store the average fitness

//             if (avgFitnessOfEachGeneration.length >= 10 && this.isStoppingCriteriaSatisfied()) {
//                 console.log("Stopping criteria satisfied.");
//                 break;
//             }

//             newIndividuals = [];

//             while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
//                 const parent1 = individuals[Math.floor(Math.random() * individuals.length)];
//                 const parent2 = individuals[Math.floor(Math.random() * individuals.length)];
//                 const child = this.reproduce(parent1, parent2);
//                 newIndividuals.push(child);
//             }

//             individuals = individuals.concat(newIndividuals).slice(0, NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED);
//         }

//         console.log("Fittest individuals of each generation:");
//         fittestIndividualsOfEachGeneration.forEach((individual, index) => console.log(`Generation ${index + 1}: ${individual.x}, ${individual.y}, Fitness: ${individual.fitness}`));
//         console.log("Average fitness of each generation:", avgFitnessOfEachGeneration);
//     }

//     private initializeIndividuals(): void {
//         for (let i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
//             const x = this.randomNumberBetween(X_LOWER_BOUND, X_UPPER_BOUND);
//             const y = this.randomNumberBetween(Y_LOWER_BOUND, Y_UPPER_BOUND);
//             const fitness = this.calculateFitness(x, y);
//             individuals.push(new Individual(x, y, fitness));
//         }
//     }

//     private reproduce(parent1: Individual, parent2: Individual): Individual {
//         const childX = (parent1.x + parent2.x) / 2;
//         const childY = (parent1.y + parent2.y) / 2;
//         const childFitness = this.calculateFitness(childX, childY);
//         return new Individual(childX, childY, childFitness);
//     }

//     private calculateFitness(x: number, y: number): number {
//         return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
//     }

//     private calculateAverageFitness(individuals: Individual[]): number {
//         const totalFitness = individuals.reduce((acc, individual) => acc + individual.fitness, 0);
//         return totalFitness / individuals.length;
//     }

//     private isStoppingCriteriaSatisfied(): boolean {
//         const lastTenGenerationsAvgFitness = avgFitnessOfEachGeneration.slice(-10);
//         const differences = lastTenGenerationsAvgFitness.slice(1).map((avgFitness, index) => Math.abs(avgFitness - lastTenGenerationsAvgFitness[index]));
//         return differences.every(diff => diff <= 0.001);
//     }

//     private randomNumberBetween(min: number, max: number): number {
//         return Math.random() * (max - min) + min;
//     }
// }

// const evolutionaryAlgorithm = new EvolutionaryAlgorithm();
// evolutionaryAlgorithm.runAlgorithm();
