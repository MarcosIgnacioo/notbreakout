import './style.css'
import p5 from 'p5'

interface Vector2 {
  x: number;
  y: number;
}

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 800
let PAUSE = false
const FPS = 60
const DELTA_TIME_SEC = 1.0 / FPS
//const total_tiles = 8
//const tile_width = WIDTH / total_tiles
//
let x = 100
let dx = 1
let y = 50
let dy = 1
const BB_WIDTH = 10
const BB_HEIGHT = BB_WIDTH
const BB_SPEED = 400
const BAR_WIDTH = 100
const BAR_HEIGHT = 20


interface Entity {
  dir: Vector2
  pos: Vector2
  color: number[]
  speed: number
  handle_collisions: () => void
  update: () => void
  draw: (p: p5) => void
}

class Ball implements Entity {
  radius: number
  dir: Vector2
  pos: Vector2
  color: number[]
  speed: number
  constructor(
    dir: Vector2,
    pos: Vector2,
    color: number[],
    speed: number,
    radius: number,
  ) {
    this.dir = dir
    this.pos = pos
    this.color = color
    this.speed = speed
    this.radius = radius
  }

  handle_collisions() {
    //
    let nx = this.pos.x + this.dir.x * this.speed * DELTA_TIME_SEC
    let ny = this.pos.y + this.dir.y * this.speed * DELTA_TIME_SEC

    // why  i do not need to do nx - this.radius
    if (nx - this.radius < 0 || nx + this.radius > SCREEN_WIDTH) {
      this.dir.x *= -1
      nx = this.pos.x + this.dir.x * this.speed * DELTA_TIME_SEC
    }

    if (ny - this.radius < 0 || ny + this.radius > SCREEN_WIDTH) {
      this.dir.y *= -1
      ny = this.pos.y + this.dir.y * this.speed * DELTA_TIME_SEC
    }

    this.pos = { x: nx, y: ny }
    //let nx = ent.pos.x + ent.dir.x * ent.speed * DELTA_TIME_SEC
    //let ny = ent.pos.y + ent.dir.y * ent.speed * DELTA_TIME_SEC

    //if (ny < 0 || ny + BB_HEIGHT > SCREEN_HEIGHT) {
    //  dy *= -1
    //  ny = y + dy * BB_SPEED * DELTA_TIME_SEC
    //}
  }

  draw(p: p5) {
    p.fill(this.color)
    p.circle(this.pos.x, this.pos.y, this.radius * 2)
    //
  }

  update() {
    //
  }

}

class Bar implements Entity {
  width: number
  height: number
  dir: Vector2
  pos: Vector2
  color: number[]
  speed: number
  constructor(
    dir: Vector2,
    pos: Vector2,
    color: number[],
    speed: number,
    width: number,
    height: number
  ) {
    this.dir = dir
    this.pos = pos
    this.color = color
    this.speed = speed
    this.width = width
    this.height = height
  }

  handle_collisions() {
    //
    let nx = this.pos.x + this.dir.x * this.speed * DELTA_TIME_SEC

    // why  i do not need to do nx - this.radius
    if (nx < 0) {
      nx = 0
    }
    if (nx + this.width > SCREEN_WIDTH) {
      nx = SCREEN_WIDTH - this.width
    }

    this.pos.x = nx
  }

  draw(p: p5) {
    p.fill(this.color)
    p.rect(this.pos.x, this.pos.y, this.width, this.height)
  }

  update() {
    //
  }

}



const bar: Entity = new Bar(
  { x: 1, y: 0 },
  { x: SCREEN_WIDTH / 2 - BAR_WIDTH / 2, y: SCREEN_HEIGHT - BAR_HEIGHT },
  [244, 171, 187],
  1000,
  BAR_WIDTH,
  BAR_HEIGHT,
)

const breaking_ball: Entity = new Ball(
  { x: 0, y: 0 },
  { x: SCREEN_WIDTH / 2 - BB_WIDTH / 2, y: SCREEN_HEIGHT - BAR_HEIGHT - BB_HEIGHT },
  [255, 255, 255],
  BB_SPEED,
  BB_WIDTH,
)
const entities: Entity[] = [bar, breaking_ball]

const sketch = (p: p5): any => {

  p.setup = function() {
    p.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  function update_entity(ent: Entity) {
    ent.handle_collisions()
  }

  // ooga booga
  function handle_input() {
    // this could be easily remapble as global variables but ooga booga

    bar.dir.x = 0
    if (p.keyIsDown(65)) {
      bar.dir.x = -1
    }
    if (p.keyIsDown(68)) {
      bar.dir.x = 1
    }

    // space
    if (p.keyIsDown(32)) {
      breaking_ball.dir = { x: 1, y: -1 }
    }

    // nintnedo sue me 
    // totk reversing time mechanic
    if (p.keyIsDown(38)) {
      breaking_ball.speed += 10
      breaking_ball.speed = Math.min(breaking_ball.speed, 300)
    }
    if (p.keyIsDown(40)) {
      breaking_ball.speed -= 10
      breaking_ball.speed = Math.max(breaking_ball.speed, -300)
    }
  }

  p.draw = function() {
    p.background(0, 0, 0)

    handle_input()
    if (!PAUSE) {
      entities.forEach(ent => {
        update_entity(ent)
      })
    }
    entities.forEach(ent => {
      ent.draw(p)
    })

  }

  p.keyPressed = function() {
    if (p.keyCode === p.ENTER) {
      PAUSE = !PAUSE
    }
  }
}
new p5(sketch);
