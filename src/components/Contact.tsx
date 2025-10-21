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
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Logo size="lg" className="text-foreground/60" />
          </div>
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Restons en Contact</span>
          </div>
          <h2 className="heading-lg mb-4">
            Contactez-Moi
          </h2>
          <div className="section-divider"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Intéressé par une commission ou souhaitez en savoir plus sur mon travail? Je serais ravie d'échanger avec vous.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
              <div className="icon-badge">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <a
                  href="mailto:omhind53@gmail.com"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  omhind53@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
              <div className="icon-badge">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                <a
                  href="tel:+212666672756"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  0666672756
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/50 transition-all duration-300">
              <div className="icon-badge">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
                <a
                  href="https://instagram.com/fatydouirani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  @fatydouirani
                </a>
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

            <div className="bg-gradient-subtle p-8 rounded-xl shadow-elegant border border-border/30">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Processus de Commissions
              </h3>
              <ol className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-accent">1.</span>
                  Partagez votre vision et vos besoins
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-accent">2.</span>
                  Recevez un devis personnalisé et un calendrier
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-accent">3.</span>
                  Examinez les esquisses et donnez votre avis
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-accent">4.</span>
                  Recevez votre œuvre d'art complétée
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
              className="btn-primary w-full"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le Message"}
            </Button>
          </form>
          
          {/* Social Media Contact Section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Ou contactez-moi directement sur les réseaux sociaux
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleFacebookContact}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
