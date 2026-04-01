// Modal Zoom — Función independiente
const MODAL_ZOOM_CONFIG = { currentZoom: 1, maxZoom: 1.2 };

function modalZoomInit() {
  const imgMain = document.getElementById('modalImgMain');
  if (!imgMain) return;

  // Reset zoom
  MODAL_ZOOM_CONFIG.currentZoom = 1;
  imgMain.style.transform = 'scale(1)';
  imgMain.style.transition = 'transform 0.3s ease';

  // Event listeners zoom
  imgMain.addEventListener('wheel', zoomWheel, { passive: false });
  imgMain.addEventListener('dblclick', zoomReset);
}

function zoomWheel(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const delta = e.deltaY > 0 ? -0.2 : 0.2;
  MODAL_ZOOM_CONFIG.currentZoom = Math.max(1, Math.min(MODAL_ZOOM_CONFIG.maxZoom, MODAL_ZOOM_CONFIG.currentZoom + delta));
  
  const imgMain = document.getElementById('modalImgMain');
  imgMain.style.transform = `scale(${MODAL_ZOOM_CONFIG.currentZoom})`;
}

function zoomReset(e) {
  e.preventDefault();
  MODAL_ZOOM_CONFIG.currentZoom = 1;
  document.getElementById('modalImgMain').style.transform = 'scale(1)';
}

// Cleanup en cerrar modal
function modalZoomCleanup() {
  const imgMain = document.getElementById('modalImgMain');
  imgMain.removeEventListener('wheel', zoomWheel);
  imgMain.removeEventListener('dblclick', zoomReset);
}
