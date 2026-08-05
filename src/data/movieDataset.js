// Initial dataset for the Graph Database Movie Recommendation Engine
export const INITIAL_DATASET = {
  genres: [
    { id: 'g_scifi', name: 'Sci-Fi', color: '#06b6d4' },
    { id: 'g_action', name: 'Action', color: '#f43f5e' },
    { id: 'g_drama', name: 'Drama', color: '#a855f7' },
    { id: 'g_thriller', name: 'Thriller', color: '#eab308' },
    { id: 'g_crime', name: 'Crime', color: '#ef4444' },
    { id: 'g_animation', name: 'Animation', color: '#10b981' },
    { id: 'g_adventure', name: 'Adventure', color: '#3b82f6' }
  ],

  directors: [
    { id: 'd_nolan', name: 'Christopher Nolan', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop' },
    { id: 'd_tarantino', name: 'Quentin Tarantino', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop' },
    { id: 'd_villeneuve', name: 'Denis Villeneuve', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop' },
    { id: 'd_miyazaki', name: 'Hayao Miyazaki', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop' },
    { id: 'd_fincher', name: 'David Fincher', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop' }
  ],

  actors: [
    { id: 'a_dicaprio', name: 'Leonardo DiCaprio', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop' },
    { id: 'a_bale', name: 'Christian Bale', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop' },
    { id: 'a_chalamet', name: 'Timothée Chalamet', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop' },
    { id: 'a_pitt', name: 'Brad Pitt', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop' },
    { id: 'a_murphy', name: 'Cillian Murphy', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop' },
    { id: 'a_zendaya', name: 'Zendaya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop' }
  ],

  movies: [
    {
      id: 'm_inception',
      title: 'Inception',
      year: 2010,
      directorId: 'd_nolan',
      actorIds: ['a_dicaprio', 'a_murphy'],
      genreIds: ['g_scifi', 'g_action', 'g_thriller'],
      rating: 8.8,
      runtime: '148 min',
      overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_interstellar',
      title: 'Interstellar',
      year: 2014,
      directorId: 'd_nolan',
      actorIds: ['a_chalamet', 'a_murphy'],
      genreIds: ['g_scifi', 'g_drama', 'g_adventure'],
      rating: 8.7,
      runtime: '169 min',
      overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_oppenheimer',
      title: 'Oppenheimer',
      year: 2023,
      directorId: 'd_nolan',
      actorIds: ['a_murphy'],
      genreIds: ['g_drama'],
      rating: 8.9,
      runtime: '180 min',
      overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_dark_knight',
      title: 'The Dark Knight',
      year: 2008,
      directorId: 'd_nolan',
      actorIds: ['a_bale', 'a_murphy'],
      genreIds: ['g_action', 'g_crime', 'g_drama'],
      rating: 9.0,
      runtime: '152 min',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_dune',
      title: 'Dune: Part One',
      year: 2021,
      directorId: 'd_villeneuve',
      actorIds: ['a_chalamet', 'a_zendaya'],
      genreIds: ['g_scifi', 'g_adventure'],
      rating: 8.0,
      runtime: '155 min',
      overview: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir is haunted by visions of a dark future.',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_dune2',
      title: 'Dune: Part Two',
      year: 2024,
      directorId: 'd_villeneuve',
      actorIds: ['a_chalamet', 'a_zendaya'],
      genreIds: ['g_scifi', 'g_adventure', 'g_action'],
      rating: 8.6,
      runtime: '166 min',
      overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_fight_club',
      title: 'Fight Club',
      year: 1999,
      directorId: 'd_fincher',
      actorIds: ['a_pitt'],
      genreIds: ['g_drama', 'g_thriller'],
      rating: 8.8,
      runtime: '139 min',
      overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_pulp_fiction',
      title: 'Pulp Fiction',
      year: 1994,
      directorId: 'd_tarantino',
      actorIds: ['a_pitt'],
      genreIds: ['g_crime', 'g_drama'],
      rating: 8.9,
      runtime: '154 min',
      overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&auto=format&fit=crop'
    },
    {
      id: 'm_spirited_away',
      title: 'Spirited Away',
      year: 2001,
      directorId: 'd_miyazaki',
      actorIds: [],
      genreIds: ['g_animation', 'g_adventure'],
      rating: 8.6,
      runtime: '125 min',
      overview: 'During her family\'s move to the suburbs, a 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop'
    }
  ],

  users: [
    { id: 'u_alice', name: 'Alice Chen', role: 'Sci-Fi & Nolan Enthusiast', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop' },
    { id: 'u_bob', name: 'Bob Smith', role: 'Drama & Crime Cinephile', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop' },
    { id: 'u_charlie', name: 'Charlie Kim', role: 'Action & Adventure Buff', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop' }
  ],

  // Initial user ratings (User -> Movie edges with rating score)
  ratings: [
    { userId: 'u_alice', movieId: 'm_inception', score: 5 },
    { userId: 'u_alice', movieId: 'm_interstellar', score: 5 },
    { userId: 'u_alice', movieId: 'm_dune', score: 4 },
    
    { userId: 'u_bob', movieId: 'm_fight_club', score: 5 },
    { userId: 'u_bob', movieId: 'm_pulp_fiction', score: 5 },
    { userId: 'u_bob', movieId: 'm_oppenheimer', score: 4 },
    { userId: 'u_bob', movieId: 'm_inception', score: 4 },

    { userId: 'u_charlie', movieId: 'm_dark_knight', score: 5 },
    { userId: 'u_charlie', movieId: 'm_dune2', score: 5 },
    { userId: 'u_charlie', movieId: 'm_inception', score: 4 }
  ]
};
