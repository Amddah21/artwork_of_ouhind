import React, { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const NetworkTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const addResult = (result: string) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testNetworkConnection = async () => {
    setIsLoading(true);
    clearResults();
    
    try {
      // Test 1: Vérifier la connectivité de base
      addResult('🔍 Test 1: Connectivité réseau de base...');
      const basicResponse = await fetch('http://localhost:8091/api/artworks');
      addResult(`✅ Backend accessible - Status: ${basicResponse.status}`);
      
      // Test 2: Vérifier l'authentification
      addResult('🔍 Test 2: Test d\'authentification...');
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Aucun token trouvé - Veuillez vous connecter d\'abord');
      }
      addResult(`✅ Token trouvé: ${token.substring(0, 30)}...`);
      
      // Test 3: Test de création avec fetch simple
      addResult('🔍 Test 3: Test de création d\'œuvre...');
      const createResponse = await fetch('http://localhost:8091/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          titre: "Test Network",
          description: "Test de connectivité réseau",
          technique: "Test",
          dimensions: "100x100",
          annee: 2024,
          imageUrl: "/test-network.jpg"
        })
      });
      
      addResult(`✅ Création - Status: ${createResponse.status}`);
      
      if (createResponse.ok) {
        const result = await createResponse.json();
        addResult(`✅ Succès! ID: ${result.id}`);
        toast({
          title: "Succès",
          description: "Test réseau réussi !",
        });
      } else {
        const errorText = await createResponse.text();
        addResult(`❌ Erreur: ${errorText}`);
        throw new Error(`Erreur ${createResponse.status}: ${errorText}`);
      }
      
    } catch (error: any) {
      addResult(`❌ Erreur: ${error.message}`);
      
      // Diagnostic spécifique
      if (error.message.includes('Failed to fetch')) {
        addResult('🔍 Diagnostic: Erreur de connectivité réseau');
        addResult('💡 Solutions possibles:');
        addResult('   - Vérifier que le backend tourne sur le port 8091');
        addResult('   - Vérifier la configuration CORS');
        addResult('   - Vérifier les paramètres de proxy/firewall');
      }
      
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
      <h2 className="text-2xl font-bold mb-4">🌐 Test Connectivité Réseau</h2>
      <p className="text-gray-600 mb-4">
        Ce test vérifie la connectivité entre le frontend et le backend.
      </p>
      
      <div className="mb-4 flex gap-2">
        <Button 
          onClick={testNetworkConnection}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Test en cours...' : 'Tester Connectivité'}
        </Button>
        
        <Button 
          onClick={clearResults}
          variant="outline"
        >
          Effacer
        </Button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-gray-500">Cliquez sur "Tester Connectivité" pour commencer...</div>
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

export default NetworkTest;
