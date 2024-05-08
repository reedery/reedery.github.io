// Fetch projects data from JSON file
import { projectData } from './projectData.js';

// tile elements
const projectTilesContainer = document.getElementById('project-tiles-container');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalPhoto = document.getElementById('modal-photo');
const modalRole = document.getElementById('modal-role');
const modalDescription = document.getElementById('modal-description');
const modalVideo = document.getElementById('modal-video');
const modalPhotos = document.getElementById('modal-photos');
const modalSubtitle = document.getElementById('modal-subtitle');
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
    projectData.sort((a, b) => new Date(b.year) - new Date(a.year));
    projectData.splice(0, 2, projectData[1], projectData[0]);
    projectData.forEach(project => {
        const projectTile = document.createElement('div');
        projectTile.classList.add('project-tile');

        projectTile.innerHTML = `
            <h3>${project.title} - ${project.year}</h3>
            <p>${project.details} </p>
            <img src="${project.photo}" draggable="false" alt="${project.title}">
        `;

        projectTile.addEventListener('click', () => {
            if (scrollCooledDown) {
                modalTitle.textContent = project.title;
                modalRole.innerHTML = project.role.map(role => `<li>${role}</li>`).join('');
                modalDescription.innerHTML = project.description;
                
                var videoSection = "";
                project.video.forEach(element => {
                    const desc = element[0];
                    const link = element[1];
                    videoSection += `<h4>${desc}</h4><iframe src="${link}" frameborder="0" style="height:40vh;width:100%;position:relative;" ></iframe></div><p></p>`;
                });
                modalVideo.innerHTML = videoSection;

                modalSubtitle.innerHTML = project.subtitle;

                // Create the Flickr embed HTML
                if (project.flickrAlbumUrl) {
                    console.log(project.title);
                    const flickrEmbedHtml = `
                        <a data-flickr-embed="true" data-footer="false" href="${project.flickrAlbumUrl}" >
                        <img src="https://live.staticflickr.com/5213/5484169808_303d1b65d1_m.jpg" width="420" height="320" alt="${project.title}"/>
                        </a>
                    `;
                    modalPhotos.innerHTML = flickrEmbedHtml;

                    const flickrScript = document.createElement('script');
                    flickrScript.id = 'flickr-embed-script';
                    flickrScript.src = '//embedr.flickr.com/assets/client-code.js';
                    flickrScript.charset = 'utf-8';
                    flickrScript.async = true;
                    document.body.appendChild(flickrScript);
                } else {
                    modalPhotos.innerHTML = "";
                }
                projectModal.style.display = 'block';
            }
        });
    projectTilesContainer.appendChild(projectTile);
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener('click', () => {
        stopVideos();
        projectModal.style.display = 'none';
    });

    projectTilesContainer.addEventListener('pointerdown', startDragging);
    projectTilesContainer.addEventListener('pointermove', dragging);
    projectTilesContainer.addEventListener('pointerup', stopDragging);
    projectTilesContainer.addEventListener('pointerleave', stopDragging);
}

function startDragging(event) {
    if (event.button !=0 ) return; // Check if left mouse button is pressed
    startPosition = event.pageX - projectTilesContainer.offsetLeft;
    scrollLeft = projectTilesContainer.scrollLeft;
    isDragging = true;  
  }
  
  function dragging(event) {
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

    isDragging = false;
    //}, 30); // Adjust the delay (in milliseconds) as needed
    setTimeout(() => {
        scrollCooledDown = true;
    }, scrollCoolDown);  }
  

    function stopVideos() {
        const videos = document.querySelectorAll('#project-modal video, #project-modal iframe');
        videos.forEach(video => {
            const iframes = document.querySelectorAll('#project-modal iframe');
            iframes.forEach(iframe => {
              iframe.parentNode.removeChild(iframe);
            });
        });
      }

  init();