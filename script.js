// Add or replace URLs here to update the wishlist links.
const wishlists = [
  "https://my.shp.ee/ePKYyjzv",
  "https://my.shp.ee/ePKYyjzv",
  "https://my.shp.ee/ePKYyjzv"
];

const list = document.querySelector("#wishlist-items");

wishlists.forEach((url, index) => {
  const entry = document.createElement("li");
  const link = document.createElement("a");

  entry.className = "text-stone-700";
  link.className = "block py-4 font-medium text-emerald-800 hover:text-emerald-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2";
  link.href = url;
  link.textContent = `wishlist ${index + 1}`;

  entry.append(link);
  list.append(entry);
});

const giftBox = document.querySelector("#gift-box");

if (giftBox) {
  const columns = 36;
  const rows = 24;
  const step = 0.035;
  const boxPoints = [];
  const boxShades = " .:-=+*#%@";
  const ribbonShades = "|!+=*#@";
  const bowShades = ":~^*#@";

  function addFace(uMin, uMax, vMin, vMax, pointAt, normal, isRibbon = () => false) {
    for (let u = uMin; u <= uMax + step / 2; u += step) {
      for (let v = vMin; v <= vMax + step / 2; v += step) {
        const point = pointAt(u, v);
        boxPoints.push({
          ...point,
          nx: normal[0],
          ny: normal[1],
          nz: normal[2],
          material: isRibbon(point) ? "ribbon" : "box"
        });
      }
    }
  }

  function addPoint(x, y, z, nx, ny, nz, material) {
    boxPoints.push({ x, y, z, nx, ny, nz, material });
  }

  const body = { halfWidth: 1, halfDepth: 0.78, bottom: -1, top: 0.62 };
  const lid = { halfWidth: 1.12, halfDepth: 0.9, bottom: 0.6, top: 0.9 };
  const ribbonHalfWidth = 0.14;

  addFace(-body.halfWidth, body.halfWidth, body.bottom, body.top,
    (x, y) => ({ x, y, z: body.halfDepth }), [0, 0, 1], (p) => Math.abs(p.x) < ribbonHalfWidth);
  addFace(-body.halfWidth, body.halfWidth, body.bottom, body.top,
    (x, y) => ({ x, y, z: -body.halfDepth }), [0, 0, -1], (p) => Math.abs(p.x) < ribbonHalfWidth);
  addFace(-body.halfDepth, body.halfDepth, body.bottom, body.top,
    (z, y) => ({ x: body.halfWidth, y, z }), [1, 0, 0], (p) => Math.abs(p.z) < ribbonHalfWidth);
  addFace(-body.halfDepth, body.halfDepth, body.bottom, body.top,
    (z, y) => ({ x: -body.halfWidth, y, z }), [-1, 0, 0], (p) => Math.abs(p.z) < ribbonHalfWidth);

  addFace(-lid.halfWidth, lid.halfWidth, lid.bottom, lid.top,
    (x, y) => ({ x, y, z: lid.halfDepth }), [0, 0, 1], (p) => Math.abs(p.x) < ribbonHalfWidth);
  addFace(-lid.halfWidth, lid.halfWidth, lid.bottom, lid.top,
    (x, y) => ({ x, y, z: -lid.halfDepth }), [0, 0, -1], (p) => Math.abs(p.x) < ribbonHalfWidth);
  addFace(-lid.halfDepth, lid.halfDepth, lid.bottom, lid.top,
    (z, y) => ({ x: lid.halfWidth, y, z }), [1, 0, 0], (p) => Math.abs(p.z) < ribbonHalfWidth);
  addFace(-lid.halfDepth, lid.halfDepth, lid.bottom, lid.top,
    (z, y) => ({ x: -lid.halfWidth, y, z }), [-1, 0, 0], (p) => Math.abs(p.z) < ribbonHalfWidth);
  addFace(-lid.halfWidth, lid.halfWidth, -lid.halfDepth, lid.halfDepth,
    (x, z) => ({ x, y: lid.top, z }), [0, 1, 0], (p) => Math.abs(p.x) < ribbonHalfWidth || Math.abs(p.z) < ribbonHalfWidth);

  for (const side of [-1, 1]) {
    for (let angle = 0; angle < Math.PI * 2; angle += 0.025) {
      for (let band = -0.055; band <= 0.056; band += 0.025) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const radiusX = 0.34 + band;
        const radiusY = 0.23 + band;
        addPoint(
          side * 0.31 + radiusX * cos,
          1.2 + radiusY * sin,
          0.08 + side * 0.035 + 0.11 * Math.sin(angle * 2),
          cos,
          sin,
          0.25,
          "bow"
        );
      }
    }

    for (let t = 0; t <= 1.001; t += 0.025) {
      for (let band = -0.07; band <= 0.071; band += 0.025) {
        addPoint(
          side * (0.05 + 0.43 * t),
          1.1 - 0.18 * t + 0.025 * Math.sin(t * Math.PI),
          0.04 + band,
          0,
          0,
          1,
          "ribbon"
        );
      }
    }
  }

  for (let latitude = -Math.PI / 2; latitude <= Math.PI / 2; latitude += 0.09) {
    for (let longitude = 0; longitude < Math.PI * 2; longitude += 0.09) {
      const cosLatitude = Math.cos(latitude);
      const nx = cosLatitude * Math.cos(longitude);
      const ny = Math.sin(latitude);
      const nz = cosLatitude * Math.sin(longitude);
      addPoint(0.16 * nx, 1.17 + 0.13 * ny, 0.08 + 0.15 * nz, nx, ny, nz, "bow");
    }
  }

  function renderGiftBox(yaw) {
    const output = Array(columns * rows).fill(" ");
    const materials = new Uint8Array(columns * rows);
    const depthBuffer = new Float32Array(columns * rows);
    depthBuffer.fill(-Infinity);

    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const pitch = -0.12 + 0.11 * Math.sin(yaw * 2);
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    const light = [-0.42, 0.72, 0.55];
    const camera = 5.8;

    for (const point of boxPoints) {
      const x = point.x * cosYaw + point.z * sinYaw;
      const zYaw = -point.x * sinYaw + point.z * cosYaw;
      const y = point.y * cosPitch - zYaw * sinPitch;
      const z = point.y * sinPitch + zYaw * cosPitch;
      const perspective = camera / (camera - z);
      const screenX = Math.round(columns / 2 + x * 13.5 * perspective);
      const screenY = Math.round(rows / 2 - (y - 0.2) * 7.2 * perspective);

      if (screenX < 0 || screenX >= columns || screenY < 0 || screenY >= rows) continue;

      const index = screenY * columns + screenX;
      if (z <= depthBuffer[index]) continue;

      const nxYaw = point.nx * cosYaw + point.nz * sinYaw;
      const nzYaw = -point.nx * sinYaw + point.nz * cosYaw;
      const ny = point.ny * cosPitch - nzYaw * sinPitch;
      const nz = point.ny * sinPitch + nzYaw * cosPitch;
      const diffuse = Math.max(0.08, nxYaw * light[0] + ny * light[1] + nz * light[2]);
      const texture = point.material === "box"
        ? 0.08 * Math.sin(point.x * 8 + point.y * 11 + point.z * 9)
        : 0;
      const brightness = Math.max(0.18, Math.min(1, 0.22 + diffuse * 0.78 + texture));
      const shades = point.material === "box" ? boxShades : point.material === "ribbon" ? ribbonShades : bowShades;

      output[index] = shades[Math.round(brightness * (shades.length - 1))];
      materials[index] = point.material === "box" ? 1 : 2;
      depthBuffer[index] = z;
    }

    const lines = [];
    for (let row = 0; row < rows; row++) {
      let line = "";
      let run = "";
      let runMaterial = 0;

      function flushRun() {
        if (runMaterial === 1) line += `<span class="gift-box-body">${run}</span>`;
        else if (runMaterial === 2) line += `<span class="gift-box-ribbon">${run}</span>`;
        else line += run;
        run = "";
      }

      for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        const material = materials[index];
        if (material !== runMaterial) {
          flushRun();
          runMaterial = material;
        }
        run += output[index];
      }
      flushRun();
      lines.push(line);
    }

    giftBox.innerHTML = lines.join("\n");
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let yaw = 0.45;
  renderGiftBox(yaw);

  if (!reduceMotion) {
    let lastFrame = 0;
    function animateGiftBox(timestamp) {
      if (timestamp - lastFrame >= 40) {
        lastFrame = timestamp;
        yaw += 0.04;
        renderGiftBox(yaw);
      }
      window.requestAnimationFrame(animateGiftBox);
    }
    window.requestAnimationFrame(animateGiftBox);
  }
}
