// class EvolutionaryAlgorithm {
//     static stepSize: number = 0.15;
//     static noOfChildsToBeGenerated: number = 10;
//     static noOfIndividualsToBeSelected: number = 10;
//     static individuals: Individual[] = [];
//     static newIndividuals: Individual[] = [];
//     static selectedIndividuals: Individual[] = [];
//     static fittestIndividualsOfEachGeneration: Individual[] = [];
//     static avgFitnesstOfEachGeneration: number[] = [];

//     static xUpperBound: number = 15;
//     static yUpperBound: number = 20;
//     static xLowerBound: number = -15;
//     static yLowerBound: number = -25;

//     runAlgo(): void {
//         this.initializeIndividuals();
//         this.sortIndividuals(EvolutionaryAlgorithm.individuals);
//         console.log("Starting gen: " + EvolutionaryAlgorithm.individuals);
//         EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithm.individuals[0]);
//         EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithm.individuals));

//         while (true) {
//             if (this.hasNegativeFitness(EvolutionaryAlgorithm.individuals))
//                 this.makeFitnessPositive(EvolutionaryAlgorithm.individuals);

//             this.addFitnessProportionOfEachIndv(EvolutionaryAlgorithm.individuals);
//             this.addCommulativeFitnessProportionOfEachIndv(EvolutionaryAlgorithm.individuals);

//             while (EvolutionaryAlgorithm.newIndividuals.length < EvolutionaryAlgorithm.noOfChildsToBeGenerated) {
//                 const individual1 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);
//                 let individual2 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);
//                 if (individual1.equals(individual2))
//                     individual2 = this.selectByFitnessProportion(EvolutionaryAlgorithm.individuals);

//                 this.reproduceOneChild(individual1, individual2);
//             }

//             const parentAndChildren: Individual[] = [...EvolutionaryAlgorithm.individuals, ...EvolutionaryAlgorithm.newIndividuals];
//             this.sortIndividuals(parentAndChildren);
//             EvolutionaryAlgorithm.selectedIndividuals = parentAndChildren.slice(0, EvolutionaryAlgorithm.noOfIndividualsToBeSelected);
//             EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithm.selectedIndividuals[0]);
//             EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithm.selectedIndividuals));

//             if (EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
//                 console.log("Criteria Satisfied");
//                 break;
//             }

//             EvolutionaryAlgorithm.individuals = EvolutionaryAlgorithm.selectedIndividuals;
//             EvolutionaryAlgorithm.newIndividuals = [];
//         }

//         console.log("Fittest indv of each gen " + EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration);
//         console.log("Avg fitness of each gen " + EvolutionaryAlgorithm.fittestIndividualsOfEachGeneration);

//         // Write to file implementation goes here...
//     }

//     private reproduceOneChild(individual1: Individual, individual2: Individual): void {
//         const newChild = this.doCrossOverOneChild(individual1, individual2);
//         const randomValue = this.allowMutationBasedOnRandomNumber();
//         if (randomValue !== -1)
//             this.doMutation(randomValue, newChild);
//         EvolutionaryAlgorithm.newIndividuals.push(newChild);
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
//         if (randomValue > 50) { // mutate x
//             if (randomValue % 2 === 0) { // if even, +ve update
//                 individual.x += EvolutionaryAlgorithm.stepSize;
//                 individual.x = this.reSetBoundary(individual.x, EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
//             } else { // odd -> -ve update
//                 individual.x -= EvolutionaryAlgorithm.stepSize;
//                 individual.x = this.reSetBoundary(individual.x, EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
//             }
//         } else { // mutate y
//             if (randomValue % 2 === 0) { // if even, +ve update
//                 individual.y += EvolutionaryAlgorithm.stepSize;
//                 individual.y = this.reSetBoundary(individual.y, EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
//             } else { // odd -> -ve update
//                 individual.y -= EvolutionaryAlgorithm.stepSize;
//                 individual.y = this.reSetBoundary(individual.y, EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
//             }
//         }
//     }

//     private reSetBoundary(elementToBeChecked: number, lowerBoundary: number, upperBoundary: number): number {
//         if (elementToBeChecked < lowerBoundary) return lowerBoundary;
//         else if (elementToBeChecked > upperBoundary) return upperBoundary;
//         return elementToBeChecked;
//     }

