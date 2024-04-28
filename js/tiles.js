// Fetch projects data from JSON file


let projectdata = [
    {
    "title": "Vortex",
    "photo": "images/rr.jpg",
    "year": 2020,
    "role": [
      "Technical Artist",
      "Software Engineer"
    ],
    "description": "Vortex is a performance-based 3D animation toolkit for mobile video creators. It allows users to create and share 3D animated videos by composing a set of performances on characters, cameras or props in space and time. In addition to performing object motion via touch-screen input, Vortex allows you to use your mobile device's AR tracking to animate. Inspired by Mandalorian-style virtual production, Figma, multitrack recorders and music/video editors, Vortex aims to make CGI accessible to any creator to explore creative ideas. <a href='https://medium.com/teleportal/made-in-vortex-166daa63c074'>Read more about Vortex here.</a>",
    "video": ""
  },
  {
    "title": "Teleportal SDK",
    "photo": "images/rr.jpg",
    "year": 2020,
    "role": [
      "Software Engineer",
      "Business Development"
    ],
    "description": "Teleportal is a platform that allows XR developers and content creators to create shared, persistent experiences that are networked in real-time. It works across platforms (iOS / Android / VR / PC / Mac) and interfaces with the Unity game engine. Teleportal seamlessly synchronizes user locations and coordinate systems between devices, allowing developers to focus on creating their experience. It also automatically saves and retrieves persistent items in the shared geo space. Teleportal SDK integrates with existing Unity projects, converting them into crossplatform XR apps. The long-term vision is that XR, the combination of virtual and mixed reality technologies, is key to the future of collaboration, digital media, and the Internet itself. <a href='https://medium.com/teleportal/announcing-teleportal-the-xr-telepresence-platform-350a710c4c0a'>Read more about Teleportal here.</a>",
    "video": ""
  },
  {
    "title": "Movieoke",
    "photo": "images/rr.jpg",
    "year": 2022,
    "role": [
      "Software Engineer",
      "Product Manager",
      "3D Generalist"
    ],
    "description": "Movieoke (Movie Karaoke) is a new way to create 3D animated remakes of iconic moments from movies, TV shows, or memes. To make a video with Movieoke, simply perform the lines on-screen and Movieoke's performance capture system tracks your face and voice to apply it to a 3D character in real-time. Inspired by Animoji, Vine, and Snapchat, Movieoke aims to make 3D animation creation more accessible, improvisational, and fun than ever before. Designed for the next generation of video creators, especially teens familiar with 3D creation in virtual worlds like Roblox and Minecraft, Movieoke believes that most 3D animation content in the future will be created through performance rather than keyframes. The ambition is to help creators channel their creative energy in completely new ways and transform animation from a slow art to a fast art.",
    "video": "https://youtu.be/7E8niHZXveI"
  },
  {
    "title": "MovieBot",
    "photo": "images/rr.jpg",
    "year": 2023,
    "role": [
      "Software Engineer",
      "3D Generalist"
    ],
    "description": "MovieBot is an AI-powered 3D animation platform that transforms text into animated video instantly. Users simply type a story topic and MovieBot generates an interactive 3D movie with talking characters based on the prompt. It offers a simple UI for generating movies, allowing users to choose characters, voices, worlds, and script styles. Every generated movie is a 3D scene that can be remixed in the Story Editor. MovieBot aimed to make 3D animation, traditionally a complex art form requiring desktop computers and technical skills, accessible on smartphones. The development process prioritized user feedback and community input. A key lesson learned was that while earlier versions focused on user performance, pivoting to AI proved more successful in terms of content shared online. MovieBot was also featured on the Dr. Phil show. <a href='https://youtu.be/1nOCuDtxdRo'>Watch the Dr. Phil feature here.</a>",
    "video": "https://youtu.be/1nOCuDtxdRo"
  },
  {
    "title": "Joycestick",
    "photo": "images/rr.jpg",
    "year": 2016,
    "role": [
      "Engineering Lead",
      "Teaching Assistant"
    ],
    "description": "Joycestick reimagines James Joyce's <em>Ulysses</em> in Virtual Reality. I led this project from ideation, to securing the URF grant funding through to development by a team of nearly 30 students from Boston College, MIT, Northeastern and Berklee School of Music. The experience breaks the story up logically by chapter and represents each through objects and images. These are translated into interactive scenes that uncover aspects of the story as the player progresses. Featured in Boston Globe, NYTimes, London Times and demoed at literature and technology conferences around the world including Signapore, Dublin, Seattle and New York.",
    "video": "https://www.youtube.com/embed/oOQ-NyNIj_E"
  },
  {
    "title": "Jurrasic World VR",
    "photo": "images/rr.jpg",
    "year": 2018,
    "role": [
      "Software Engineer"
    ],
    "description": "VR GAME",
     "video": ""
  },
  {
    "title": "Gravity AR",
    "photo": "images/rr.jpg",
    "year": 2019,
    "role": [
      "Technical Artist",
      "Software Engineer"
    ],
    "description": "Multiuser, cross-platform networked Augmented Reality experience built in Unity. Supported ARCore and ARKit devices, with 85 devices networked together in a spatially mapped 3D environment in realtime. Included spatialized DMX lights and fog machines that users would interact with through their AR app clients.",
    "video": ""
  },
  {
    "title": "Follow Me Dragon",
    "photo": "images/rr.jpg",
    "year": 2017,
    "role": [
      "Software Engineer"
    ],
    "description": "One of the first Apple ARKit apps developed and released, featured and installed on iPads in Apple Stores around the world. Apple invited our dev team to Cupertino to work on the app with their support ahead of the official ARKit launch in iOS. Drake the dragon is your AR pet who performs tricks, breathes fire, and follows you around as you collect cookies to feed him.",
    "video": ""
  },
  {
    "title": "Pipeline Technical Direction",
    "company": "DreamWorks Animation",
    "photo": "images/rr.jpg",
    "year": 2019,
    "role": [
      "Pipeline Technical Director"
    ],
    "description": "Worked as a Pipeline TD on DreamWorks Animation's next-generation CG pipeline infrastructure. It was a service-oriented architecture based on Pixar's OpenUSD. I worked with artists in Rigging, Modeling and Scene Layout to design and build workflow code and UIs (Python QTGui) in tools such as Nuke, Maya, Katana and Houdini. Credited on the animated film Abominable (2019).",
    "video": ""
  },
  {
    "title": "McMullen Virtual Reality",
    "photo": "images/rr.jpg",
    "year": 2015,
    "role": [
      "Software Engineer"
    ],
    "description": "For the Spring 2015 exhibit at the McMullen Museum of Art at Boston College, I created a Virtual Reality experience to allow visitors to virtually visit the areas in Ireland where the art pieces originated from. I shot and stitched together panoramas from across the Irish countryside and built an interactive VR experience in Unity for the Oculus DK2. Custom 3D printed button mounts allowed users to change scenes.",
    "video": ""
  }
];


