let capsule = {
  title: "",
  level: "",
  duration: "",
  steps: []
};

function renderCapsule() {
  document.getElementById("capsuleTitle").value = capsule.title || "";
  document.getElementById("capsuleLevel").value = capsule.level || "";
  document.getElementById("capsuleDuration").value = capsule.duration || "";

  document.getElementById("stepsList").innerHTML = capsule.steps.map((step, index) => {
    if (step.type === "image") return renderImage(step, index);
    if (step.type === "video") return renderVideo(step, index);
    if (step.type === "pdf") return renderPdf(step, index);
    if (step.type === "quiz") return renderQuiz(step, index);
    return "";
  }).join("");
}

function buttons(index) {
  return `
    <button onclick="moveStepUp(${index})">⬆ Monter</button>
    <button onclick="moveStepDown(${index})">⬇ Descendre</button>
    <button onclick="deleteStep(${index})">🗑️ Supprimer</button>
  `;
}

function renderImage(step, index) {
  return `
    <div class="step">
      ${buttons(index)}
      <h4>🖼️ Image</h4>
      <img src="${step.src}" style="max-width:300px;border-radius:10px;margin-top:10px;">
      <br>
      <small>${step.name}</small>
    </div>
  `;
}

function renderVideo(step, index) {
  return `
    <div class="step">
      ${buttons(index)}
      <h4>🎥 Vidéo YouTube</h4>
      <input 
        value="${step.src || ""}"
        placeholder="Colle ici le lien YouTube"
        oninput="updateVideo(${index}, this.value)"
        style="width:90%;padding:12px;border-radius:10px;border:none;font-size:16px;"
      >
    </div>
  `;
}

function renderPdf(step, index) {
  if (step.src && !step.thumbnail) {
    setTimeout(() => generatePdfThumbnail(index), 100);
  }

  return `
    <div class="step">
      ${buttons(index)}

      <h4>📄 PDF</h4>

      <div style="
        background:#ffffff;
        color:#222;
        border-radius:14px;
        padding:18px;
        margin-top:12px;
        max-width:420px;
      ">
        ${
          step.thumbnail
          ? `<img src="${step.thumbnail}" style="max-width:260px;border-radius:10px;border:1px solid #ddd;">`
          : `<p>⏳ Génération de l'aperçu...</p>`
        }

        <p><strong>📄 ${step.name || "Fichier PDF"}</strong></p>

        <p style="margin-bottom:0;">
          👁️ Visible dans la capsule<br>
          🔒 Téléchargement réservé aux élèves connectés
        </p>
      </div>
    </div>
  `;
}

async function generatePdfThumbnail(index) {
  const step = capsule.steps[index];

  if (!step || !step.src) return;

  const pdf = await pdfjsLib.getDocument(step.src).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 0.6 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  step.thumbnail = canvas.toDataURL("image/png");

  renderCapsule();
}
function renderQuiz(step, index) {
  return `
    <div class="step">
      ${buttons(index)}
      <h4>❓ Quiz</h4>
    </div>
  `;
}

function moveStepUp(index) {
  if (index === 0) return;
  const temp = capsule.steps[index];
  capsule.steps[index] = capsule.steps[index - 1];
  capsule.steps[index - 1] = temp;
  renderCapsule();
}

function moveStepDown(index) {
  if (index === capsule.steps.length - 1) return;
  const temp = capsule.steps[index];
  capsule.steps[index] = capsule.steps[index + 1];
  capsule.steps[index + 1] = temp;
  renderCapsule();
}

function deleteStep(index) {
  capsule.steps.splice(index, 1);
  renderCapsule();
}

function updateVideo(index, value) {
  capsule.steps[index].src = value;
}

document.getElementById("newCapsuleBtn").addEventListener("click", () => {
  capsule = {
    title: "",
    level: "",
    duration: "",
    steps: []
  };

  renderCapsule();
  alert("Nouvelle capsule créée !");
});

document.getElementById("saveCapsuleBtn").addEventListener("click", () => {
  capsule.title = document.getElementById("capsuleTitle").value;
  capsule.level = document.getElementById("capsuleLevel").value;
  capsule.duration = document.getElementById("capsuleDuration").value;

  if (!capsule.title) {
    alert("Il faut donner un nom à la capsule.");
    return;
  }

  const json = JSON.stringify(capsule, null, 2);
  const filename = capsule.title.replaceAll(" ", "_") + ".json";

  download(filename, json);
});

document.getElementById("openCapsuleBtn").addEventListener("click", async () => {
  const json = await window.api.openCapsule();

  if (!json) return;

  capsule = JSON.parse(json);
  renderCapsule();

  alert("✅ Capsule chargée !");
});

document.getElementById("addImageBtn").addEventListener("click", async () => {
  const image = await window.api.chooseImage();

  if (!image) return;

  capsule.steps.push({
    type: "image",
    name: image.name,
    src: image.src
  });

  renderCapsule();
});

document.getElementById("addVideoBtn").addEventListener("click", () => {
  capsule.steps.push({
    type: "video",
    title: "Vidéo YouTube",
    src: ""
  });

  renderCapsule();
});

document.getElementById("addPdfBtn").addEventListener("click", async () => {
  const pdf = await window.api.choosePdf();

  if (!pdf) return;

  capsule.steps.push({
    type: "pdf",
    title: "PDF",
    name: pdf.name,
    path: pdf.path,
    src: pdf.src
  });

  renderCapsule();
});

document.getElementById("addQuizBtn").addEventListener("click", () => {
  capsule.steps.push({
    type: "quiz",
    title: "Quiz"
  });

  renderCapsule();
});

function download(filename, text) {
  const element = document.createElement("a");

  element.setAttribute(
    "href",
    "data:text/json;charset=utf-8," + encodeURIComponent(text)
  );

  element.setAttribute("download", filename);
  element.style.display = "none";

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

renderCapsule();