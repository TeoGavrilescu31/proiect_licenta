// Definirea clasei NeuralNetwork
class NeuralNetwork {
  constructor(inputSize, outputSize) {
    // Inițializarea proprietăților
    this.inputSize = inputSize
    this.outputSize = outputSize
    this.weights = this.initializeWeights()
  }

  // Metodă pentru inițializarea aleatoare a greutăților
  initializeWeights() {
    const weights = []

    // Inițializarea cu valori aleatoare între -1 și 1
    for (let i = 0; i < this.outputSize; i++) {
      const layerWeights = []
      for (let j = 0; j < this.inputSize; j++) {
        layerWeights.push(Math.random() * 2 - 1)
      }
      weights.push(layerWeights)
    }

    console.log('weights', weights)

    return weights
  }

  // Metodă pentru realizarea predicției pe baza intrărilor
  predict(inputs) {
    const outputs = []
    console.log('inputs', inputs)
    console.log('this.weights', this.weights)

    // Calcularea ponderilor înmulțite cu intrările și aplicarea funcției de activare
    for (let i = 0; i < this.outputSize; i++) {
      let sum = 0
      for (let j = 0; j < this.inputSize; j++) {
        sum += inputs[j] * this.weights[i][j]
        console.log('this.weights[i][j]', this.weights[i][j])
      }
      const output = Math.floor(this.activationFunction(sum))
      console.log('output', output)
      outputs.push(output)
    }

    console.log('outputs', outputs)

    return outputs
  }

  activationFunction(x) {
    return 1 / (1 + Math.exp(-x))
  }

  // Actualizarea greutăților în funcție de rezultatele antrenamentului
  updateWeights(newWeights) {
    this.weights = newWeights
  }
}

export default NeuralNetwork
