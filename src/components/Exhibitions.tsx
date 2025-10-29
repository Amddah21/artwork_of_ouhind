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
    <section id="exhibitions" className="relative overflow-hidden" style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-2xl" style={{ backgroundColor: '#873F31' /* PIPE */ }}></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl" style={{ backgroundColor: '#CCB999' /* RUSK */ }}></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
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
            className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6" 
            style={{
              background: 'linear-gradient(135deg, rgba(135, 63, 49, 0.08) 0%, rgba(135, 63, 49, 0.04) 100%)',
              border: '1.5px solid rgba(135, 63, 49, 0.2)' /* PIPE */
            }}
          >
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse" style={{backgroundColor: '#873F31' /* PIPE */}}></div>
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#873F31' /* PIPE */}} />
            <span className="text-sm sm:text-base lg:text-lg font-semibold" style={{color: '#873F31', fontFamily: "'Proza Libre', sans-serif"}}>Parcours d'Expositions</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" 
            style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}
          >
            Chronologie Artistique
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4" 
            style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          {[
            { icon: Calendar, value: "40+", label: "Années d'activité" },
            { icon: Award, value: totalExhibitions.toString(), label: "Expositions" },
            { icon: Globe, value: countries.length.toString(), label: "Pays" },
            { icon: Star, value: "15+", label: "Années documentées" }
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
                <Card className="text-center p-4 sm:p-6 transition-all duration-300 group-hover:shadow-xl rounded-lg border" style={{
                  backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                  borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
                }}>
                  <CardContent className="p-0">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: '#873F31' /* PIPE */ }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <div className="text-2xl sm:text-3xl font-bold mb-2" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>{stat.value}</div>
                    <div className="text-xs sm:text-sm" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>{stat.label}</div>
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
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4"
        >
          {[
            { key: 'all', label: 'Toutes', icon: Globe },
            { key: 'national', label: '🇲🇦 Nationales', icon: Award },
            { key: 'international', label: ' Internationales', icon: Globe }
          ].map((filter) => {
            const IconComponent = filter.icon;
            const isActive = selectedFilter === filter.key;
            return (
              <motion.div
                key={filter.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setSelectedFilter(filter.key)}
                  className="transition-all duration-300 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base"
                  style={{
                    backgroundColor: isActive ? '#873F31' /* PIPE */ : '#F9F8F3' /* FROSTY WHITE */,
                    color: isActive ? '#F9F8F3' /* FROSTY WHITE */ : '#433D38' /* CHARCOAL TAUPE */,
                    borderColor: isActive ? '#873F31' /* PIPE */ : 'rgba(122, 119, 113, 0.3)' /* SAGE */,
                    borderWidth: '1.5px',
                    fontFamily: "'Proza Libre', sans-serif",
                    fontWeight: isActive ? 600 : 400
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
              className={`p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 border ${
                canScrollLeft ? 'hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: canScrollLeft ? '#EBE2D1' /* PEACH CREAM */ : '#F9F8F3' /* FROSTY WHITE */,
                borderColor: canScrollLeft ? 'rgba(135, 63, 49, 0.3)' /* PIPE */ : 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" style={{color: canScrollLeft ? '#873F31' /* PIPE */ : '#717871' /* SAGE */}} />
            </motion.button>
            
            <div className="text-center px-2">
              <h3 className="text-base sm:text-lg font-bold" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>
                Parcours Chronologique
              </h3>
              <p className="text-xs sm:text-sm mt-1" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>
                Utilisez les flèches ou faites défiler horizontalement
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 border ${
                canScrollRight ? 'hover:shadow-xl' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: canScrollRight ? '#EBE2D1' /* PEACH CREAM */ : '#F9F8F3' /* FROSTY WHITE */,
                borderColor: canScrollRight ? 'rgba(135, 63, 49, 0.3)' /* PIPE */ : 'rgba(122, 119, 113, 0.2)' /* SAGE */
              }}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" style={{color: canScrollRight ? '#873F31' /* PIPE */ : '#717871' /* SAGE */}} />
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
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#873F31] to-transparent opacity-20 transform -translate-y-1/2 pointer-events-none"></div>
            
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
                  className="flex-shrink-0 w-72 sm:w-80 snap-start cursor-pointer"
                  onClick={() => toggleYear(exhibition.year)}
                >
                  {/* Timeline Card */}
                  <Card className={`p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl rounded-lg border ${
                    expandedYear === exhibition.year ? 'ring-2 ring-[#873F31] ring-opacity-50' : ''
                  }`}
                  style={{
                    backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                    borderColor: expandedYear === exhibition.year ? 'rgba(135, 63, 49, 0.3)' /* PIPE */ : 'rgba(122, 119, 113, 0.15)' /* SAGE */
                  }}>
                    <CardContent className="p-0">
                      {/* Year Display */}
                      <div className="text-center mb-4 sm:mb-6">
                        <motion.div
                          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center border-4 shadow-lg"
                          style={{
                            borderColor: isInternational ? '#873F31' /* PIPE */ : '#717871' /* SAGE */,
                            backgroundColor: isInternational ? '#EBE2D1' /* PEACH CREAM */ : '#F9F8F3' /* FROSTY WHITE */
                          }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <span 
                            className="text-xl sm:text-2xl font-bold" 
                            style={{
                              color: isInternational ? '#873F31' /* PIPE */ : '#717871' /* SAGE */,
                              fontFamily: "'Cormorant Garamond', serif"
                            }}
                          >
                            {exhibition.year}
                          </span>
                        </motion.div>
                        
                        <h3 className="text-lg sm:text-xl font-bold mb-2" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>
                          {exhibition.year}
                        </h3>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" style={{color: '#873F31' /* PIPE */}} />
                            <span className="text-xs sm:text-sm" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>Expositions</span>
                          </div>
                          <Badge className="rounded-full px-2 py-0.5" style={{
                            backgroundColor: '#EBE2D1' /* PEACH CREAM */,
                            color: '#873F31' /* PIPE */,
                            borderColor: 'rgba(135, 63, 49, 0.2)',
                            borderWidth: '1px',
                            fontFamily: "'Proza Libre', sans-serif"
                          }}>
                            {exhibition.events.length}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" style={{color: '#873F31' /* PIPE */}} />
                            <span className="text-xs sm:text-sm" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>Pays</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {exhibitionCountries.slice(0, 3).map((country, idx) => (
                              <span key={idx} className="text-base sm:text-lg">{getCountryFlag(country)}</span>
                            ))}
                            {exhibitionCountries.length > 3 && (
                              <span className="text-xs ml-1" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>
                                +{exhibitionCountries.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" style={{color: '#873F31' /* PIPE */}} />
                            <span className="text-xs sm:text-sm" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>Type</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              borderColor: isInternational ? '#873F31' /* PIPE */ : '#717871' /* SAGE */,
                              color: isInternational ? '#873F31' /* PIPE */ : '#717871' /* SAGE */,
                              backgroundColor: isInternational ? '#EBE2D1' /* PEACH CREAM */ : 'transparent',
                              fontFamily: "'Proza Libre', sans-serif"
                            }}
                          >
                            {isInternational ? 'International' : 'National'}
                          </Badge>
                        </div>
                      </div>

                      {/* Expand Indicator */}
                      <div className="mt-4 sm:mt-6 text-center">
                        <motion.div
                          animate={{ y: expandedYear === exhibition.year ? [0, 5, 0] : [0, 3, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {expandedYear === exhibition.year ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" style={{color: '#873F31' /* PIPE */}} />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" style={{color: '#873F31' /* PIPE */}} />
                          )}
                        </motion.div>
                        <span className="text-xs mt-1 block" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>
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
                className="rounded-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                style={{ backgroundColor: '#F9F8F3' /* FROSTY WHITE */ }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>
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
                      <Card className="border-l-4 transition-all duration-300 rounded-lg" style={{
                        borderLeftColor: getCountryColor(event.country || 'Maroc'),
                        backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
                        borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
                      }}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                <h4 className="text-base sm:text-lg font-bold" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>
                                  {event.title}
                                </h4>
                                <Badge variant="outline" className="text-xs rounded-full" style={{
                                  borderColor: 'rgba(122, 119, 113, 0.3)' /* SAGE */,
                                  color: '#717871' /* SAGE */,
                                  fontFamily: "'Proza Libre', sans-serif"
                                }}>
                                  {getExhibitionType(event.title, event.type)}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>
                                <MapPin className="w-4 h-4" />
                                <span className="font-body">{event.location}</span>
                                <span className="text-lg">{getCountryFlag(event.country || 'Maroc')}</span>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs rounded-full px-2 py-0.5"
                                  style={{
                                    borderColor: getCountryColor(event.country || 'Maroc'),
                                    color: getCountryColor(event.country || 'Maroc'),
                                    fontFamily: "'Proza Libre', sans-serif"
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
          <Card className="p-6 sm:p-8 max-w-2xl mx-auto rounded-lg border" style={{
            backgroundColor: '#F9F8F3' /* FROSTY WHITE */,
            borderColor: 'rgba(122, 119, 113, 0.15)' /* SAGE */
          }}>
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
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 mr-3" style={{color: '#873F31' /* PIPE */}} />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold" style={{color: '#433D38' /* CHARCOAL TAUPE */, fontFamily: "'Cormorant Garamond', serif"}}>
                  Carrière Exceptionnelle
                </h3>
              </motion.div>
              <p className="text-base sm:text-lg mb-6 px-2" style={{color: '#717871' /* SAGE */, fontFamily: "'Proza Libre', sans-serif"}}>
                Plus de 40 années d'engagement artistique, avec des expositions dans 4 pays différents, 
                témoignant d'un parcours riche et diversifié dans l'art contemporain.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
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
                      <Badge className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border" style={{
                        backgroundColor: '#EBE2D1' /* PEACH CREAM */,
                        color: '#873F31' /* PIPE */,
                        borderColor: 'rgba(135, 63, 49, 0.2)' /* PIPE */,
                        fontFamily: "'Proza Libre', sans-serif"
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
