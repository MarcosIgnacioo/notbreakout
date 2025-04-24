import './style.css'
import p5 from 'p5'

interface Vector2 {
  x: number;
  y: number;
}

const SCREEN_WIDTH = 800
const SCREEN_HEIGHT = 800
const FPS = 60
const DELTA_TIME_SEC = 1.0 / FPS
//const total_tiles = 8
//const tile_width = WIDTH / total_tiles
//
const BB_WIDTH = 10
const FONT_SIZE = 24
const BB_HEIGHT = BB_WIDTH
const BB_SPEED = 400
const BAR_WIDTH = 100
const BAR_HEIGHT = 20
const BLOCK_WIDTH = SCREEN_WIDTH / 2
const BLOCK_HEIGHT = 24
const INITIAL_ROWS = 4

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
    // theere is a bug where collision from the sides aint working but i have like not that much time for doing that
    if (nx - this.radius < 0 || nx + this.radius > SCREEN_WIDTH) {
      this.dir.x *= -1
      nx = this.pos.x + this.dir.x * this.speed * DELTA_TIME_SEC
    }

    if (ny - this.radius < 0 || ny + this.radius > SCREEN_WIDTH) {
      this.dir.y *= -1
      ny = this.pos.y + this.dir.y * this.speed * DELTA_TIME_SEC
    }

    if (
      nx >= bar.pos.x && nx - this.radius <= bar.pos.x + (bar as Bar).width
      && ny + this.radius >= bar.pos.y && ny - this.radius <= bar.pos.y + (bar as Bar).height
    ) {
      this.dir.x *= Math.max(1, nx / SCREEN_WIDTH)
      this.dir.y *= Math.min(-1, ny / SCREEN_WIDTH)
      nx = this.pos.x + this.dir.x * this.speed * DELTA_TIME_SEC
      ny = this.pos.y + this.dir.y * this.speed * DELTA_TIME_SEC
    }

    this.pos = { x: nx, y: ny }
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


function get_random_rgb(): number[] {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255]
}

class Block implements Entity {
  dir: Vector2
  speed: number
  health: number
  width: number
  height: number
  pos: Vector2
  color: number[]
  constructor(
    pos: Vector2,
    health: number,
    color: number[],
  ) {
    this.dir = { x: 0, y: 0 }
    this.speed = 0
    this.pos = pos
    this.color = color
    this.width = BLOCK_WIDTH
    this.height = BLOCK_HEIGHT
    this.health = health
  }

  // i dont like this!@ but idk what would be a better way to put this in an oop way
  // the way my heart tells me is just to handle this collision in the ball collision but i guess
  // this also has its advantages
  handle_collisions() {
    let b_x = breaking_ball.pos.x
    let b_y = breaking_ball.pos.y
    const bb = breaking_ball as Ball

    if (
      b_x >= this.pos.x && b_x - bb.radius <= this.pos.x + this.width
      && b_y + bb.radius >= this.pos.y && b_y - bb.radius <= this.pos.y + this.height
    ) {
      //bb.dir.x *= Math.max(1, b_x / SCREEN_WIDTH)
      bb.dir.y *= Math.min(-1, b_x / SCREEN_WIDTH)
      this.health--
      if (this.health == 0) {
        let i = STATE.blocks.indexOf(this)
        STATE.blocks.splice(i, 1)
      }
      STATE.points++
    }
  }

  draw(p: p5) {
    p.fill(this.color)
    p.rect(this.pos.x, this.pos.y, this.width, this.height)
  }

  update() {
  }
}

const bar_initial_pos = { x: SCREEN_WIDTH / 2 - BAR_WIDTH / 2, y: SCREEN_HEIGHT - BAR_HEIGHT * 5 }
const bar_initial_dir = { x: 1, y: 0 }

const bar: Entity = new Bar(
  bar_initial_dir,
  bar_initial_pos,
  [244, 171, 187],
  1000,
  BAR_WIDTH,
  BAR_HEIGHT,
)

const breaking_ball_initial_pos = { x: bar.pos.x + BAR_WIDTH / 2 + BB_HEIGHT / 2, y: bar.pos.y - BB_HEIGHT * 3 }
const breaking_ball_initial_dir = { x: 1, y: -1 }

