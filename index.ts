import * as fs from 'fs';
import * as readline from 'readline';
import * as crypto from 'crypto';

class EvolutionaryAlgorithmKnapSack {
    static noOfChildrenToBeGenerated: number = 10;
    static noOfIndividualsToBeSelected: number = 10;
    static individuals: Individual[] = [];
    static availableItems: Item[] = [];
    static newIndividuals: Individual[] = [];
    static selectedItems: Individual[] = [];
    static fittestIndividualsOfEachGeneration: Individual[] = [];
    static avgFitnesstOfEachGeneration: number[] = [];
    static maxWeightLimit: number = 18;

    runAlgo(): void {
        this.setItemsToBeSelectedForKnapSack();
        this.initializeIndividuals();
        this.sortIndividuals(EvolutionaryAlgorithmKnapSack.individuals);
        console.log("Starting gen: " + EvolutionaryAlgorithmKnapSack.individuals);
        EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithmKnapSack.individuals[0]);
        EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithmKnapSack.individuals));

        while (true) {
            while (EvolutionaryAlgorithmKnapSack.newIndividuals.length < EvolutionaryAlgorithmKnapSack.noOfChildrenToBeGenerated) {
                let individual1 = EvolutionaryAlgorithmKnapSack.individuals[this.generateRandomIndexForSelectingIndividual()];
                let indexForSecondParent = this.generateRandomIndexForSelectingIndividual();
                let individual2 = EvolutionaryAlgorithmKnapSack.individuals[indexForSecondParent];
                if (individual1.equals(individual2)) individual2 = EvolutionaryAlgorithmKnapSack.individuals[(indexForSecondParent + 1) % 10];
                this.reproduce(individual1, individual2);
            }

            let parentAndChildren: Individual[] = [...EvolutionaryAlgorithmKnapSack.individuals, ...EvolutionaryAlgorithmKnapSack.newIndividuals];
            this.sortIndividuals(parentAndChildren);
            EvolutionaryAlgorithmKnapSack.selectedItems = parentAndChildren.slice(0, EvolutionaryAlgorithmKnapSack.noOfIndividualsToBeSelected);
            EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration.push(EvolutionaryAlgorithmKnapSack.selectedItems[0]);
            console.log("Selected New Individuals: " + EvolutionaryAlgorithmKnapSack.selectedItems);
            console.log("Avg fitness Individuals: " + EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration);
            EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.push(this.calculateAverage(EvolutionaryAlgorithmKnapSack.selectedItems));

            if (EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }

            EvolutionaryAlgorithmKnapSack.individuals = EvolutionaryAlgorithmKnapSack.selectedItems;
            EvolutionaryAlgorithmKnapSack.newIndividuals = [];
        }

        console.log("Fittest indv of each gen " + EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration);
        console.log("Avg fitness of each gen " + EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration);

        // Specify the file path
        const filePath: string = "fitness_data.txt";

        try {
            const writer = fs.createWriteStream(filePath);
            for (let data of EvolutionaryAlgorithmKnapSack.fittestIndividualsOfEachGeneration) {
                writer.write(`${data.calculateTotalWeight().toFixed(6)} ${data.calculateTotalWorth().toFixed(6)}\n`);
            }
            console.log("Objects saved to file successfully.");
            writer.close();
        } catch (err) {
            console.error(err);
        }
    }

    assignDifferentParent(individual1: Individual): Individual {
        let individual2 = EvolutionaryAlgorithmKnapSack.individuals[(this.generateRandomIndexForSelectingIndividual() + 1) % 10];
        if (individual1.equals(individual2)) {
            console.log("Same parents" + individual2);
            return this.assignDifferentParent(individual1);
        }
        return individual2;
    }

    static loadFromFile(): Individual[] {
        try {
            const data = fs.readFileSync("fitness_data.txt", 'utf8').split('\n');
            let individuals: Individual[] = [];
            for (let line of data) {
                const [weight, worth] = line.split(' ').map(Number);
                individuals.push(new Individual(weight, worth));
            }
            return individuals;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    readItems(fileName: string): void {
        let items: Item[] = [];
        let capacity: number = 0;

        const rl = readline.createInterface({
            input: fs.createReadStream(fileName),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            const parts = line.split(/\s+/);
            if (parts.length === 2) {
                const weight = parseFloat(parts[0]);
                const worth = parseFloat(parts[1]);
                items.push(new Item(weight, worth));
            } else if (parts.length === 1) {
                EvolutionaryAlgorithmKnapSack.maxWeightLimit = parseFloat(parts[0]);
            }
        });

        rl.on('close', () => {
            EvolutionaryAlgorithmKnapSack.availableItems = items;
        });
    }

    reproduce(individual1: Individual, individual2: Individual): void {
        let newChildrenPair = this.doUniformCrossOver(individual1, individual2);
        let randomValue = this.allowMutationBasedOnRandomNumber();
        if (newChildrenPair !== null) {
            if (randomValue !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[0]);
            }
            randomValue = this.allowMutationBasedOnRandomNumber();
            if (randomValue !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[1]);
            }
            EvolutionaryAlgorithmKnapSack.newIndividuals.push(newChildrenPair[0]);
            EvolutionaryAlgorithmKnapSack.newIndividuals.push(newChildrenPair[1]);
        }
    }

    doNPointCossOver(individual1: Individual, individual2: Individual): Individual[] | null {
        let newIndividual1: Individual = new Individual();
        for (let i = 0; i < individual1.pickedItems.length; i++) {
            if (i % 2 === 0) newIndividual1.pickedItems.push(individual1.pickedItems[i]);
            else newIndividual1.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual1)) {
                return null;
            }
        }
        let newIndividual2: Individual = new Individual();
        for (let i = 0; i < individual2.pickedItems.length; i++) {
            if (i % 2 === 0) newIndividual2.pickedItems.push(individual2.pickedItems[i]);
            else newIndividual2.pickedItems.push(individual1.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual2)) {
                return null;
            }
        }
        return [newIndividual1, newIndividual2];
    }

    doUniformCrossOver(individual1: Individual, individual2: Individual): Individual[] | null {
        let newIndividual1: Individual = new Individual();
        let random: number;
        for (let i = 0; i < individual1.pickedItems.length; i++) {
            random = this.generateRandomDoubleForUniformCrossover();
            if (random >= 0 && random <= 0.5) newIndividual1.pickedItems.push(individual1.pickedItems[i]);
            else if (random > 0.5 && random <= 1) newIndividual1.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual1)) {
                return null;
            }
        }
        let newIndividual2: Individual = new Individual();
        for (let i = 0; i < individual1.pickedItems.length; i++) {
            random = this.generateRandomDoubleForUniformCrossover();
            if (random >= 0 && random <= 0.5) newIndividual2.pickedItems.push(individual1.pickedItems[i]);
            else if (random > 0.5 && random <= 1) newIndividual2.pickedItems.push(individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual2)) {
                return null;
            }
        }
        return [newIndividual1, newIndividual2];
    }

    doMutationBitFlip(randomValue: number, individual: Individual): void {
        let random = this.generateRandomIndexForSelectingIndividual();
        if (randomValue > 50) {
            individual.pickedItems[random] = true;
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[random] = false;
        } else {
            individual.pickedItems[random] = false;
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[random] = true;
        }
    }

    doMutationBitsSwap(randomValue: number, individual: Individual): void {
        let random1 = this.generateRandomIndexForSelectingIndividual();
        let random2 = this.generateRandomIndexForSelectingIndividual();
        let bitAtRandom1 = individual.pickedItems[random1];
        let bitAtRandom2 = individual.pickedItems[random2];
        individual.pickedItems[random1] = bitAtRandom2;
        individual.pickedItems[random2] = bitAtRandom1;
        if (!this.isElementWithinLimits(individual)) {
            individual.pickedItems[random1] = bitAtRandom1;
            individual.pickedItems[random2] = bitAtRandom2;
        }
    }

    generateRandomIndexForSelectingIndividual(): number {
        return crypto.randomInt(0, 10);
    }

    generateRandomDoubleForUniformCrossover(): number {
        const randomBytes = crypto.randomBytes(4); // 4 bytes for a 32-bit float
        const float = randomBytes.readUInt32LE(0) / 0xffffffff; // Convert bytes to a float between 0 and 1
        return float * 1.00001; // Scale to range [0, 1.00001)
    }


    allowMutationBasedOnRandomNumber(): number {
        let randomNumber = crypto.randomInt(1, 401);
        if (randomNumber >= 1 && randomNumber <= 100) return randomNumber;
        else return -1;
    }

    isElementWithinLimits(individual: Individual): boolean {
        return individual.calculateTotalWeight() <= EvolutionaryAlgorithmKnapSack.maxWeightLimit;
    }

    calculateAverage(individuals: Individual[]): number {
        let sumOfIndividualsFitness: number = individuals.reduce((sum, indv) => sum + indv.calculateTotalWorth(), 0);
        return sumOfIndividualsFitness / individuals.length;
    }

    initializeIndividuals(): void {
        for (let i = 0; i < EvolutionaryAlgorithmKnapSack.noOfIndividualsToBeSelected; i++) {
            EvolutionaryAlgorithmKnapSack.individuals.push(this.initializeIndividual());
        }
    }

    initializeIndividual(): Individual {
        let individual: Individual = new Individual();
        let random = crypto.randomBytes(EvolutionaryAlgorithmKnapSack.availableItems.length);
        for (let i = 0; i < EvolutionaryAlgorithmKnapSack.availableItems.length; i++) {
            individual.pickedItems.push(random[i] % 2 === 0);
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[i] = false;
        }
        return individual;
    }

    isStoppingCriteria2Satisfied(): boolean {
        let startIndex = EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length - 10;
        for (; startIndex < EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration[startIndex] - EvolutionaryAlgorithmKnapSack.avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) return false;
        }
        return true;
    }

    sortIndividuals(individuals: Individual[]): void {
        individuals.sort((a, b) => b.compareTo(a));
    }

    setItemsToBeSelectedForKnapSack(): void {
        this.readItems("D:/AI-CI/problem.txt");
    }
}

