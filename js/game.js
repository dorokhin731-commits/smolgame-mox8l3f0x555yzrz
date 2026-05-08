// Initialize PixiJS
    const app = new PIXI.Application({
      width: window.innerHeight * 9 / 16, // Portrait 9:16
      height: window.innerHeight,
      backgroundColor: 0x000000,
    });

    // Add the canvas to the HTML document body
    document.body.appendChild(app.view);

    // Define some colors
    const colors = [
      0xFF0000, // Red
      0x00FF00, // Green
      0x0000FF, // Blue
      0xFFFF00, // Yellow
      0xFF00FF, // Magenta
      0x00FFFF, // Cyan
    ];

    // Define the tetromino shapes
    const tetrominos = [
      // I-Shape
      [
        [1, 1, 1, 1],
      ],
      // J-Shape
      [
        [1, 0, 0],
        [1, 1, 1],
      ],
      // L-Shape
      [
        [0, 0, 1],
        [1, 1, 1],
      ],
      // O-Shape
      [
        [1, 1],
        [1, 1],
      ],
      // S-Shape
      [
        [0, 1, 1],
        [1, 1, 0],
      ],
      // T-Shape
      [
        [0, 1, 0],
        [1, 1, 1],
      ],
      // Z-Shape
      [
        [1, 1, 0],
        [0, 1, 1],
      ],
    ];

    // Define the grid size
    const gridSize = {
      width: 10,
      height: 20,
    };

    // Create the grid
    let grid = [];
    for (let y = 0; y < gridSize.height; y++) {
      grid[y] = [];
      for (let x = 0; x < gridSize.width; x++) {
        grid[y][x] = 0;
      }
    }

    // Create the current tetromino
    let currentTetromino = {
      shape: tetrominos[Math.floor(Math.random() * tetrominos.length)],
      x: gridSize.width / 2,
      y: 0,
      rotation: 0,
    };

    // Create the score
    let score = 0;

    // Create the game over flag
    let gameOver = false;

    // Define the game logic functions
    function canMoveDown(tetromino) {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] === 1) {
            if (tetromino.y + y + 1 >= gridSize.height) {
              return false;
            }
            if (grid[tetromino.y + y + 1][tetromino.x + x] !== 0) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function moveTetrominoLeft(tetromino) {
      if (canMoveLeft(tetromino)) {
        tetromino.x--;
      }
    }

    function moveTetrominoRight(tetromino) {
      if (canMoveRight(tetromino)) {
        tetromino.x++;
      }
    }

    function moveTetrominoDown(tetromino) {
      if (canMoveDown(tetromino)) {
        tetromino.y++;
      }
    }

    function canMoveLeft(tetromino) {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] === 1) {
            if (tetromino.x + x - 1 < 0) {
              return false;
            }
            if (grid[tetromino.y + y][tetromino.x + x - 1] !== 0) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function canMoveRight(tetromino) {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] === 1) {
            if (tetromino.x + x + 1 >= gridSize.width) {
              return false;
            }
            if (grid[tetromino.y + y][tetromino.x + x + 1] !== 0) {
              return false;
            }
          }
        }
      }
      return true;
    }

    function addTetrominoToGrid(tetromino) {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] === 1) {
            grid[tetromino.y + y][tetromino.x + x] = 1;
          }
        }
      }
    }

    function checkForFullLines() {
      for (let y = 0; y < gridSize.height; y++) {
        let fullLine = true;
        for (let x = 0; x < gridSize.width; x++) {
          if (grid[y][x] === 0) {
            fullLine = false;
            break;
          }
        }
        if (fullLine) {
          // Remove the full line
          for (let x = 0; x < gridSize.width; x++) {
            grid[y][x] = 0;
          }
          // Move all lines above down
          for (let y2 = y; y2 > 0; y2--) {
            for (let x = 0; x < gridSize.width; x++) {
              grid[y2][x] = grid[y2 - 1][x];
            }
          }
          // Increase the score
          score++;
        }
      }
    }

    function renderTetromino(tetromino) {
      for (let y = 0; y < tetromino.shape.length; y++) {
        for (let x = 0; x < tetromino.shape[y].length; x++) {
          if (tetromino.shape[y][x] === 1) {
            const rect = new PIXI.Graphics();
            rect.beginFill(colors[0]);
            rect.drawRect((tetromino.x + x) * 20, (tetromino.y + y) * 20, 20, 20);
            rect.endFill();
            app.stage.addChild(rect);
          }
        }
      }
    }

    // Define the game loop
    app.ticker.add(() => {
      try {
        // Update the game state
        if (!gameOver) {
          // Move the current tetromino down
          if (canMoveDown(currentTetromino)) {
            currentTetromino.y++;
          } else {
            // Add the current tetromino to the grid
            addTetrominoToGrid(currentTetromino);
            // Check for full lines
            checkForFullLines();
            // Create a new tetromino
            currentTetromino = {
              shape: tetrominos[Math.floor(Math.random() * tetrominos.length)],
              x: gridSize.width / 2,
              y: 0,
              rotation: 0,
            };
            // Check for game over
            if (!canMoveDown(currentTetromino)) {
              gameOver = true;
            }
          }
        }

        // Render the game state
        app.stage.removeChildren();
        for (let y = 0; y < gridSize.height; y++) {
          for (let x = 0; x < gridSize.width; x++) {
            if (grid[y][x] !== 0) {
              const rect = new PIXI.Graphics();
              rect.beginFill(colors[0]);
              rect.drawRect(x * 20, y * 20, 20, 20);
              rect.endFill();
              app.stage.addChild(rect);
            }
          }
        }
        if (!gameOver) {
          renderTetromino(currentTetromino);
        }
        const scoreText = new PIXI.Text(`Score: ${score}`, {
          fontSize: 24,
          fill: 0xFFFFFF,
        });
        scoreText.position.set(10, 10);
        app.stage.addChild(scoreText);
        if (gameOver) {
          const gameOverText = new PIXI.Text('Game Over!', {
            fontSize: 48,
            fill: 0xFFFFFF,
          });
          gameOverText.position.set(gridSize.width * 20 / 2 - 100, gridSize.height * 20 / 2 - 24);
          app.stage.addChild(gameOverText);
        }
      } catch (e) {
        console.error(e);
      }
    });

    // Handle touch events
    let touchStartX = 0;
    let touchStartY = 0;
    app.view.addEventListener('touchstart', (event) => {
      try {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      } catch (e) {
        console.error(e);
      }
    });
    app.view.addEventListener('touchmove', (event) => {
      try {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        if (Math.abs(touchX - touchStartX) > Math.abs(touchY - touchStartY)) {
          if (touchX - touchStartX > 0) {
            moveTetrominoRight(currentTetromino);
          } else {
            moveTetrominoLeft(currentTetromino);
          }
        } else {
          if (touchY - touchStartY > 0) {
            moveTetrominoDown(currentTetromino);
          }
        }
        touchStartX = touchX;
        touchStartY = touchY;
      } catch (e) {
        console.error(e);
      }
    });
    app.view.addEventListener('touchend', () => {
      try {
        touchStartX = 0;
        touchStartY = 0;
      } catch (e) {
        console.error(e);
      }
    });