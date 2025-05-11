import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => {
        console.log('Backend connected:', data);
        setIsConnected(true);
      })
      .catch(error => {
        console.error('Failed to connect to backend:', error);
        setIsConnected(false);
      });
  }, []);

  return (
    <div className="home-page bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center h-full">
          <div className="hero-content text-center z-10">
            <motion.div className="text-content mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hero-title"
                style={{ fontSize: '6rem', fontWeight: '900', color: '#7C4585' }}
              >
                SmartHire
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="hero-subtitle"
              >
                Hire Smarter, Hire Faster
              </motion.p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="connection-status mb-8"
            >
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
              <span className="status-text">
                {isConnected ? 'Connecté au serveur' : 'Serveur non disponible'}
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="buttons-container flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onClick={() => navigate('/recruiter')}
              >
                Espace Recruteur
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                onClick={() => navigate('/candidate')}
              >
                Espace Candidat
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

           {/* Présentation rapide */}
           <section className="presentation-section">
        <div className="container mx-auto max-w-4xl">
          <h2 className="section-title">Présentation rapide de la plateforme</h2>
          <p className="section-description">
            Notre plateforme utilise l’IA pour faire correspondre automatiquement les candidats aux offres les plus pertinentes 
            et les soumettre à un entretien virtuel avec un chatbot intelligent.
          </p>
        </div>
      </section>

      {/* Fonctionnalités clés */}
      <section className="features-section">
        <div className="container mx-auto">
          <h2 className="section-title">Fonctionnalités Clés</h2>
          <div className="features-grid">
            {[ 
              {title: 'Analyse intelligente de CV', description: 'Comprend les compétences et expériences clés pour un tri efficace.' },
              {title: 'Matching automatique', description: 'Associe chaque profil aux offres les plus pertinentes grâce à l’IA.' },
              {title: 'Entretien interactif', description: 'Simule un entretien via un chatbot intelligent pour filtrer les meilleurs profils.' },
              {title: 'Notification instantanée', description: 'Alerte immédiate en cas de compatibilité entre profil et offre.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="feature-card"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deux parcours utilisateurs */}
      <section className="user-path-section">
        <div className="container mx-auto">
          <h2 className="section-title">Deux Parcours Utilisateurs</h2>
          <div className="user-paths-grid">
            {/* Candidats */}
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              className="user-path candidate"
            >
              <h3 className="user-title">Pour les Candidats</h3>
              <ul className="user-list">
                <li> Déposer un CV</li>
                <li> Explorer les offres</li>
                <li> Passer un entretien</li>
              </ul>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/candidate')}
              >
                Accéder à l’espace Candidat
              </button>
            </motion.div>

            {/* Recruteurs */}
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              className="user-path recruiter"
            >
              <h3 className="user-title">Pour les Recruteurs</h3>
              <ul className="user-list">
                <li> Publier une offre</li>
                <li> Trier automatiquement les CV</li>
                <li> Recevoir les profils compatibles</li>
              </ul>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/recruiter')}
              >
                Accéder à l’espace Recruteur
              </button>
            </motion.div>
          </div>
        </div>
      </section>

    </div>

  );
};

export default HomePage;
