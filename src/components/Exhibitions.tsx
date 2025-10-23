import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, Award, Globe, Users, Star, Trophy, Sparkles, Filter, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface Exhibition {
  year: number;
  events: {
    title: string;
    location: string;
    country?: string;
    type?: string;
  }[];
}

const Exhibitions = () => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const exhibitions: Exhibition[] = [
    {
      year: 2019,
      events: [
        { title: "L'Art Africain", location: "Khouribga", country: "Maroc" },
        { title: "Théâtre Med V", location: "Rabat", country: "Maroc" },
        { title: "UGARIT ART", location: "Istanbul", country: "Turquie" },
        { title: "Route des 1000 Kasbah", location: "Kalaat Mgouna", country: "Maroc" }
      ]
    },
    {
      year: 2018,
      events: [
        { title: "Couleur des Mehdia", location: "Kenitra", country: "Maroc" },
        { title: "مواطنون فاعلون تمارة", location: "Tamra", country: "Maroc" },
        { title: "Arab Art Cologne", location: "Cologne", country: "Allemagne" }
      ]
    },
    {
      year: 2016,
      events: [
        { title: "Exposition Palais des Congrès", location: "Bouregrague Salé", country: "Maroc" }
      ]
    },
    {
      year: 2015,
      events: [
        { title: "Exposition Mega Mall", location: "Rabat", country: "Maroc" },
        { title: "Nuit des Galeries", location: "Espace Ben Ali Rbati, Rabat", country: "Maroc", type: "Novembre" }
      ]
    },
    {
      year: 2014,
      events: [
        { title: "7ème Salon du Cheval", location: "El-Jadida", country: "Maroc", type: "Octobre" },
        { title: "Exposition", location: "Centre Culturel d'Égypte", country: "Maroc" }
      ]
    },
    {
      year: 2013,
      events: [
        { title: "6ème Salon du Cheval", location: "El-Jadida", country: "Maroc" },
        { title: "Exposition", location: "Kalaa Megouna", country: "Maroc" }
      ]
    },
    {
      year: 2012,
      events: [
        { title: "Exposition", location: "Dreux", country: "France" },
        { title: "Exposition", location: "Centre Culturel d'Agdal, Rabat", country: "Maroc" }
      ]
    },
    {
      year: 2011,
      events: [
        { title: "Journée de la Femme", location: "Galerie Qais, Rabat", country: "Maroc" },
        { title: "Exposition", location: "Galerie Nadira", country: "Maroc" },
        { title: "Festival Régional", location: "Région de Salé", country: "Maroc" },
        { title: "Exposition", location: "Maison de la Culture Sala Al Jadida", country: "Maroc" },
        { title: "Exposition", location: "École ESI, Rabat", country: "Maroc" }
      ]
    },
    {
      year: 2010,
      events: [
        { title: "Exposition", location: "Centre Culturel Russe, Rabat", country: "Maroc" },
        { title: "Salon de la Mariée", location: "Corniche Bouregreg", country: "Maroc" },
        { title: "Printemps de l'Agdal", location: "Espace Abou Baker, Rabat", country: "Maroc" },
        { title: "Journée de la Terre", location: "Espace Abou Baker Agdal, Rabat", country: "Maroc" }
      ]
    },
    {
      year: 2009,
      events: [
        { title: "Exposition", location: "Espace Rivage Témara", country: "Maroc", type: "Été" },
        { title: "Exposition", location: "Hilton Rabat", country: "Maroc" }
      ]
    },
    {
      year: 2004,
      events: [
        { title: "Exposition au profit des enfants malades", location: "Villa Martine", country: "Maroc" }
      ]
    }
  ];

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  useEffect(() => {
    setIsLoaded(true);
    checkScrollButtons();
  }, []);

  // Check if scroll buttons should be enabled/disabled
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Smooth scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  // Handle wheel scrolling (horizontal scroll on desktop)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollContainerRef.current && e.shiftKey) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRight();
    }
  }, []);

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Maroc': '🇲🇦',
      'France': '🇫🇷',
      'Allemagne': '🇩🇪',
      'Turquie': '🇹🇷'
    };
    return flags[country] || '🌍';
  };

  const getCountryColor = (country: string) => {
    const colors: { [key: string]: string } = {
      'Maroc': '#C1272D',
      'France': '#002395',
      'Allemagne': '#000000',
      'Turquie': '#E30A17'
    };
    return colors[country] || '#7A6B5A';
  };

  const getExhibitionType = (title: string, type?: string) => {
    if (type) return type;
    if (title.toLowerCase().includes('salon')) return 'Salon';
    if (title.toLowerCase().includes('festival')) return 'Festival';
    if (title.toLowerCase().includes('nuit')) return 'Événement nocturne';
    if (title.toLowerCase().includes('journée')) return 'Journée spéciale';
    return 'Exposition';
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    if (selectedFilter === 'international' && !exhibition.events.some(event => event.country !== 'Maroc')) {
      return false;
    }
    if (selectedFilter === 'national' && !exhibition.events.some(event => event.country === 'Maroc')) {
      return false;
    }
    if (searchTerm && !exhibition.events.some(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  const totalExhibitions = exhibitions.reduce((total, exhibition) => total + exhibition.events.length, 0);
  const countries = [...new Set(exhibitions.flatMap(exhibition => exhibition.events.map(event => event.country || 'Maroc')))];

  return (
    <section id="exhibitions" className="luxury-section luxury-bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: 'var(--luxury-gold)' }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: 'var(--luxury-orange)' }}></div>
      </div>
      <div className="luxury-container relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full painterly-card mb-6" 
            style={{
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
              border: '2px solid rgba(251, 191, 36, 0.3)'
            }}
          >
            <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: 'hsl(38, 95%, 60%)'}}></div>
            <Trophy className="w-5 h-5" style={{color: 'hsl(38, 95%, 60%)'}} />
            <span className="font-accent text-lg font-bold" style={{color: 'hsl(38, 95%, 60%)'}}>Parcours d'Expositions</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6"
          >
            Chronologie Artistique
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl max-w-4xl mx-auto leading-relaxed font-body" 
            style={{color: 'hsl(240, 10%, 35%)'}}
          >
            Un parcours riche de plus de 40 années d'expositions nationales et internationales, 
            témoignant d'une carrière artistique exceptionnelle et d'un engagement profond dans l'art contemporain
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: Calendar, value: "40+", label: "Années d'activité", color: "from-amber-400 to-orange-500" },
            { icon: Award, value: totalExhibitions.toString(), label: "Expositions", color: "from-yellow-400 to-orange-500" },
            { icon: Globe, value: countries.length.toString(), label: "Pays", color: "from-orange-400 to-red-500" },
            { icon: Star, value: "15+", label: "Années documentées", color: "from-yellow-500 to-amber-600" }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="painterly-card text-center p-6 hover-watercolor-blend transition-all duration-300 group-hover:shadow-xl">
                  <CardContent className="p-0">
                    <motion.div 
                      className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-3xl font-bold font-display mb-2 text-gradient">{stat.value}</div>
                    <div className="text-sm font-body" style={{color: 'hsl(240, 10%, 35%)'}}>{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { key: 'all', label: 'Toutes', icon: Globe },
            { key: 'national', label: '🇲🇦 Nationales', icon: Award },
            { key: 'international', label: '🌍 Internationales', icon: Globe }
          ].map((filter) => {
            const IconComponent = filter.icon;
            return (
              <motion.div
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedFilter === filter.key ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter(filter.key)}
                  className="painterly-button transition-all duration-300"
                  style={{
                    backgroundColor: selectedFilter === filter.key ? 'hsl(38, 95%, 60%)' : 'transparent',
                    color: selectedFilter === filter.key ? 'hsl(45, 100%, 97%)' : 'hsl(240, 10%, 15%)',
                    borderColor: 'hsl(330, 20%, 88%)'
                  }}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {filter.label}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Horizontal Timeline Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative"
        >
          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full painterly-card shadow-lg transition-all duration-300 ${
                canScrollLeft ? 'hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: canScrollLeft ? 'rgba(251, 191, 36, 0.1)' : 'rgba(200, 200, 200, 0.1)' }}
            >
              <ChevronLeft className="w-6 h-6" style={{color: canScrollLeft ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 50%)'}} />
            </motion.button>
            
            <div className="text-center">
              <h3 className="text-lg font-bold font-display" style={{color: 'hsl(240, 10%, 15%)'}}>
                Parcours Chronologique
              </h3>
              <p className="text-sm" style={{color: 'hsl(240, 10%, 35%)'}}>
                Utilisez les flèches ou faites défiler horizontalement
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-3 rounded-full painterly-card shadow-lg transition-all duration-300 ${
                canScrollRight ? 'hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ backgroundColor: canScrollRight ? 'rgba(251, 191, 36, 0.1)' : 'rgba(200, 200, 200, 0.1)' }}
            >
              <ChevronRight className="w-6 h-6" style={{color: canScrollRight ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 50%)'}} />
            </motion.button>
          </div>

          {/* Horizontal Scrollable Timeline */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="flex flex-row space-x-6 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
            style={{
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Timeline Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30 transform -translate-y-1/2 pointer-events-none"></div>
            
            {filteredExhibitions.map((exhibition, index) => {
              const exhibitionCountries = [...new Set(exhibition.events.map(event => event.country || 'Maroc'))];
              const isInternational = exhibitionCountries.some(country => country !== 'Maroc');
              
              return (
                <motion.div
                  key={exhibition.year}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                  className="flex-shrink-0 w-80 snap-start cursor-pointer"
                  onClick={() => toggleYear(exhibition.year)}
                >
                  {/* Timeline Card */}
                  <Card className={`painterly-card p-6 transition-all duration-300 hover:shadow-2xl ${
                    expandedYear === exhibition.year ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                  }`}>
                    <CardContent className="p-0">
                      {/* Year Display */}
                      <div className="text-center mb-6">
                        <motion.div
                          className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border-4 shadow-lg"
                          style={{
                            borderColor: isInternational ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 60%)',
                            background: isInternational 
                              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(122, 107, 90, 0.1) 0%, rgba(122, 107, 90, 0.05) 100%)'
                          }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <span 
                            className="text-2xl font-bold font-display" 
                            style={{color: isInternational ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 60%)'}}
                          >
                            {exhibition.year}
                          </span>
                        </motion.div>
                        
                        <h3 className="text-xl font-bold font-display mb-2" style={{color: 'hsl(240, 10%, 15%)'}}>
                          {exhibition.year}
                        </h3>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" style={{color: 'hsl(38, 95%, 60%)'}} />
                            <span className="text-sm font-body" style={{color: 'hsl(240, 10%, 35%)'}}>Expositions</span>
                          </div>
                          <Badge className="painterly-card" style={{
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            color: 'hsl(38, 95%, 60%)'
                          }}>
                            {exhibition.events.length}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" style={{color: 'hsl(38, 95%, 60%)'}} />
                            <span className="text-sm font-body" style={{color: 'hsl(240, 10%, 35%)'}}>Pays</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {exhibitionCountries.slice(0, 3).map((country, idx) => (
                              <span key={idx} className="text-lg">{getCountryFlag(country)}</span>
                            ))}
                            {exhibitionCountries.length > 3 && (
                              <span className="text-xs ml-1" style={{color: 'hsl(240, 10%, 35%)'}}>
                                +{exhibitionCountries.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" style={{color: 'hsl(38, 95%, 60%)'}} />
                            <span className="text-sm font-body" style={{color: 'hsl(240, 10%, 35%)'}}>Type</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{
                              borderColor: isInternational ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 60%)',
                              color: isInternational ? 'hsl(38, 95%, 60%)' : 'hsl(240, 10%, 60%)'
                            }}
                          >
                            {isInternational ? 'International' : 'National'}
                          </Badge>
                        </div>
                      </div>

                      {/* Expand Indicator */}
                      <div className="mt-6 text-center">
                        <motion.div
                          animate={{ y: expandedYear === exhibition.year ? [0, 5, 0] : [0, 3, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {expandedYear === exhibition.year ? (
                            <ChevronUp className="w-5 h-5 mx-auto" style={{color: 'hsl(38, 95%, 60%)'}} />
                          ) : (
                            <ChevronDown className="w-5 h-5 mx-auto" style={{color: 'hsl(38, 95%, 60%)'}} />
                          )}
                        </motion.div>
                        <span className="text-xs mt-1 block" style={{color: 'hsl(240, 10%, 35%)'}}>
                          {expandedYear === exhibition.year ? 'Cliquer pour fermer' : 'Cliquer pour voir les détails'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Detailed Events Modal */}
        <AnimatePresence>
          {expandedYear && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setExpandedYear(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-bold font-display" style={{color: 'hsl(240, 10%, 15%)'}}>
                    Expositions {expandedYear}
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setExpandedYear(null)}
                    className="p-2"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {filteredExhibitions.find(e => e.year === expandedYear)?.events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="painterly-card hover-watercolor-blend border-l-4 transition-all duration-300" style={{
                        borderLeftColor: getCountryColor(event.country || 'Maroc')
                      }}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="text-lg font-bold font-display" style={{color: 'hsl(240, 10%, 15%)'}}>
                                  {event.title}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {getExhibitionType(event.title, event.type)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-sm" style={{color: 'hsl(240, 10%, 35%)'}}>
                                <MapPin className="w-4 h-4" />
                                <span className="font-body">{event.location}</span>
                                <span className="text-lg">{getCountryFlag(event.country || 'Maroc')}</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                  style={{
                                    borderColor: getCountryColor(event.country || 'Maroc'),
                                    color: getCountryColor(event.country || 'Maroc')
                                  }}
                                >
                                  {event.country || 'Maroc'}
                                </Badge>
                                {event.type && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span className="font-body">{event.type}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <Card className="painterly-card p-8 max-w-2xl mx-auto">
            <CardContent className="p-0">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={isLoaded ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="flex items-center justify-center mb-4"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Trophy className="w-8 h-8 mr-3" style={{color: 'hsl(38, 95%, 60%)'}} />
                </motion.div>
                <h3 className="text-2xl font-bold font-display" style={{color: 'hsl(240, 10%, 15%)'}}>
                  Carrière Exceptionnelle
                </h3>
              </motion.div>
              <p className="text-lg font-body mb-6" style={{color: 'hsl(240, 10%, 35%)'}}>
                Plus de 40 années d'engagement artistique, avec des expositions dans 4 pays différents, 
                témoignant d'un parcours riche et diversifié dans l'art contemporain.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: Award, value: `${totalExhibitions} Expositions` },
                  { icon: Globe, value: `${countries.length} Pays` },
                  { icon: Star, value: `40+ Années` }
                ].map((badge, index) => {
                  const IconComponent = badge.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge className="painterly-card px-4 py-2" style={{
                        backgroundColor: 'rgba(251, 191, 36, 0.1)',
                        color: 'hsl(38, 95%, 60%)'
                      }}>
                        <IconComponent className="w-4 h-4 mr-2" />
                        {badge.value}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Exhibitions;