//     private calculateFitness(x: number, y: number): number {
//         return (100 - Math.pow((x - (7 * y)), 2) - Math.pow((x + y - 11), 2));
//     }

//     private hasNegativeFitness(individuals: Individual[]): boolean {
//         for (const individual of individuals) {
//             if (individual.fitness < 0) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     private makeFitnessPositive(individuals: Individual[]): void {
//         for (const individual of individuals) {
//             individual.fitness += Math.abs(Math.min(0, Math.min(individual.x, individual.y)));
//         }
//     }

//     private addFitnessProportionOfEachIndv(individuals: Individual[]): void {
//         let totalFitness = 0;
//         for (const individual of individuals) {
//             totalFitness += individual.fitness;
//         }
//         for (const individual of individuals) {
//             individual.fitnessProportion = individual.fitness / totalFitness;
//         }
//     }

//     private addCommulativeFitnessProportionOfEachIndv(individuals: Individual[]): void {
//         let commulativeFitnessProportion = 0;
//         for (const individual of individuals) {
//             commulativeFitnessProportion += individual.fitnessProportion;
//             individual.commulativeProportion = commulativeFitnessProportion;
//         }
//     }

//     private selectByFitnessProportion(individuals: Individual[]): Individual {
//         const randomValue = Math.random();
//         for (const individual of individuals) {
//             if (randomValue <= individual.commulativeProportion) {
//                 return individual;
//             }
//         }
//         // Return last individual if no individual was selected to prevent null pointer exception
//         return individuals[individuals.length - 1];
//     }

//     private isStoppingCriteria2Satisfied(): boolean {
//         let startIndex = EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length - 10; // so that we always start with the last 10
//         for (; startIndex < EvolutionaryAlgorithm.avgFitnesstOfEachGeneration.length - 2; startIndex++) {
//             if (Math.abs(EvolutionaryAlgorithm.avgFitnesstOfEachGeneration[startIndex] - EvolutionaryAlgorithm.avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) return false;
//         }
//         return true;
//     }

//     private calculateAverage(individuals: Individual[]): number {
//         let sum = 0;
//         for (const individual of individuals) {
//             sum += individual.fitness;
//         }
//         return sum / individuals.length;
//     }

//     private sortIndividuals(individuals: Individual[]): void {
//         individuals.sort((a, b) => b.fitness - a.fitness);
//     }

//     private initializeIndividuals(): void {
//         for (let i = 0; i < EvolutionaryAlgorithm.noOfIndividualsToBeSelected; i++) {
//             const x = this.randomNumberBetween(EvolutionaryAlgorithm.xLowerBound, EvolutionaryAlgorithm.xUpperBound);
//             const y = this.randomNumberBetween(EvolutionaryAlgorithm.yLowerBound, EvolutionaryAlgorithm.yUpperBound);
//             const fitness = this.calculateFitness(x, y);
//             EvolutionaryAlgorithm.individuals.push(new Individual(x, y, fitness));
//         }
//     }

//     private randomNumberBetween(min: number, max: number): number {
//         return Math.random() * (max - min) + min;
//     }
// }

// class Individual {
//     x: number;
//     y: number;
//     fitness: number;
//     fitnessProportion: number;
//     commulativeProportion: number;

//     constructor(x: number, y: number, fitness: number) {
//         this.x = x;
//         this.y = y;
//         this.fitness = fitness;
//     }

//     compareTo(other: Individual): number {
//         return this.fitness - other.fitness;
//     }

//     equals(obj: any): boolean {
//         if (this === obj) return true;
//         if (obj == null || obj.constructor !== Individual) return false;
//         const individual = obj as Individual;
//         return this.x === individual.x && this.y === individual.y;
//     }

//     hashCode(): number {
//         return this.fitness;
//     }

//     toString(): string {
//         return `{ x: ${this.x}, y: ${this.y}, Fitness is: ${this.fitness} }\n`;
//     }
// }

// // Example usage
// const ea = new EvolutionaryAlgorithm();
// ea.runAlgo();
