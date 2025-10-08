import { useState } from 'react';
import { ArrowLeft, MessageCircle, Truck, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { formatPrice } = useCurrency();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc',
    paymentMethod: 'contact'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare order details
    const orderDetails = {
      customer: formData,
      items: state.items,
      total: state.total,
      timestamp: new Date().toLocaleString('fr-FR')
    };
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(orderDetails);
    const gmailMessage = createGmailMessage(orderDetails);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/212658742744?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Create HTML version of Gmail message for better formatting
    const gmailHtmlMessage = createGmailHtmlMessage(orderDetails);
    
    // Open Gmail with pre-filled email
    const gmailUrl = `mailto:mohamed21amddah@gmail.com?subject=${encodeURIComponent('Nouvelle commande - ' + orderDetails.items.map(item => item.title).join(', '))}&body=${encodeURIComponent(gmailMessage)}`;
    window.open(gmailUrl, '_blank');
    
    // Show confirmation
    alert('Demande de commande envoyée ! Les détails ont été transmis à l\'artiste via WhatsApp et Gmail. L\'artiste vous contactera dans les plus brefs délais.');
    dispatch({ type: 'CLEAR_CART' });
  };

  // Convert local image paths to public URLs
  const getPublicImageUrl = (imagePath: string) => {
    // Convert /src/assets/artwork-X.jpg to /artwork-X.jpg (public folder)
    if (imagePath.startsWith('/src/assets/')) {
      return imagePath.replace('/src/assets/', '/');
    }
    return imagePath;
  };

  const createWhatsAppMessage = (orderDetails: any) => {
    const { customer, items, total, timestamp } = orderDetails;
    
    let message = `🎨 *NOUVELLE COMMANDE* 🎨\n\n`;
    message += `📅 *Date:* ${timestamp}\n\n`;
    
    message += `👤 *INFORMATIONS CLIENT:*\n`;
    message += `• Nom: ${customer.firstName} ${customer.lastName}\n`;
    message += `• Email: ${customer.email}\n`;
    message += `• Téléphone: ${customer.phone}\n`;
    message += `• Adresse: ${customer.address}\n`;
    message += `• Ville: ${customer.city}\n`;
    message += `• Code postal: ${customer.postalCode}\n`;
    message += `• Pays: ${customer.country}\n\n`;
    
    message += `🛒 *ARTICLES COMMANDÉS:*\n`;
    items.forEach((item: any, index: number) => {
      const publicImageUrl = getPublicImageUrl(item.image);
      const fullImageUrl = `${window.location.origin}${publicImageUrl}`;
      
      message += `${index + 1}. *${item.title}*\n`;
      message += `   • Taille: ${item.size}\n`;
      message += `   • Quantité: ${item.quantity}\n`;
      message += `   • Prix: ${formatPrice(item.price * item.quantity)}\n`;
      message += `   • Image: ${fullImageUrl}\n\n`;
    });
    
    message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;
    message += `📞 *ACTION REQUISE:*\n`;
    message += `Contacter le client pour finaliser la commande et organiser le paiement.\n\n`;
    message += `🖼️ *IMAGES DES ŒUVRES:*\n`;
    message += `Cliquez sur les liens d'images ci-dessus pour voir les œuvres commandées.`;
    
    return message;
  };

  const createGmailMessage = (orderDetails: any) => {
    const { customer, items, total, timestamp } = orderDetails;
    
    let message = `NOUVELLE COMMANDE - ${timestamp}\n\n`;
    
    message += `INFORMATIONS CLIENT:\n`;
    message += `Nom: ${customer.firstName} ${customer.lastName}\n`;
    message += `Email: ${customer.email}\n`;
    message += `Téléphone: ${customer.phone}\n`;
    message += `Adresse: ${customer.address}\n`;
    message += `Ville: ${customer.city}\n`;
    message += `Code postal: ${customer.postalCode}\n`;
    message += `Pays: ${customer.country}\n\n`;
    
    message += `ARTICLES COMMANDÉS:\n`;
    items.forEach((item: any, index: number) => {
      const publicImageUrl = getPublicImageUrl(item.image);
      const fullImageUrl = `${window.location.origin}${publicImageUrl}`;
      
      message += `${index + 1}. ${item.title}\n`;
      message += `   Taille: ${item.size}\n`;
      message += `   Quantité: ${item.quantity}\n`;
      message += `   Prix: ${formatPrice(item.price * item.quantity)}\n`;
      message += `   Image: ${fullImageUrl}\n\n`;
    });
    
    message += `TOTAL: ${formatPrice(total)}\n\n`;
    message += `IMAGES DES ŒUVRES (cliquez pour voir):\n`;
    items.forEach((item: any, index: number) => {
      const publicImageUrl = getPublicImageUrl(item.image);
      const fullImageUrl = `${window.location.origin}${publicImageUrl}`;
      
      message += `${index + 1}. ${item.title}:\n`;
      message += `   ${fullImageUrl}\n\n`;
    });
    
    message += `ACTION REQUISE:\n`;
    message += `Contacter le client pour finaliser la commande et organiser le paiement.\n\n`;
    message += `Cordialement,\n`;
    message += `Système de commande automatique`;
    
    return message;
  };

  const createGmailHtmlMessage = (orderDetails: any) => {
    const { customer, items, total, timestamp } = orderDetails;
    
    let htmlMessage = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c5530;">🎨 NOUVELLE COMMANDE 🎨</h2>
          <p><strong>Date:</strong> ${timestamp}</p>
          
          <h3 style="color: #2c5530;">👤 INFORMATIONS CLIENT:</h3>
          <ul>
            <li><strong>Nom:</strong> ${customer.firstName} ${customer.lastName}</li>
            <li><strong>Email:</strong> ${customer.email}</li>
            <li><strong>Téléphone:</strong> ${customer.phone}</li>
            <li><strong>Adresse:</strong> ${customer.address}</li>
            <li><strong>Ville:</strong> ${customer.city}</li>
            <li><strong>Code postal:</strong> ${customer.postalCode}</li>
            <li><strong>Pays:</strong> ${customer.country}</li>
          </ul>
          
          <h3 style="color: #2c5530;">🛒 ARTICLES COMMANDÉS:</h3>
    `;
    
    items.forEach((item: any, index: number) => {
      const publicImageUrl = getPublicImageUrl(item.image);
      const fullImageUrl = `${window.location.origin}${publicImageUrl}`;
      
      htmlMessage += `
        <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px;">
          <h4 style="color: #2c5530; margin-top: 0;">${index + 1}. ${item.title}</h4>
          <p><strong>Taille:</strong> ${item.size}</p>
          <p><strong>Quantité:</strong> ${item.quantity}</p>
          <p><strong>Prix:</strong> ${formatPrice(item.price * item.quantity)}</p>
          <p><strong>Image:</strong></p>
          <img src="${fullImageUrl}" alt="${item.title}" style="max-width: 300px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <p style="font-size: 12px; color: #666; margin-top: 5px;">
            <a href="${fullImageUrl}" target="_blank">Voir l'image en grand</a>
          </p>
        </div>
      `;
    });
    
    htmlMessage += `
          <h3 style="color: #2c5530;">💰 TOTAL: ${formatPrice(total)}</h3>
          
          <h3 style="color: #2c5530;">📞 ACTION REQUISE:</h3>
          <p>Contacter le client pour finaliser la commande et organiser le paiement.</p>
          
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Cordialement,<br>
            Système de commande automatique
          </p>
        </body>
      </html>
    `;
    
    return htmlMessage;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Finaliser la commande</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <h2 className="text-xl font-semibold mb-4">Résumé de la commande</h2>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.size}</p>
                      <p className="text-sm">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Livraison</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Livraison gratuite au Maroc
              </p>
              <p className="text-sm text-muted-foreground">
                Délai de livraison: 5-7 jours ouvrés
              </p>
            </div>

            {/* Security Info */}
            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Sécurité et Confidentialité</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  • Vos données personnelles sont protégées
                </p>
                <p className="text-sm text-muted-foreground">
                  • Paiement sécurisé en espèces ou virement
                </p>
                <p className="text-sm text-muted-foreground">
                  • Communication directe avec l'artiste
                </p>
                <p className="text-sm text-muted-foreground">
                  • Aucune donnée bancaire stockée
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ville</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Code postal</label>
                  <Input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pays</label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-accent" />
                <h3 className="text-lg font-semibold">Paiement et Contact</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Mode de paiement :</strong> Espèces ou virement bancaire
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Processus :</strong> L'artiste vous contactera directement pour :
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• Confirmer la disponibilité de l'œuvre</li>
                  <li>• Organiser le paiement (espèces ou virement)</li>
                  <li>• Planifier la livraison ou le retrait</li>
                  <li>• Répondre à toutes vos questions</li>
                </ul>
                
                <div className="bg-accent/10 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Envoi Automatique</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    ✅ Vos informations seront automatiquement envoyées à l'artiste via WhatsApp et Gmail
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Contact Direct</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Téléphone : <a href="tel:+212658742744" className="text-accent hover:underline">+212 658 742744</a>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-4 h-4 text-accent" />
                    <span className="font-medium text-sm">Email</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <a href="mailto:mohamed21amddah@gmail.com" className="text-accent hover:underline">mohamed21amddah@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg"
            >
              📤 Envoyer à l'artiste (WhatsApp + Gmail)
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
