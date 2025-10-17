import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const BackendTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const addResult = (result: string) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBackendConnection = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      // Test 1: Vérifier si le backend répond
      addResult('🔍 Test 1: Connexion au backend...');
      const healthResponse = await fetch('http://localhost:8091/api/artworks');
      addResult(`✅ Backend accessible - Status: ${healthResponse.status}`);
      
      // Test 2: Vérifier l'authentification
      addResult('🔍 Test 2: Authentification...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Aucun token trouvé');
      }
      addResult(`✅ Token trouvé: ${token.substring(0, 30)}...`);
      
      // Test 3: Test de création simple
      addResult('🔍 Test 3: Création d\'œuvre...');
      const createResponse = await fetch('http://localhost:8091/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titre: "Test Backend",
          description: "Test description",
          technique: "Test",
          dimensions: "100x100",
          annee: 2024,
          imageUrl: "/test.jpg"
        })
      });
      
      addResult(`✅ Création - Status: ${createResponse.status}`);
      
      if (createResponse.ok) {
        const result = await createResponse.json();
        addResult(`✅ Succès! ID: ${result.id}`);
        toast({
          title: "Succès",
          description: "Backend fonctionne parfaitement !",
        });
      } else {
        const errorText = await createResponse.text();
        addResult(`❌ Erreur: ${errorText}`);
        throw new Error(`Erreur ${createResponse.status}: ${errorText}`);
      }
      
    } catch (error: any) {
      addResult(`❌ Erreur: ${error.message}`);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔧 Test Backend Simple</h2>
      
      <div className="mb-4 flex gap-2">
        <Button 
          onClick={testBackendConnection}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Test en cours...' : 'Tester Backend'}
        </Button>
        
        <Button 
          onClick={clearResults}
          variant="outline"
        >
          Effacer
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        {results.length === 0 ? (
          <div className="text-gray-500">Cliquez sur "Tester Backend" pour commencer...</div>
        ) : (
          <div className="space-y-1">
            {results.map((result, index) => (
              <div key={index} className="text-sm font-mono">{result}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendTest;
