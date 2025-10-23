import { useState } from "react";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/lib/contactService";
import Logo from "./Logo";
import QRCodeComponent from "./QRCode";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactService.submitContactForm(formData);
      toast({
        title: "Message Envoyé !",
        description: "Merci de m'avoir contactée. Je vous répondrai bientôt.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookContact = () => {
    window.open('https://www.facebook.com/fatyomhind', '_blank');
  };

  return (
    <section id="contact" className="luxury-section luxury-bg-admin">
      <div className="luxury-container">
        <div className="text-center mb-16 luxury-animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--luxury-gold)' }}>
              <Logo size="lg" />
            </div>
          </div>
          <div className="inline-block mb-4 px-6 py-3 rounded-full" style={{ 
            backgroundColor: 'rgba(224, 168, 93, 0.1)', 
            border: '1px solid rgba(224, 168, 93, 0.2)' 
          }}>
            <span className="text-sm font-luxury-body font-medium luxury-text-secondary uppercase tracking-wider">Restons en Contact</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-luxury-display luxury-text-primary mb-4">
            Contactez-Moi
          </h2>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent 0%, var(--luxury-gold) 50%, transparent 100%)' }} />
          <p className="text-lg font-luxury-body luxury-text-secondary max-w-2xl mx-auto leading-relaxed">
            Intéressé par une commission ou souhaitez en savoir plus sur mon travail? Je serais ravie d'échanger avec vous.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <div className="luxury-card-premium p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-luxury-accent luxury-text-primary mb-1">Email</h3>
                  <a
                    href="mailto:omhind53@gmail.com"
                    className="font-luxury-body luxury-text-secondary hover:luxury-text-gold transition-colors"
                  >
                    omhind53@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="luxury-card-premium p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-luxury-accent luxury-text-primary mb-1">Téléphone</h3>
                  <a
                    href="tel:+212666672756"
                    className="font-luxury-body luxury-text-secondary hover:luxury-text-gold transition-colors"
                  >
                    0666672756
                  </a>
                </div>
              </div>
            </div>
            <div className="luxury-card-premium p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg" style={{ backgroundColor: 'var(--luxury-gold)' }}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-luxury-accent luxury-text-primary mb-1">Instagram</h3>
                  <a
                    href="https://instagram.com/fatydouirani"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-luxury-body luxury-text-secondary hover:luxury-text-gold transition-colors"
                  >
                    @fatydouirani
                  </a>
                </div>
              </div>
            </div>

            {/* QR Code Section - Added after contact info */}
            <div className="flex justify-center py-6">
              <QRCodeComponent
                url="https://www.canva.com/design/DAGXYvuFYQk/o8_aNq9QEBN3zv82-k1aLg/view?utm_content=DAGXYvuFYQk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hd762ab158a"
                title="Portfolio Canva"
                description="Scannez pour voir mon portfolio complet"
                size={160}
                className="animate-fade-in"
              />
            </div>

            <div className="luxury-card-premium p-8">
              <h3 className="font-luxury-display text-2xl font-bold luxury-text-primary mb-6">
                Processus de Commissions
              </h3>
              <ol className="space-y-3 font-luxury-body luxury-text-secondary">
                <li className="flex items-start gap-3">
                  <span className="font-luxury-accent luxury-text-gold text-xl">1.</span>
                  <span>Partagez votre vision et vos besoins</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-luxury-accent luxury-text-gold text-xl">2.</span>
                  <span>Recevez un devis personnalisé et un calendrier</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-luxury-accent luxury-text-gold text-xl">3.</span>
                  <span>Examinez les esquisses et donnez votre avis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-luxury-accent luxury-text-gold text-xl">4.</span>
                  <span>Recevez votre œuvre d'art complétée</span>
                </li>
              </ol>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-scale-in">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Nom
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Parlez-moi de votre projet ou de votre demande..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full min-h-[150px]"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="luxury-btn-gradient w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
            </Button>
          </form>
          
          {/* Social Media Contact Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-luxury-accent luxury-text-primary mb-6">
              Ou contactez-moi directement sur les réseaux sociaux
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleFacebookContact}
                className="luxury-btn-gradient"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
