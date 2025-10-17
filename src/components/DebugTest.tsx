import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const DebugTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { toast } = useToast();

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  const testStepByStep = async () => {
    setIsLoading(true);
    clearDebug();
    
    try {
      // Étape 1: Vérifier le token
      addDebugInfo('🔍 Étape 1: Vérification du token...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Aucun token trouvé dans localStorage');
      }
      addDebugInfo(`✅ Token trouvé: ${token.substring(0, 20)}...`);

      // Étape 2: Préparer les données
      addDebugInfo('🔍 Étape 2: Préparation des données...');
      const testData = {
        titre: "Test Debug",
        description: "Description test debug",
        technique: "Acrylique",
        dimensions: "100x80 cm",
        annee: 2024,
        imageUrl: "/test-debug.jpg"
      };
      addDebugInfo(`✅ Données préparées: ${JSON.stringify(testData)}`);

      // Étape 3: Test de connexion au backend
      addDebugInfo('🔍 Étape 3: Test de connexion au backend...');
      const response = await fetch('http://localhost:8091/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      addDebugInfo(`✅ Réponse reçue - Status: ${response.status}`);
      addDebugInfo(`✅ Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      // Étape 4: Traitement de la réponse
      addDebugInfo('🔍 Étape 4: Traitement de la réponse...');
      if (!response.ok) {
        const errorText = await response.text();
        addDebugInfo(`❌ Erreur HTTP ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      addDebugInfo(`✅ Succès! Résultat: ${JSON.stringify(result)}`);
      
      toast({
        title: "Succès",
        description: "Test debug réussi !",
      });
      
    } catch (error: any) {
      addDebugInfo(`❌ Erreur: ${error.message}`);
      console.error('Debug test error:', error);
      
      toast({
        title: "Erreur Debug",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔬 Test Debug Détaillé</h2>
      
      <div className="mb-4 flex gap-2">
        <Button 
          onClick={testStepByStep}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Test en cours...' : 'Lancer Test Debug'}
        </Button>
        
        <Button 
          onClick={clearDebug}
          variant="outline"
          className="border-gray-300"
        >
          Effacer Logs
        </Button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {debugInfo.length === 0 ? (
          <div className="text-gray-500">Cliquez sur "Lancer Test Debug" pour commencer...</div>
        ) : (
          debugInfo.map((info, index) => (
            <div key={index} className="mb-1">{info}</div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebugTest;
