const fs = require('fs');

class Individual {
    constructor() {
        this.weight = 0;
        this.worth = 0;
        this.pickedItems = [];
        this.availableItems = [];
    }

    calculateTotalWorth() {
        let worth = 0;
        this.pickedItems.forEach((present, index) => {
            if (present && this.availableItems[index]) this.worth += this.availableItems[index].worth;
        });
        return worth;
    }

    calculateTotalWeight() {
        let weight = 0;
        this.pickedItems.forEach((present, index) => {
            if (present && this.availableItems[index]) { // Add check for undefined
                this.weight += this.availableItems[index].weight;
            }
        });
        return weight;
    }

}

class Item {
    constructor(weight, worth) {
        this.weight = weight;
        this.worth = worth;
    }
}

class EvolutionaryAlgorithmKnapSack {
    constructor() {
        this.noOfChildrenToBeGenerated = 10;
        this.noOfIndividualsToBeSelected = 10;
        this.individuals = [];
        this.availableItems = [];
        this.newIndividuals = [];
        this.selectedItems = [];
        this.fittestIndividualsOfEachGeneration = [];
        this.avgFitnesstOfEachGeneration = [];
        this.maxWeightLimit = 18;
    }

    runAlgo() {
        this.setItemsToBeSelectedForKnapSack();
        this.initializeIndividuals();
        this.sortIndividuals(this.individuals);
        console.log("Starting gen: ", this.individuals);
        this.fittestIndividualsOfEachGeneration.push(this.individuals[0]);
        this.avgFitnesstOfEachGeneration.push(this.calculateAverage(this.individuals));

        while (true) {
            while (this.newIndividuals.length < this.noOfChildrenToBeGenerated) {
                const individual1 = this.individuals[this.generateRandomIndexForSelectingIndividual()];
                let indexForSecondParent = this.generateRandomIndexForSelectingIndividual();
                let individual2 = this.individuals[indexForSecondParent];
                if (individual1 === individual2) individual2 = this.individuals[(indexForSecondParent + 1) % 10];
                this.reproduce(individual1, individual2);
            }

            const parentAndChildren = [...this.individuals, ...this.newIndividuals];
            this.sortIndividuals(parentAndChildren);
            this.selectedItems = parentAndChildren.slice(0, this.noOfIndividualsToBeSelected);
            this.fittestIndividualsOfEachGeneration.push(this.selectedItems[0]);
            console.log("Selected New Individuals: ", this.selectedItems);
            console.log("Avg fitness Individuals: ", this.avgFitnesstOfEachGeneration);
            this.avgFitnesstOfEachGeneration.push(this.calculateAverage(this.selectedItems));

            if (this.avgFitnesstOfEachGeneration.length >= 10 && this.isStoppingCriteria2Satisfied()) {
                console.log("Criteria Satisfied");
                break;
            }

            this.individuals = this.selectedItems;
            this.newIndividuals = [];
        }

        console.log("Fittest indv of each gen ", this.fittestIndividualsOfEachGeneration);
        console.log("Avg fitness of each gen ", this.avgFitnesstOfEachGeneration);

        const filePath = "fitness_data.txt";
        const dataToWrite = this.fittestIndividualsOfEachGeneration.map(data => `${data.calculateTotalWeight().toFixed(6)} ${data.calculateTotalWorth().toFixed(6)}`).join("\n");

        fs.writeFileSync(filePath, dataToWrite);
        console.log("Objects saved to file successfully.");
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync("fitness_data.txt", 'utf8');
            return data.split('\n').map(line => {
                const [weight, worth] = line.trim().split(' ').map(parseFloat);
                return { weight, worth };
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    readItems(fileName) {
        const items = [];
        let capacity = 0;

        try {
            const data = fs.readFileSync(fileName, 'utf8');
            const lines = data.split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length === 2) {
                    const weight = parseFloat(parts[0]);
                    const worth = parseFloat(parts[1]);
                    items.push({ weight, worth });
                } else if (parts.length === 1) {
                    this.maxWeightLimit = parseFloat(parts[0]);
                }
            });
        } catch (err) {
            console.error(err);
        }

        this.availableItems = items;
    }

