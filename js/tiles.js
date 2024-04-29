// Fetch projects data from JSON file
import { projectData } from './projectData.js';

// tile elements
const projectTilesContainer = document.getElementById('project-tiles-container');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalPhoto = document.getElementById('modal-photo');
const modalYear = document.getElementById('modal-year');
const modalRole = document.getElementById('modal-role');
const modalDescription = document.getElementById('modal-description');
const modalVideo = document.getElementById('modal-video');
const closeBtn = document.getElementsByClassName('close')[0];

// drag scroll on desktop
let isDragging = false;
let startPosition = 0;
let scrollLeft = 0;

function init() {
    // Generate project tiles dynamically
    projectData.forEach(project => {
    const projectTile = document.createElement('div');
    projectTile.classList.add('project-tile');
    projectTile.style.setProperty('--background-image', `url('${project.photo}')`);
    projectTile.style.touchAction = 'pan-y';

    projectTile.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.year}</p>
    `;

    projectTile.addEventListener('click', () => {
        if (!isDragging) {
            modalTitle.textContent = project.title;
            modalPhoto.src = project.photo;
            modalYear.textContent = project.year;
            modalRole.innerHTML = project.role.map(role => `<li>${role}</li>`).join('');
            modalDescription.innerHTML = project.description;
            modalVideo.innerHTML = `<iframe src="${project.video}" allowfullscreen></iframe>`;
            projectModal.style.display = 'block';
        }
    });
    projectTilesContainer.appendChild(projectTile);
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', () => {
    projectModal.style.display = 'none';
    });

    projectTilesContainer.addEventListener('pointerdown', startDragging);
    projectTilesContainer.addEventListener('pointermove', dragging);
    projectTilesContainer.addEventListener('pointerup', stopDragging);
    projectTilesContainer.addEventListener('pointerleave', stopDragging);
}


function startDragging(event) {
  isDragging = true;
  startPosition = event.pageX - projectTilesContainer.offsetLeft;
  scrollLeft = projectTilesContainer.scrollLeft;
}

function dragging(event) {
  if (!isDragging) return;
  event.preventDefault();
  const currentPosition = event.pageX - projectTilesContainer.offsetLeft;
  const distance = currentPosition - startPosition;
  projectTilesContainer.scrollLeft = scrollLeft - distance;
}
  
  function stopDragging() {
    isDragging = false;
  }

  init();