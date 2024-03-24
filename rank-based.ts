// const X_UPPER_BOUND: number = 15;
// const Y_UPPER_BOUND: number = 20;
// const X_LOWER_BOUND: number = -15;
// const Y_LOWER_BOUND: number = -25;
// const NUMBER_OF_CHILDS_TO_BE_GENERATED: number = 10;
// const NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED: number = 10;

// let individuals: Individual[] = [];
// let newIndividuals: Individual[] = [];
// const avgFitnesstOfEachGeneration: number[] = [];
// const fittestIndividualsOfEachGeneration: Individual[] = [];

// class Individual {
//     x: number;
//     y: number;
//     fitness: number;
//     rank: number | null;

//     constructor(x: number, y: number, fitness: number) {
//         this.x = x;
//         this.y = y;
//         this.fitness = fitness;
//         this.rank = null;
//     }
// }

// class RankBasedEvolutionaryAlgorithm {

//     runAlgo(): void {
//         // Initializing Individuals
//         this.initializeIndividuals();

//         // Sorting individuals on basis of fitness
//         this.sortIndividuals(individuals);

//         // Give ranks to individuals
//         this.giveRankOnBasisOfFitness(individuals);

//         fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
//         // Saving extra information of average fitness of every generation
//         avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));

//         while (true) {

//             // Giving ranks to each individual on basis of fitness
//             this.giveRankOnBasisOfFitness(individuals);

//             while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
//                 // Select individuals for reproduction based on rank
//                 const individual1 = this.selectByRank(individuals);
//                 let individual2 = this.selectByRank(individuals);
//                 if (individual1 === individual2) // Check if the same individual is selected
//                     individual2 = this.selectByRank(individuals);

//                 this.reproduceOneChild(individual1, individual2);
//             }

//             // Combine current individuals with new individuals
//             const parentAndChildren: Individual[] = [...individuals, ...newIndividuals];

//             // Sort the combined array based on fitness
//             parentAndChildren.sort((a, b) => b.fitness - a.fitness);

//             // Select top individuals for the next generation
//             individuals = parentAndChildren.slice(NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED, parentAndChildren.length);

//             fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);

//             // Calculate and save the average fitness of the current generation
//             avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));

//             // Check stopping criteria
//             if (avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
//                 console.log("Criteria Satisfied");
//                 break;
//             }

//             newIndividuals = [];
//         }

//         console.log("Fittest indv of each Generation: ");
//         fittestIndividualsOfEachGeneration.forEach(fittestIndividual => console.log(fittestIndividual));

//         console.log("*****************************************************");
//         console.log("Avg fitness of each gen " + avgFitnesstOfEachGeneration);
//     }

//     private selectByRank(individuals: Individual[]): Individual {
//         // Calculate total ranks
//         const totalRanks: number = individuals.reduce((sumOfTotalRank, individual) => sumOfTotalRank + individual.fitness + sumOfTotalRank, 0);

//         // Generate a random number between 1 and totalRanks
//         const randomNumber = Math.random() * totalRanks;

//         let sum = 0;
//         let selectedIndividual: Individual | null = null;

//         // Iterate through individuals and find the one corresponding to the random rank
//         for (const individual of individuals) {
//             // Calculate selection probability for the current individual
//             const selectionProbability = individual.rank! / totalRanks;
//             sum += selectionProbability;

//             if (sum >= randomNumber) {
//                 selectedIndividual = individual;
//                 break; // Exit loop once an individual is selected
//             }
//         }

//         // Return the selected individual
//         return selectedIndividual || individuals[individuals.length - 1]; // Fallback to last individual
//     }


//     private isStoppingCriteria2Satisfied(): boolean {
//         let startIndex = avgFitnesstOfEachGeneration.length - 10; // so that we always start with the last 10
//         for (; startIndex < avgFitnesstOfEachGeneration.length - 2; startIndex++) {
//             if (Math.abs(avgFitnesstOfEachGeneration[startIndex] - avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) return false;
//         }
//         return true;
//     }

//     private reproduceOneChild(individual1: Individual, individual2: Individual): void {
//         const newChild = this.doCrossOverOneChild(individual1, individual2);
//         const randomValue = this.allowMutationBasedOnRandomNumber();
//         if (randomValue !== -1)
//             this.doMutation(randomValue, newChild);
//         newIndividuals.push(newChild);
//     }

//     private doCrossOverOneChild(individual1: Individual, individual2: Individual): Individual {
//         const newChildX = (individual1.x + individual2.x) / 2;
//         const newChildY = (individual1.y + individual2.y) / 2;
//         const fitness = this.calculateFitness(newChildX, newChildY);
//         return new Individual(individual1.x, individual2.y, fitness);
//     }

//     private allowMutationBasedOnRandomNumber(): number {
//         const randomNumber = Math.floor(Math.random() * 400) + 1;
//         if (randomNumber >= 1 && randomNumber <= 100) return randomNumber;
//         else return -1;
//     }

//     private doMutation(randomValue: number, individual: Individual): void {
//         if (randomValue > 50) {
//             if (randomValue % 2 === 0) {
//                 individual.x = this.resetBoundary(individual.x, X_LOWER_BOUND, X_UPPER_BOUND);
//             } else {
//                 individual.x = this.resetBoundary(individual.x, X_LOWER_BOUND, X_UPPER_BOUND);
//             }
//         } else {
//             if (randomValue % 2 === 0) {
//                 individual.y = this.resetBoundary(individual.y, Y_LOWER_BOUND, Y_UPPER_BOUND);
//             } else {
//                 individual.y = this.resetBoundary(individual.y, Y_LOWER_BOUND, Y_UPPER_BOUND);
//             }
//         }
//     }

//     private resetBoundary(elementToBeChecked: number, lowerBoundary: number, upperBoundary: number): number {
//         if (elementToBeChecked < lowerBoundary) return lowerBoundary;
//         else if (elementToBeChecked > upperBoundary) return upperBoundary;
//         return elementToBeChecked;
//     }

//     private initializeIndividuals(): void {
//         for (let i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
//             const x = this.randomNumberBetween(X_LOWER_BOUND, X_UPPER_BOUND);
//             const y = this.randomNumberBetween(Y_LOWER_BOUND, Y_UPPER_BOUND);
//             const fitness = this.calculateFitness(x, y);
//             individuals.push(new Individual(x, y, fitness));
//         }
//     }

//     private randomNumberBetween(min: number, max: number): number {
//         return Math.random() * (max - min) + min;
//     }

//     private calculateFitness(x: number, y: number): number {
//         return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
//     }

//     private sortIndividuals(individuals: Individual[]): void {
//         individuals.sort((a, b) => a.fitness - b.fitness);
//     }

//     private calculateAverage(individuals: Individual[]): number {
//         let sum = 0;
//         for (const individual of individuals) {
//             sum += individual.fitness;
//         }
//         return sum / individuals.length;
//     }

//     private giveRankOnBasisOfFitness(individuals: Individual[]) {
//         let rank = 1;
//         individuals.forEach(individual => {
//             individual.rank = rank;
//             rank++;
//         })
//     }
// }

// const rankBasedEvolutionaryAlgorithm = new RankBasedEvolutionaryAlgorithm();
// rankBasedEvolutionaryAlgorithm.runAlgo();