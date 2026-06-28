function renderVideo(step){
  if(!step.youtube){
    return `<div class="placeholder">🎥<br>Vidéo à ajouter</div>`;
  }

  return `
    <iframe class="video-frame"
      src="https://www.youtube.com/embed/${step.youtube}"
      allowfullscreen>
    </iframe>
  `;
}
