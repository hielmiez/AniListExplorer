import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimeCard from '../AnimeCard';

describe('AnimeCard', () => {
  const mockAnime = {
    id: 1,
    title: {
      romaji: 'Naruto',
      english: 'Naruto',
      native: 'ナルト'
    },
    coverImage: {
      large: '/naruto.jpg',
      color: '#ff8800'
    },
    studios: {
      nodes: [{ name: 'Studio Pierrot' }]
    },
    description: 'Ninja boy wants to be Hokage.',
    format: 'TV',
    episodes: 220,
    genres: ['Action', 'Adventure'],
    averageScore: 80,
    season: 'FALL',
    seasonYear: 2002,
  };

  it('renders grid view correctly', () => {
    render(<AnimeCard anime={mockAnime} view="grid" />);
    
    // Check title (might appear in multiple places like hover overlay)
    expect(screen.getAllByText('Naruto').length).toBeGreaterThan(0);
    
    // Check format & year (in overlay)
    expect(screen.getByText('TV')).toBeInTheDocument();
    expect(screen.getByText('Fall 2002')).toBeInTheDocument();
    
    // Check score
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders list view correctly', () => {
    render(<AnimeCard anime={mockAnime} view="list" />);
    
    expect(screen.getAllByText('Naruto').length).toBeGreaterThan(0);
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    
    // Check description fallback
    expect(screen.getByText(/Ninja boy wants to be Hokage/)).toBeInTheDocument();
  });

  it('handles missing data gracefully', () => {
    const minimalAnime = {
      id: 2,
      title: { romaji: 'Unknown' },
      coverImage: { large: '/unknown.jpg' },
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<AnimeCard anime={minimalAnime as any} view="grid" />);
    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0);
  });
});
