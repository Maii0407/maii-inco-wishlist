(() => {
  const mount = document.querySelector("#greymon-sprite");
  if (!mount) return;

  const columns = 3;
  const rows = 4;
  const frameCount = columns * rows;
  const spriteSheet = new Image();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const mover = document.createElement("div");

  mover.className = "flex h-40 w-40 items-center justify-center";
  canvas.className = "block h-40 w-40";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.imageRendering = "pixelated";
  mover.append(canvas);
  mount.append(mover);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frameWidth = 0;
  let frameHeight = 0;
  let currentFrame = 0;

  function drawFrame(frameIndex) {
    const column = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      spriteSheet,
      column * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  spriteSheet.addEventListener("load", () => {
    frameWidth = spriteSheet.naturalWidth / columns;
    frameHeight = spriteSheet.naturalHeight / rows;
    canvas.width = frameWidth;
    canvas.height = frameHeight;
    context.imageSmoothingEnabled = false;
    drawFrame(currentFrame);

    if (reducedMotion) return;

    window.setInterval(() => {
      let nextFrame;
      do {
        nextFrame = Math.floor(Math.random() * frameCount);
      } while (nextFrame === currentFrame);

      currentFrame = nextFrame;
      drawFrame(currentFrame);
    }, 700);

    let atLeft = true;
    mover.style.transform = "translateX(-10px)";
    canvas.style.transform = "scaleX(1)";

    window.setInterval(() => {
      atLeft = !atLeft;
      mover.style.transform = `translateX(${atLeft ? -10 : 10}px)`;
      canvas.style.transform = `scaleX(${atLeft ? 1 : -1})`;
    }, 1250);
  });

  spriteSheet.src = "greymon.png";
})();