// Get the necessary elements
const projectTilesContainer = document.getElementById('project-tiles-container');
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalPhoto = document.getElementById('modal-photo');
const modalYear = document.getElementById('modal-year');
const modalRole = document.getElementById('modal-role');
const modalDescription = document.getElementById('modal-description');
const modalVideo = document.getElementById('modal-video');
const closeBtn = document.getElementsByClassName('close')[0];

// Generate project tiles dynamically
projectdata.forEach(project => {
  const projectTile = document.createElement('div');
  projectTile.classList.add('project-tile');
  projectTile.style.setProperty('--background-image', `url('${project.photo}')`);

  projectTile.innerHTML = `
    <h3>${project.title}</h3>
  `;
  projectTile.addEventListener('click', () => {
    // Update modal content with project details
    modalTitle.textContent = project.title;
    modalPhoto.src = project.photo;
    modalYear.textContent = project.year;
    modalRole.innerHTML = project.role.map(role => `<li>${role}</li>`).join('');
    modalDescription.innerHTML = project.description;
    modalVideo.innerHTML = `<iframe src="${project.video}" allowfullscreen></iframe>`;
    projectModal.style.display = 'block';
    
  });
  projectTilesContainer.appendChild(projectTile);
});

// Close modal when close button is clicked
closeBtn.addEventListener('click', () => {
  projectModal.style.display = 'none';
});