export type ProjectVideo = [string, string];

export type Project = {
  title: string;
  photo: string;
  year: number | string;
  details: string;
  subtitle?: string;
  role?: string[];
  description?: string;
  video?: ProjectVideo[];
  flickrAlbumUrl?: string;
  link?: string;
};

