// Project showcase logic
const projectTiles = document.querySelectorAll('.project-tile');
let currentIndex = 0;

function showProjectTile(index) {
    projectTiles.forEach(tile => tile.classList.remove('active'));
    projectTiles[index].classList.add('active');
}

showProjectTile(currentIndex);

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + projectTiles.length) % projectTiles.length;
    showProjectTile(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % projectTiles.length;
    showProjectTile(currentIndex);
});