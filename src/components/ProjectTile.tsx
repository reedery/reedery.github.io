import type { Project } from '../types/project';
import './ProjectTile.css';

type ProjectTileProps = {
  project: Project;
  onClick: (project: Project) => void;
};

const ProjectTile = ({ project, onClick }: ProjectTileProps) => {
  const handleClick = () => {
    onClick(project);
  };

  return (
    <div className="project-tile" onClick={handleClick}>
      <img src={project.photo} draggable="false" alt={project.title} />
      <h3>{project.title} - {project.year}</h3>
      <p>{project.details}</p>
    </div>
  );
};

export default ProjectTile; 