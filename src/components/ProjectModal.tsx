import { useEffect, type MouseEvent } from 'react';
import type { Project } from '../types/project';
import './ProjectModal.css';

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const createMarkup = (html: string) => ({ __html: html });

  const renderVideos = () => {
    if (!project.video || project.video.length === 0) return null;

    return project.video.map((video, index) => (
      <div key={index} className="video-section">
        <h4>{video[0]}</h4>
        <iframe 
          src={video[1]} 
          frameBorder="0" 
          style={{
            height: '40vh',
            width: '100%',
            position: 'relative'
          }}
          allowFullScreen
        />
      </div>
    ));
  };

  const renderFlickrEmbed = () => {
    if (!project.flickrAlbumUrl) return null;

    return (
      <div className="flickr-embed">
        <a 
          data-flickr-embed="true" 
          data-footer="false" 
          href={project.flickrAlbumUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img 
            src="https://live.staticflickr.com/5213/5484169808_303d1b65d1_m.jpg" 
            width="420" 
            height="320" 
            alt={project.title}
          />
        </a>
      </div>
    );
  };

  useEffect(() => {
    // Load Flickr embed script if needed
    if (project.flickrAlbumUrl) {
      const existingScript = document.getElementById('flickr-embed-script');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'flickr-embed-script';
      script.src = '//embedr.flickr.com/assets/client-code.js';
      script.charset = 'utf-8';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [project.flickrAlbumUrl]);

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-dialog">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <div className="modal-body">
            <h2>
              {project.title}
              {project.year ? <span className="project-year"> • {project.year}</span> : null}
            </h2>
            
            {project.role && project.role.length > 0 && (
              <ul className="role-list">
                {project.role.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            )}
            
            {project.subtitle && (
              <div 
                className="project-subtitle"
                dangerouslySetInnerHTML={createMarkup(project.subtitle)}
              />
            )}
            
            {project.description && (
              <div 
                className="project-description"
                dangerouslySetInnerHTML={createMarkup(project.description)}
              />
            )}
            
            {renderVideos()}
            
            {renderFlickrEmbed()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal; 