when a cell is detroyed a letter of the keyboard appears in it and if u press it, u cast a block inside of it again, but it cost you points and when it breaks it doesnt give u more points

powerups inside blocks, like duplicating the amount of balls (making them phantom and not lose the game if they go out of screen)
duplicating your bar that goes in opposite directions 
making it bigger
another buf or special power would be controlling the ball for like 5 seconds or something like that
and debufs that make the keyboard input not good for example or just make your bar smol
pacman mode where your bar just goes to the direction u pressed and keeps for it until u change it it cannot stay still

this ideas are probably not being implemented in this version cause is for a test lol


```js
    if (!PAUSE) {
      update_entity(breaking_ball)
      let nx = x + dx * BB_SPEED * DELTA_TIME_SEC
      let ny = y + dy * BB_SPEED * DELTA_TIME_SEC
      if (nx < 0 || nx + BB_WIDTH > SCREEN_WIDTH) {
        dx *= -1
        nx = x + dx * BB_SPEED * DELTA_TIME_SEC
      }
      if (ny < 0 || ny + BB_HEIGHT > SCREEN_HEIGHT) {
        dy *= -1
        ny = y + dy * BB_SPEED * DELTA_TIME_SEC
      }
      x = nx
      y = ny
    }
```
