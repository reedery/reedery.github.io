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

let scrollCooledDown = true;
const scrollCoolDown = 25; // in ms
const pixelMoveThreshold = 5;

function init() {
    // Generate project tiles dynamically
    projectData.forEach(project => {
        const projectTile = document.createElement('div');
        projectTile.classList.add('project-tile');
        //projectTile.style.touchAction = 'pan-y';

        projectTile.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.year}</p>
            <img src="${project.photo}" alt="${project.title}">
        `;

        projectTile.addEventListener('click', () => {
            //console.log("hasScrollCooledDown: "+ hasScrollCooledDown);
            if (scrollCooledDown) {
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
    //projectTilesContainer.addEventListener('pointercancel', stopDragging);

}

function startDragging(event) {
    console.log("\nStart dragging: " + event.pageX);

    if (event.button !=0 ) return; // Check if left mouse button is pressed
    startPosition = event.pageX - projectTilesContainer.offsetLeft;
    scrollLeft = projectTilesContainer.scrollLeft;
  
    
    isDragging = true;  
  }
  
  function dragging(event) {
    console.log("\ndragging and isDragging is: " + isDragging);

    if (!isDragging ) return;  

    const currentPosition = event.pageX - projectTilesContainer.offsetLeft;
    const distance = currentPosition - startPosition;
    projectTilesContainer.scrollLeft = scrollLeft - distance;
    
    if (Math.abs(distance) > pixelMoveThreshold) { // Threshold for determining dragging
        scrollCooledDown = false;
        //projectTilesContainer.removeEventListener('pointermove', handleMove);
    }
    
  }
  
  function stopDragging(event) {
    console.log("\nStop dragging: " + event.pageX);

    //isDragging = false;
    //if (event.button !== 0) return; // Check if left mouse button is released
    //setTimeout(() => {
    isDragging = false;
    //}, 30); // Adjust the delay (in milliseconds) as needed
    setTimeout(() => {
        scrollCooledDown = true;
    }, scrollCoolDown);  }
  
  init();