    reproduce(individual1, individual2) {
        const newChildrenPair = this.doUniformCrossOver(individual1, individual2);
        const randomValue = this.allowMutationBasedOnRandomNumber();
        if (newChildrenPair !== null) {
            if (randomValue !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[0]);
            }
            if (this.allowMutationBasedOnRandomNumber() !== -1) {
                this.doMutationBitFlip(randomValue, newChildrenPair[1]);
            }
            this.newIndividuals.push(...newChildrenPair);
        }
    }

    doUniformCrossOver(individual1, individual2) {
        const newIndividual1 = new Individual();
        const newIndividual2 = new Individual();
        for (let i = 0; i < individual1.pickedItems.length; i++) {
            const random = Math.random();
            newIndividual1.pickedItems.push(random >= 0 && random <= 0.5 ? individual1.pickedItems[i] : individual2.pickedItems[i]);
            newIndividual2.pickedItems.push(random >= 0 && random <= 0.5 ? individual1.pickedItems[i] : individual2.pickedItems[i]);
            if (!this.isElementWithinLimits(newIndividual1) || !this.isElementWithinLimits(newIndividual2)) {
                return null;
            }
        }
        return [newIndividual1, newIndividual2];
    }

    doMutationBitFlip(randomValue, individual) {
        const random = this.generateRandomIndexForSelectingIndividual();
        if (randomValue > 50) {
            individual.pickedItems[random] = true;
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[random] = false;
        } else {
            individual.pickedItems[random] = false;
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[random] = true;
        }
    }

    generateRandomIndexForSelectingIndividual() {
        return Math.floor(Math.random() * 10);
    }

    allowMutationBasedOnRandomNumber() {
        const randomNumber = Math.floor(Math.random() * 400) + 1;
        return randomNumber >= 1 && randomNumber <= 100 ? randomNumber : -1;
    }

    isElementWithinLimits(individual) {
        return individual.calculateTotalWeight() <= this.maxWeightLimit;
    }

    calculateAverage(individuals) {
        const sumOfIndividualsFitness = individuals.reduce((sum, ind) => sum + ind.calculateTotalWorth(), 0);
        return sumOfIndividualsFitness / individuals.length;
    }

    initializeIndividuals() {
        for (let i = 0; i < this.noOfIndividualsToBeSelected; i++) {
            this.individuals.push(this.initializeIndividual());
        }
    }

    initializeIndividual() {
        const individual = new Individual();
        for (let i = 0; i < this.availableItems.length; i++) {
            const randomBoolean = Math.random() >= 0.5;
            individual.pickedItems.push(randomBoolean);
            if (!this.isElementWithinLimits(individual)) individual.pickedItems[i] = false;
        }
        return individual;
    }

    isStoppingCriteria2Satisfied() {
        let startIndex = this.avgFitnesstOfEachGeneration.length - 10; // so that we always start with last 10
        for (; startIndex < this.avgFitnesstOfEachGeneration.length - 2; startIndex++) {
            if (Math.abs(this.avgFitnesstOfEachGeneration[startIndex] - this.avgFitnesstOfEachGeneration[startIndex + 1]) > 0.001) return false;
        }
        return true;
    }

    sortIndividuals(individuals) {
        individuals.sort((a, b) => b - a); // Reverse sort
    }

    setItemsToBeSelectedForKnapSack() {
        // read from txt file
        this.readItems("D:/AI-CI/problem.txt");
        // Assuming readItems function implementation is elsewhere in your code
    }
}

const evolutionaryAlgo = new EvolutionaryAlgorithmKnapSack();
evolutionaryAlgo.runAlgo();