class Individual {
    weight: number;
    worth: number;
    pickedItems: boolean[] = [];

    constructor(weight: number = 0, worth: number = 0) {
        this.weight = weight;
        this.worth = worth;
    }

    compareTo(other: Individual): number {
        return this.calculateTotalWorth() - other.calculateTotalWorth();
    }

    equals(obj: any): boolean {
        if (this === obj) return true;
        if (obj == null || !(obj instanceof Individual)) return false;
        let individual = obj as Individual;
        return this.pickedItems.every((val, index) => val === individual.pickedItems[index]);
    }

    hashCode(): number {
        return crypto.createHash('sha256').update(this.worth.toString()).digest('base64').length;
    }

    toString(): string {
        return `{ Selected bits: ${this.pickedItems} weight : ${this.calculateTotalWeight()} Worth is: ${this.calculateTotalWorth()} } \n`;
    }

    calculateTotalWorth(): number {
        let worth = 0.0;
        for (let i = 0; i < this.pickedItems.length; i++) {
            if (this.pickedItems[i]) worth += EvolutionaryAlgorithmKnapSack.availableItems[i]?.worth;
        }
        return worth;
    }

    calculateTotalWeight(): number {
        let weight = 0.0;
        for (let i = 0; i < this.pickedItems.length; i++) {
            if (this.pickedItems[i]) weight += EvolutionaryAlgorithmKnapSack.availableItems[i]?.weight;
        }
        return weight;
    }
}

class Item {
    weight: number;
    worth: number;

    constructor(weight: number = 0, worth: number = 0) {
        this.weight = weight;
        this.worth = worth;
    }

    compareTo(other: Item): number {
        return this.worth - other.worth;
    }

    equals(obj: any): boolean {
        if (this === obj) return true;
        if (obj == null || !(obj instanceof Item)) return false;
        let item = obj as Item;
        return this.weight === item.weight && this.worth === item.worth;
    }

    hashCode(): number {
        return crypto.createHash('sha256').update(this.worth.toString()).digest('base64').length;
    }

    toString(): string {
        return `{ weight : ${this.weight} Worth is: ${this.worth} } \n`;
    }
}

const evolutionaryAlgorithm = new EvolutionaryAlgorithmKnapSack();
evolutionaryAlgorithm.runAlgo();
