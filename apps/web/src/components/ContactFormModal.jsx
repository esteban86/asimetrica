import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactFormModal = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    telefono: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nombre || !formData.email || !formData.empresa || !formData.telefono) {
      toast.error("Por favor, completa todos los campos requeridos.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: `Nuevo diagnóstico de ${formData.empresa}`,
          ...formData,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      toast.success("¡Solicitud enviada con éxito! Nos pondremos en contacto en menos de 48 horas.");
      setFormData({ nombre: '', email: '', empresa: '', telefono: '' });
      onOpenChange(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting form:", error);
      }
      toast.error("Hubo un error al enviar la solicitud. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl heading-tertiary">Solicitar Diagnóstico Gratis</DialogTitle>
          <DialogDescription className="text-muted-foreground body-text">
            Déjanos tus datos y nos pondremos en contacto en menos de 48 horas para iniciar tu diagnóstico.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-foreground font-medium">Nombre completo</Label>
            <Input 
              id="nombre" 
              name="nombre" 
              placeholder="Ej. Maya Chen" 
              value={formData.nombre}
              onChange={handleChange}
              required 
              disabled={isLoading}
              className="bg-background text-foreground border-input focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Correo electrónico</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="maya@empresa.com" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={isLoading}
              className="bg-background text-foreground border-input focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-foreground font-medium">Empresa</Label>
            <Input 
              id="empresa" 
              name="empresa" 
              placeholder="Nombre de tu empresa" 
              value={formData.empresa}
              onChange={handleChange}
              required 
              disabled={isLoading}
              className="bg-background text-foreground border-input focus-visible:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-foreground font-medium">Teléfono</Label>
            <Input 
              id="telefono" 
              name="telefono" 
              type="tel" 
              placeholder="+57 300 000 0000" 
              value={formData.telefono}
              onChange={handleChange}
              required 
              disabled={isLoading}
              className="bg-background text-foreground border-input focus-visible:ring-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? "Enviando solicitud..." : "Enviar Solicitud"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormModal;