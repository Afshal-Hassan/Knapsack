const X_UPPER_BOUND: number = 15;
const Y_UPPER_BOUND: number = 20;
const X_LOWER_BOUND: number = -15;
const Y_LOWER_BOUND: number = -25;
const NUMBER_OF_CHILDS_TO_BE_GENERATED: number = 10;
const NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED: number = 10;

let individuals: Individual[] = [];
let newIndividuals: Individual[] = [];
const avgFitnesstOfEachGeneration: number[] = [];
const fittestIndividualsOfEachGeneration: Individual[] = [];

class Individual {
    x: number;
    y: number;
    fitness: number;

    constructor(x: number, y: number, fitness: number) {
        this.x = x;
        this.y = y;
        this.fitness = fitness;
    }
}

class TournamentBasedEvolutionaryAlgorithm {
    private tournamentSize;

    constructor(tournamentSize: number) {
        this.tournamentSize = tournamentSize;
    }

    runAlgo(): void {
        this.initializeIndividuals();

        this.sortIndividuals(individuals);

        fittestIndividualsOfEachGeneration.push(individuals[individuals.length - 1]);
        avgFitnesstOfEachGeneration.push(this.calculateAverage(individuals));

        while (true) {
            while (newIndividuals.length < NUMBER_OF_CHILDS_TO_BE_GENERATED) {
                const individual1 = this.selectByTournament(individuals);
                const individual2 = this.selectByTournament(individuals);
                this.reproduceOneChild(individual1, individual2);
            }

            const parentAndChildren: Individual[] = [...individuals, ...newIndividuals];
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
        fittestIndividualsOfEachGeneration.forEach(fittestIndividual => console.log(fittestIndividual));

        console.log("\n\n*****************************************************");
        console.log("\nAvg fitness of each gen \n\n" + avgFitnesstOfEachGeneration);
    }

    private selectByTournament(individuals: Individual[]): Individual {
        const tournamentParticipants: Individual[] = [];

        while (tournamentParticipants.length < this.tournamentSize) {
            const randomIndex = Math.floor(Math.random() * individuals.length);
            tournamentParticipants.push(individuals[randomIndex]);
        }

        tournamentParticipants.sort((a, b) => b.fitness - a.fitness);

        return tournamentParticipants[0];
    }

    private isStoppingCriteria2Satisfied(): boolean {
        let startIndex = avgFitnesstOfEachGeneration.length - 10;
        for (; startIndex < avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(avgFitnesstOfEachGeneration[startIndex] - avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) {
                return false;
            }
        }
        return true;
    }

    private reproduceOneChild(individual1: Individual, individual2: Individual): void {
        const newChild = this.doCrossover(individual1, individual2);
        const randomValue = this.allowMutationBasedOnRandomNumber();
        if (randomValue !== -1) {
            this.doMutation(randomValue, newChild);
        }
        newIndividuals.push(newChild);
    }

    private doCrossover(individual1: Individual, individual2: Individual): Individual {
        const newChildX = (individual1.x + individual2.x) / 2;
        const newChildY = (individual1.y + individual2.y) / 2;
        const fitness = this.calculateFitness(newChildX, newChildY);
        return new Individual(newChildX, newChildY, fitness);
    }

    private allowMutationBasedOnRandomNumber(): number {
        const randomNumber = Math.floor(Math.random() * 400) + 1;
        return randomNumber >= 1 && randomNumber <= 100 ? randomNumber : -1;
    }

    private doMutation(randomValue: number, individual: Individual): void {
        if (randomValue > 50) {
            individual.x = this.resetBoundary(individual.x, -15, 15);
        } else {
            individual.y = this.resetBoundary(individual.y, -25, 20);
        }
    }

    private resetBoundary(elementToBeChecked: number, lowerBoundary: number, upperBoundary: number): number {
        if (elementToBeChecked < lowerBoundary) return lowerBoundary;
        if (elementToBeChecked > upperBoundary) return upperBoundary;
        return elementToBeChecked;
    }

    private initializeIndividuals(): void {
        for (let i = 0; i < NUMBER_OF_INDIVIDUALS_TO_BE_SELECTED; i++) {
            const x = this.randomNumberBetween(-15, 15);
            const y = this.randomNumberBetween(-25, 20);
            const fitness = this.calculateFitness(x, y);
            individuals.push(new Individual(x, y, fitness));
        }
    }

    private randomNumberBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private calculateFitness(x: number, y: number): number {
        return 100 - Math.pow((x - 7 * y), 2) - Math.pow((x + y - 11), 2);
    }

    private sortIndividuals(individuals: Individual[]): void {
        individuals.sort((a, b) => a.fitness - b.fitness);
    }

    private calculateAverage(individuals: Individual[]): number {
        const sum = individuals.reduce((total, individual) => total + individual.fitness, 0);
        return sum / individuals.length;
    }
}

const tournamentBasedEvolutionaryAlgorithm = new TournamentBasedEvolutionaryAlgorithm(3);
tournamentBasedEvolutionaryAlgorithm.runAlgo();
