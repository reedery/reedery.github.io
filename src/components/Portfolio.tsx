import { useEffect, useRef, useState } from 'react';
import { projectData } from '../data/projectData';
import type { Project } from '../types/project';
import ProjectTile from './ProjectTile';
import ProjectModal from './ProjectModal';
import './Portfolio.css';

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const [scrollCooldown, setScrollCooldown] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sort projects by year (newest first) and swap first two items like original
  const sortedProjects = [...projectData]
    .sort((a, b) => new Date(b.year) - new Date(a.year));
  
  // Swap first two items to match original behavior
  if (sortedProjects.length >= 2) {
    [sortedProjects[0], sortedProjects[1]] = [sortedProjects[1], sortedProjects[0]];
  }

  const handleProjectClick = (project: Project) => {
    if (scrollCooldown) {
      setSelectedProject(project);
    }
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handlePointerDown = (event: PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    if (event.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({
      x: event.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
    });
  };

  const handlePointerMove = (event: PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    if (!isDragging) return;
    
    const currentX = event.pageX - container.offsetLeft;
    const distance = currentX - dragStart.x;
    container.scrollLeft = dragStart.scrollLeft - distance;
    
    if (Math.abs(distance) > 5) { // 5px threshold for dragging
      setScrollCooldown(false);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      setScrollCooldown(true);
    }, 25);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
    setTimeout(() => {
      setScrollCooldown(true);
    }, 25);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointerdown', handlePointerDown);
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerup', handlePointerUp);
      container.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        container.removeEventListener('pointerdown', handlePointerDown);
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerup', handlePointerUp);
        container.removeEventListener('pointerleave', handlePointerLeave);
      };
    }
  }, [isDragging, dragStart, scrollCooldown]);

  return (
    <div className="portfolio">
      <div 
        ref={containerRef}
        className="project-tiles-container"
      >
        {sortedProjects.map((project, index) => (
          <ProjectTile
            key={`${project.title}-${index}`}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </div>
      
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Portfolio; 