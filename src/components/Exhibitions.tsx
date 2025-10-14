import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expandedYear, setExpandedYear] = useState<number | null>(2023);

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

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Maroc': '🇲🇦',
      'France': '🇫🇷',
      'Allemagne': '🇩🇪',
      'Turquie': '🇹🇷'
    };
    return flags[country] || '🌍';
  };

  return (
    <section id="exhibitions" className="py-20 bg-gradient-to-br from-[#F8F8F8] to-[#F5F5F5]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full comfort-card border mb-6" style={{borderColor: '#7A6B5A', backgroundColor: 'rgba(122, 107, 90, 0.08)'}}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#7A6B5A'}}></div>
            <span className="font-accent text-lg font-bold comfort-text" style={{color: '#7A6B5A'}}>Parcours d'Expositions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold comfort-text mb-6">
            Chronologie Artistique
          </h2>
          <p className="text-xl comfort-text-muted font-body max-w-3xl mx-auto leading-relaxed">
            Un parcours riche de plus de 15 années d'expositions nationales et internationales, 
            témoignant d'une carrière artistique exceptionnelle
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{backgroundColor: '#7A6B5A', opacity: 0.3}}></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {exhibitions.map((exhibition, index) => (
                <div key={exhibition.year} className="relative">
                  {/* Year Marker */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full comfort-card flex items-center justify-center border-4" style={{borderColor: '#7A6B5A', backgroundColor: 'rgba(248, 248, 248, 0.9)'}}>
                      <span className="text-lg font-bold comfort-text" style={{color: '#7A6B5A'}}>
                        {exhibition.year}
                      </span>
                    </div>

                    {/* Year Header */}
                    <div className="ml-6 flex-1">
                      <button
                        onClick={() => toggleYear(exhibition.year)}
                        className="flex items-center justify-between w-full p-4 comfort-card rounded-lg hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-left">
                          <h3 className="text-xl font-bold comfort-text" style={{color: '#7A6B5A'}}>
                            {exhibition.year}
                          </h3>
                          <p className="text-sm comfort-text-muted">
                            {exhibition.events.length} exposition{exhibition.events.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        {expandedYear === exhibition.year ? (
                          <ChevronUp className="w-5 h-5 comfort-text" style={{color: '#7A6B5A'}} />
                        ) : (
                          <ChevronDown className="w-5 h-5 comfort-text" style={{color: '#7A6B5A'}} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Events List */}
                  {expandedYear === exhibition.year && (
                    <div className="mt-4 ml-22 space-y-3">
                      {exhibition.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="p-4 comfort-card rounded-lg border-l-4" style={{borderLeftColor: '#7A6B5A'}}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold comfort-text mb-2">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm comfort-text-muted">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                                <span className="text-lg">{getCountryFlag(event.country || 'Maroc')}</span>
                                {event.type && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>{event.type}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 comfort-card rounded-lg">
            <div className="text-3xl font-bold font-display mb-2" style={{color: '#7A6B5A'}}>40+</div>
            <div className="text-sm comfort-text-muted font-body">Années d'activité</div>
          </div>
          <div className="text-center p-6 comfort-card rounded-lg">
            <div className="text-3xl font-bold font-display mb-2" style={{color: '#7A6B5A'}}>25+</div>
            <div className="text-sm comfort-text-muted font-body">Expositions</div>
          </div>
          <div className="text-center p-6 comfort-card rounded-lg">
            <div className="text-3xl font-bold font-display mb-2" style={{color: '#7A6B5A'}}>4</div>
            <div className="text-sm comfort-text-muted font-body">Pays</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exhibitions;
