//init buttons
let startBtn = document.getElementById('startBtn')
let blue = document.getElementById('blue')
let purple = document.getElementById('purple')
let orange = document.getElementById('orange')
let green = document.getElementById('green')
let messages = document.querySelector('h3')
let levels = 5
startBtn.addEventListener('click', startGame)

class Message {
    constructor() {}
    async showFirstLevel() {
        return Swal.fire({
            title: 'Nivel 1',
            text: 'Estas listo para el reto?',
            imageUrl: 'img/play-now.gif',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
            animation: false,
            allowOutsideClick: false
        })
    }

    async showNextLevel(level, messages) {
        return Swal.fire({
            title: `Nivel ${level}`,
            text: `Felizidades pasaste el nivel ${level -
                1} esta listo para el siguiente?`,
            imageUrl: 'img/good-job.gif',
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Custom image',
            animation: false,
            allowOutsideClick: false
        })
    }

    async showGameOver(level) {
        return Swal.fire({
            title: `Intenta otra vez`,
            text: `Lo sentimos has perdido en el nivel ${level}`,
            imageUrl: 'img/game-over.gif',
            imageWidth: 400,
            imageHeight: 300,
            imageAlt: 'Custom image',
            animation: false,
            allowOutsideClick: false
        })
    }

    async showWinner() {
        return Swal.fire({
            title: `Felicidades`,
            text: `Has ganado el juego`,
            imageUrl: 'img/you-win.gif',
            imageWidth: 400,
            imageHeight: 300,
            imageAlt: 'Custom image',
            animation: false,
            allowOutsideClick: false
        })
    }
}

class Game extends Message {
    constructor() {
        super()
        this.levels = levels
        this.patron = null
        this.currentLevel = 0
        this.currentPatron = 0
        this.colors = {
            blue,
            purple,
            orange,
            green
        }
        this.turnOnPatron = this.turnOnPatron.bind(this)
        this.chooseColor = this.chooseColor.bind(this)
        this.nextLevel = this.nextLevel.bind(this)
        this.hideStartButton()
        this.start()
    }

    start() {
        this.generatePatron()
        this.nextLevel()
    }

    nextLevel() {
        this.currentLevel++
        this.currentPatron = 0
        if (this.currentLevel === 1) {
            this.showFirstLevel().then(response => {
                setTimeout(this.turnOnPatron, 500)
            })
        } else {
            this.showNextLevel(this.currentLevel).then(response => {
                setTimeout(this.turnOnPatron, 500)
            })
        }
    }

    hideStartButton() {
        startBtn.classList.add('hide')
    }

    getColorByNumber(number) {
        switch (number) {
            case 0:
                return 'blue'
            case 1:
                return 'purple'
            case 2:
                return 'orange'
            case 3:
                return 'green'
        }
    }

    getNumberByColor(color) {
        switch (color) {
            case 'blue':
                return 0
            case 'purple':
                return 1
            case 'orange':
                return 2
            case 'green':
                return 3
        }
    }

    generatePatron() {
        this.patron = new Array(this.levels)
            .fill(0)
            .map(number => Math.floor(Math.random() * 4))
    }

    turnOnPatron() {
        for (let i = 0; i < this.currentLevel; i++) {
            let colorNumber = this.patron[i]
            setTimeout(() => {
                this.turnOnCurrentPatron(colorNumber)
            }, i * 1000)
        }
        this.enableClickEvents()
    }

    turnOnCurrentPatron(colorNumber) {
        let color = this.getColorByNumber(colorNumber)
        this.colors[color].classList.add('light')
        setTimeout(() => {
            this.colors[color].classList.remove('light')
        }, 250)
    }

    enableClickEvents() {
        this.colors.blue.addEventListener('click', this.chooseColor)
        this.colors.purple.addEventListener('click', this.chooseColor)
        this.colors.orange.addEventListener('click', this.chooseColor)
        this.colors.green.addEventListener('click', this.chooseColor)
    }

    disableClickEvents() {
        this.colors.blue.removeEventListener('click', this.chooseColor)
        this.colors.purple.removeEventListener('click', this.chooseColor)
        this.colors.orange.removeEventListener('click', this.chooseColor)
        this.colors.green.removeEventListener('click', this.chooseColor)
    }

    chooseColor(event) {
        let color = event.target.dataset.color
        let colorNumber = this.getNumberByColor(color)
        this.turnOnCurrentPatron(colorNumber)
        //si el color que selecciono es igual al color de los patrones en la posicion del nivel actual entonces checar el siguiente patron
        if (this.isCorrectOption(colorNumber)) {
            //hasta este punto acertaste el boton
            this.currentPatron++
            //ahora comparamos si el patron actual es = al nivel actual, si es igual verificar si el nivel es igual al maximo nivel
            if (this.currentPatron === this.currentLevel) {
                //si el currentLevel es = al numero de niveles el usuario a ganado
                if (this.currentLevel === this.levels) {
                    this.showWinner().then(startBtn.classList.remove('hide'))
                } else {
                    //si no quiere decir que aun faltan niveles
                    setTimeout(this.nextLevel, 1500)
                }
            } else {
                console.log('faltan botones por presionar')
            }
        } else {
            this.disableClickEvents()
            this.showGameOver(this.currentLevel).then(
                startBtn.classList.remove('hide')
            )
        }
    }

    isCorrectOption(colorNumber) {
        return colorNumber === this.patron[this.currentPatron]
    }
}

function startGame() {
    window.juego = new Game()
}
