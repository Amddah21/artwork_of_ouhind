import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

const SimpleTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testDirectAPI = async () => {
    setIsLoading(true);
    
    try {
      console.log('🧪 [SimpleTest] Testing direct API call...');
      
      // Test direct avec fetch
      const token = localStorage.getItem('authToken');
      console.log('🧪 [SimpleTest] Token:', token);
      
      const response = await fetch('http://localhost:8091/api/artworks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titre: "Test Direct",
          description: "Description test",
          technique: "Acrylique",
          dimensions: "100x80 cm",
          annee: 2024,
          imageUrl: "/test.jpg"
        })
      });
      
      console.log('🧪 [SimpleTest] Response status:', response.status);
      console.log('🧪 [SimpleTest] Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🧪 [SimpleTest] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('🧪 [SimpleTest] Success result:', result);
      
      toast({
        title: "Succès",
        description: "Test direct réussi !",
      });
      
    } catch (error: any) {
      console.error('🧪 [SimpleTest] Error:', error);
      
      toast({
        title: "Erreur",
        description: `Erreur: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-blue-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Test API Direct</h2>
      <p className="text-blue-600 mb-4">
        Ce test utilise fetch() directement pour tester l'API backend.
      </p>
      
      <Button 
        onClick={testDirectAPI}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? 'Test en cours...' : 'Tester API Directe'}
      </Button>
    </div>
  );
};

export default SimpleTest;