const breaking_ball: Entity = new Ball(
  breaking_ball_initial_dir,
  breaking_ball_initial_pos,
  [255, 255, 255],
  BB_SPEED,
  BB_WIDTH,
)

const entities: Entity[] = [bar, breaking_ball]

interface State {
  is_paused: boolean,
  is_preparing_for_next_level: boolean,
  level: number,
  lives: number,
  points: number,
  block_rows: number,
  block_cols: number,
  total_blocks: number,
  blocks: Block[]
}

const STATE: State = {
  is_paused: true,
  is_preparing_for_next_level: false,
  level: 1,
  lives: 3,
  points: 0,
  block_rows: INITIAL_ROWS,
  block_cols: SCREEN_WIDTH / BLOCK_WIDTH,
  total_blocks: SCREEN_WIDTH / BLOCK_WIDTH * INITIAL_ROWS,
  blocks: []
}

const sketch = (p: p5): any => {


  p.setup = function() {
    p.createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let row = 0; row < STATE.block_rows; row++) {
      const row_color = get_random_rgb()
      for (let col = 0; col < STATE.block_cols; col++) {
        //entities.push(new Block(
        //  { x: col * BLOCK_WIDTH, y: row * BLOCK_HEIGHT },
        //  1,
        //  row_color
        //))
        STATE.blocks.push(new Block(
          { x: col * BLOCK_WIDTH, y: row * BLOCK_HEIGHT },
          1,
          row_color
        ))
      }
    }
  }

  function game_reset() {
    STATE.block_rows++
    STATE.level++
    for (let row = 0; row < STATE.block_rows; row++) {
      const row_color = get_random_rgb()
      for (let col = 0; col < STATE.block_cols; col++) {
        STATE.blocks.push(new Block(
          { x: col * BLOCK_WIDTH, y: row * BLOCK_HEIGHT },
          1,
          row_color
        ))
      }
    }
    breaking_ball.dir = breaking_ball_initial_dir
    breaking_ball.pos = breaking_ball_initial_pos
    breaking_ball.speed += 25

    bar.dir = bar_initial_dir
    bar.color = get_random_rgb()
    bar.pos.x = SCREEN_WIDTH / 2 - BAR_WIDTH / 2
    STATE.is_preparing_for_next_level = true
    STATE.is_paused = true
  }

  function update_entity(ent: Entity) {
    ent.handle_collisions()
  }

  function draw_text(text: string, x: number, y: number, font_size: number, color: string) {
    p.textSize(font_size);
    p.fill(color);
    p.text(text, x, y + font_size);
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
      breaking_ball.dir = { x: 1, y: 0 }
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

    if (STATE.blocks.length === 0) {
      game_reset()
    }

    if (STATE.is_preparing_for_next_level) {
      const text = "U PASSED THE " + STATE.level + " LEVEL, ENTER TO CONTINUE"
      draw_text(text, SCREEN_WIDTH / 2 - 300, SCREEN_HEIGHT / 2, 24, "white")
    }

    if (!STATE.is_paused) {
      entities.forEach(ent => {
        update_entity(ent)
      })
      STATE.blocks.forEach(ent => {
        update_entity(ent)
      })
    }

    entities.forEach(ent => {
      ent.draw(p)
    })

    STATE.blocks.forEach(ent => {
      ent.draw(p)
    })

    draw_text("Level " + STATE.level, 0, SCREEN_HEIGHT - FONT_SIZE * 3, FONT_SIZE, "pink")
    draw_text("Points " + STATE.points, 0, SCREEN_HEIGHT - FONT_SIZE * 2, FONT_SIZE, "white")
    draw_text("Lives " + STATE.lives, 0, SCREEN_HEIGHT - FONT_SIZE, FONT_SIZE, "cyan")

  }

  p.keyPressed = function() {
    if (p.keyCode === p.ENTER) {
      STATE.is_paused = !STATE.is_paused
      STATE.is_preparing_for_next_level = false
    }
  }
}
new p5(sketch);
