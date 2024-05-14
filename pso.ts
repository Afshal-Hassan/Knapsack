class Individual {
    x: number;
    y: number;
    vx: number;
    vy: number;
    fitness: number;
    pbest: Individual | null;

    constructor(x: number, y: number, pbest: Individual | null, fitness: number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.pbest = pbest;
        this.fitness = fitness;
    }

    toString(): string {
        return `Individual{x=${this.x}, y=${this.y}, vx=${this.vx}, vy=${this.vy}, fitness=${this.fitness}}\n`;
    }
}

const C1: number = 2;
const C2: number = 2;
const LOWER_X: number = -5;
const UPPER_X: number = 5;
const LOWER_Y: number = -1;
const UPPER_Y: number = 20;

interface Random {
    nextDouble(min: number, max: number): number;
}

class PSOAlgorithm {
    static rand: Random = {
        nextDouble(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }
    };
    static avgFitnessOfEachIteration: number[] = [];
    static gBestOfEachIteration: number[] = [];

    static initializeIndividuals(individuals: Individual[]): void {
        for (let i = 0; i < 10; i++) {
            individuals.push(PSOAlgorithm.initializeIndividual());
        }
    }

    static initializeIndividual(): Individual {
        const x: number = Math.random() * (UPPER_X - LOWER_X) + LOWER_X;
        const y: number = Math.random() * (UPPER_Y - LOWER_Y) + LOWER_Y;
        const fitness: number = PSOAlgorithm.calculateFitness(x, y);
        const initialPbest: Individual | null = null;
        return new Individual(x, y, initialPbest, fitness);
    }

    static calculateFitness(x: number, y: number): number {
        return (100 - Math.pow(x, 2)) + (Math.pow(y, 2) - 56 * x * y) - Math.pow(Math.sin(x / 2), 2);
    }

    static updateVelocityAndPosition(I: Individual, gbest: Individual): Individual {
        I.vx = I.vx + C1 * Math.random() * (I.pbest!.x - I.x) + C2 * Math.random() * (gbest.x - I.x);
        I.vy = I.vy + C1 * Math.random() * (I.pbest!.y - I.y) + C2 * Math.random() * (gbest.y - I.y);
        I.x = Math.max(LOWER_X, Math.min(UPPER_X, I.x + I.vx));
        I.y = Math.max(LOWER_Y, Math.min(UPPER_Y, I.y + I.vy));
        return I;
    }

    static calculatePbest(I: Individual): Individual {
        if (!I.pbest || I.pbest.fitness < I.fitness) {
            I.pbest = I;
        }
        return I;
    }

    static findGlobalBest(Iarr: Individual[]): Individual {
        let globalBest: Individual = Iarr[0];
        for (let i = 1; i < Iarr.length; i++) {
            if (Iarr[i].fitness > globalBest.fitness) {
                globalBest = Iarr[i];
            }
        }
        return globalBest;
    }

    static checkFitnessDifferenceZero(Iarr: Individual[], gBest: Individual, step: number): boolean {
        if (step === 1) {
            return true;
        }
        let allIndividualsFitnessSum: number = 0;
        for (let i = 0; i < 10; i++) {
            allIndividualsFitnessSum += Iarr[i].fitness;
        }
        const avgFitness: number = allIndividualsFitnessSum / 10;
        const difference: number = Math.abs(avgFitness - gBest.fitness);
        return difference > Number.MIN_VALUE;
    }

    static calculateAverage(individuals: Individual[]): number {
        const sumOfIndividualsFitness: number = PSOAlgorithm.getSumOfIndividualsFitness(individuals);
        return sumOfIndividualsFitness / individuals.length;
    }

    static getSumOfIndividualsFitness(individuals: Individual[]): number {
        return individuals.reduce((sum, individual) => sum + individual.fitness, 0);
    }

    static psoAlgorithm(): void {
        const individualArray: Individual[] = [];

        PSOAlgorithm.initializeIndividuals(individualArray);

        let gbest: Individual = PSOAlgorithm.findGlobalBest(individualArray);

        let step: number = 1;
        while (PSOAlgorithm.checkFitnessDifferenceZero(individualArray, gbest, step)) {
            console.log(`-----------------------------STEP NO : ${step}-----------------------------`);
            for (const individual of individualArray) {
                individual.fitness = PSOAlgorithm.calculateFitness(individual.x, individual.y);
                individual.pbest = PSOAlgorithm.calculatePbest(individual);
            }
            gbest = PSOAlgorithm.findGlobalBest(individualArray);
            PSOAlgorithm.avgFitnessOfEachIteration.push(PSOAlgorithm.calculateAverage(individualArray));
            PSOAlgorithm.gBestOfEachIteration.push(gbest.fitness);
            for (const I of individualArray) {
                PSOAlgorithm.updateVelocityAndPosition(I, gbest);
            }
            console.log(individualArray);
            step++;
        }
        console.log("Avg fitness of each iteration: " + PSOAlgorithm.avgFitnessOfEachIteration);
        console.log("Gbest fitnses of each iteration: " + PSOAlgorithm.gBestOfEachIteration);

    }

    static main(): void {
        PSOAlgorithm.psoAlgorithm();
    }
}

function Random() {
    return {
        nextDouble(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }
    };
}

PSOAlgorithm.main();
