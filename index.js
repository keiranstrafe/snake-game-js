const gridSize = 30
const pixelSize = 30

const width = height = gridSize * pixelSize

let snake = []
let openSpots = []

let isGameRunning = false
let snakeMoveDirection = 'east'
let lastDirectionKeyPress = ''

const canvas = document.getElementById('canvas')
canvas.width = width
canvas.height = height
const ctx = canvas.getContext('2d')

let foodPosition = null

const isCollision = (p) => {
	for (let i = 0; i < snake.length; i++) {
		if (snake[i].x === p.x && snake[i].y === p.y) {
			return true
		}
	}

	return false
}

const drawGrid = () => {

	ctx.strokeColor = 'black'
	ctx.lineWidth = 1
	ctx.strokeRect(0, 0, width, height)

	for (let i = 1; i < gridSize; i++) {
		ctx.moveTo(i * pixelSize + 0.5, 0)
		ctx.lineTo(i * pixelSize + 0.5, height)
		ctx.stroke()

		ctx.moveTo(0, i * pixelSize + 0.5)
		ctx.lineTo(width, i * pixelSize + 0.5)
		ctx.stroke()
	}
}

const drawSnake = () => {
	ctx.fillStyle = 'black'

	for (let i = 0; i < snake.length; i++) {
		const p = snake[i]

		const x = p.x * pixelSize + 3
		const y = p.y * pixelSize + 3

		ctx.fillRect(x, y, pixelSize - 5, pixelSize - 5)
	}
}

const drawFood = () => {
	if (foodPosition) {
		ctx.fillStyle = 'white'
		ctx.fillRect(foodPosition.x * pixelSize + 2, foodPosition.y * pixelSize + 2, pixelSize - 2, pixelSize - 2)
	}

	const r = Math.floor(Math.random() * (openSpots.length - 1))
	const x = openSpots[r].x * pixelSize + (pixelSize / 2) + .5
	const y = openSpots[r].y * pixelSize + (pixelSize / 2) + .5

	foodPosition = { x: openSpots[r].x, y: openSpots[r].y }

	ctx.fillStyle = 'red'
	ctx.beginPath()
	ctx.arc(x, y, (pixelSize / 2) - 2, 0, 2 * Math.PI)
	ctx.fill()
}

const moveSnake = () => {
	const { x, y } = snake[0]
	const newPos = { x, y }
	if (snakeMoveDirection === 'north') {
		newPos.y -= 1
		if (newPos.y < 0) {
			newPos.y = gridSize - 1
		}
	} else if (snakeMoveDirection === 'east') {
		newPos.x += 1
		if (newPos.x >= gridSize) {
			newPos.x = 0
		}
	} else if (snakeMoveDirection === 'south') {
		newPos.y += 1
		if (newPos.y >= gridSize) {
			newPos.y = 0
		}
	} else if (snakeMoveDirection === 'west') {
		newPos.x -= 1
		if (newPos.x < 0) {
			newPos.x = gridSize - 1
		}
	}

	if (isCollision(newPos)) {
		reset()
		return
	}

	snake.unshift(newPos)

	if (foodPosition && newPos.x === foodPosition.x && newPos.y === foodPosition.y) {
		drawFood()
		score += 1
		document.getElementById('score').innerText = score
	} else {
		const l = snake.pop()
		ctx.clearRect(l.x * pixelSize + 3, l.y * pixelSize + 3, pixelSize - 5, pixelSize - 5)
		openSpots.push({ x: l.x, y: l.y })
	}

	const ix = openSpots.findIndex(jj => jj.x === newPos.x && jj.y === newPos.y)
	openSpots.splice(ix, 1)
}

let lastTimeStamp = new Date()

const handleAnimationFrame = () => {
	if (new Date() - lastTimeStamp >= 500) {
		if (lastDirectionKeyPress === 'ArrowUp' && snakeMoveDirection !== 'south') {
			snakeMoveDirection = 'north'
		} else if (lastDirectionKeyPress === 'ArrowRight' && snakeMoveDirection !== 'west') {
			snakeMoveDirection = 'east'
		} else if (lastDirectionKeyPress === 'ArrowLeft' && snakeMoveDirection !== 'east') {
			snakeMoveDirection = 'west'
		} else if (lastDirectionKeyPress === 'ArrowDown' && snakeMoveDirection !== 'north') {
			snakeMoveDirection = 'south'
		}

		moveSnake()
		drawSnake()
		lastTimeStamp = new Date()
	}
	requestAnimationFrame(handleAnimationFrame)
}

const reset = () => {
	snake = [
		{ x: 8, y: 4 },
		{ x: 7, y: 4 },
		{ x: 6, y: 4 },
	]

	openSpots = []

	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			if (y === snake[0].x && y === snake[0].y) {
				continue
			}

			openSpots.push({ x, y })
		}
	}

	snakeMoveDirection = 'east'
	lastDirectionKeyPress = ''
	score = 0

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	drawGrid()
	drawSnake()
	drawFood()
}

reset()

requestAnimationFrame(handleAnimationFrame)

window.addEventListener('keyup', (e) => {
	lastDirectionKeyPress = e.key
})