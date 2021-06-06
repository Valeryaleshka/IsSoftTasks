document.addEventListener("click", getGraphAction);
document.addEventListener("keypress", handleKeyPress);

const regExpNumber = new RegExp(/^-?\d+(.\d+)?$/);

const data = [];

function handleKeyPress(e) {
  if (e.target.classList.contains("textarea")) {
    if (
      !(e.which > 47 && e.which < 58) &&
      ![46, 45, 32, 13].includes(e.which)
    ) {
      e.preventDefault();
    }
  }
}

function getGraphAction(e) {
  if (e.target.classList.contains("submit-form")) {
    e.preventDefault();

    const text = document.getElementById("text").value;
    const arr = text
      .trim()
      .replace(/\ +/g, " ")
      .replace(/\n\ /g, "\n")
      .split("\n");
    data.length = 0;

    arr.forEach((element) => {
      const obj = element.split(" ");
      if (
        obj[0] !== undefined &&
        obj[1] !== undefined &&
        obj[1].match(regExpNumber) &&
        obj[1].match(regExpNumber)
      ) {
        data.push({ x: obj[0], y: obj[1] });
      }
    });

    data.sort((a, b) => (+a.x > +b.x ? 1 : -1));

    buildGraph();
  }
}

function buildGraph() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = 500;
  const height = 500;
  const margin = 60;

  canvas.width = width;
  canvas.height = height;

  const xAxisStart = getMin(data, function (d) {
    return d.x;
  });
  const xAxisEnd = getMax(data, function (d) {
    return d.x;
  });
  const yAxisStart = getMin(data, function (d) {
    return d.y;
  });
  const yAxisEnd = getMax(data, function (d) {
    return d.y;
  });

  const xAxisLength = width - 2 * margin;
  const yAxisLength = height - 2 * margin;

  const rangeValuesX = xAxisEnd - xAxisStart;
  const rangeValuesY = yAxisEnd - yAxisStart;

  const scaleX = xAxisLength / rangeValuesX;
  const scaleY = yAxisLength / rangeValuesY;

  createAxisLine(width, height, margin);
  outputValuesAxis();
  createLineGraph();

  function createAxisLine(width, height, margin) {
    const xAxisX_1 = margin;
    const xAxisY_1 = margin;
    const xAxisX_2 = margin;
    const xAxisY_2 = height - margin;

    const yAxisX_1 = margin;
    const yAxisY_1 = height - margin;
    const yAxisX_2 = width - margin;
    const yAxisY_2 = height - margin;

    ctx.beginPath();
    ctx.moveTo(xAxisX_1, xAxisY_1);
    ctx.lineTo(xAxisX_2, xAxisY_2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(yAxisX_1, yAxisY_1);
    ctx.lineTo(yAxisX_2, yAxisY_2);
    ctx.stroke();
  }

  function outputValuesAxis() {
    const indentFromLine = 15;

    const amountOfSteps = 10;
    const amountOfValues = amountOfSteps + 1;
    const outputStepValueX = rangeValuesX / amountOfSteps;
    const outputStepValueY = rangeValuesY / amountOfSteps;

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    for (let i = 0; i < amountOfValues; i++) {
      const valueAxisX = Math.round(xAxisStart + i * outputStepValueX);
      const positionX = doScaleX(valueAxisX);
      const positionY = height - margin + indentFromLine;
      ctx.fillText(valueAxisX, positionX, positionY);
    }

    ctx.beginPath();
    ctx.font = "10px Arial";
    ctx.textAlign = "end";
    ctx.textBaseline = "middle";

    for (let i = 0; i < amountOfValues; i++) {
      const valueAxisY = Math.round(yAxisStart + i * outputStepValueY);
      const positionX = margin - indentFromLine;
      const positionY = doScaleY(valueAxisY);
      ctx.fillText(valueAxisY, positionX, positionY);
    }
  }

  function createLineGraph() {
    for (let i = 0; i < data.length - 1; i++) {
      const currentX = data[i].x;
      const currentY = data[i].y;
      const nextX = data[i + 1].x;
      const nextY = data[i + 1].y;

      ctx.beginPath();
      ctx.moveTo(doScaleX(currentX), doScaleY(currentY));
      ctx.lineTo(doScaleX(nextX), doScaleY(nextY));
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  }

  function doScaleX(value) {
    return scaleX * value + margin - xAxisStart * scaleX;
  }
  function doScaleY(value) {
    return height - scaleY * value - margin + yAxisStart * scaleY;
  }
  function getMin(data, callback) {
    const arr = [];
    for (let i in data) {
      arr.push(callback(data[i]));
    }
    return Math.min.apply(null, arr);
  }
  function getMax(data, callback) {
    const arr = [];
    for (let i in data) {
      arr.push(callback(data[i]));
    }
    return Math.max.apply(null, arr);
  }
}
