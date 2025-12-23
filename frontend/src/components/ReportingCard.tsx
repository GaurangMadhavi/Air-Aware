import { useState, useRef } from 'react';
import { MessageSquarePlus, Construction, Flame, Car, Factory, MoreHorizontal, Send, CheckCircle, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const reportTypes = [
  { id: 'construction', label: 'Construction', icon: Construction },
  { id: 'burning', label: 'Burning', icon: Flame },
  { id: 'traffic', label: 'Traffic', icon: Car },
  { id: 'industrial', label: 'Industrial', icon: Factory },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
];

export function ReportingCard() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error('Please select a pollution type');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Report submitted successfully!', {
      description: 'Thank you for helping improve air quality awareness.',
    });

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedType(null);
      setDescription('');
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="glass-card p-5 animate-scale-in">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-aqi-safe/20 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-aqi-safe" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Thank you for contributing to cleaner air!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquarePlus className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Report Air-Polluting Activity</h3>
      </div>

      {/* Quick Select Options */}
      <div className="flex flex-wrap gap-2 mb-4">
        {reportTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          ref={fileInputRef}
          className="hidden"
          id="image-upload"
        />
        
        {selectedImage ? (
          <div className="relative">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-full h-32 object-cover rounded-xl"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-6 h-6 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ImagePlus className="w-5 h-5" />
            <span className="text-sm font-medium">Add Photo Evidence</span>
          </label>
        )}
      </div>

      {/* Description */}
      <Textarea
        placeholder="Add optional details about the pollution source..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-secondary/50 border-border/50 resize-none text-sm placeholder:text-muted-foreground/60"
        rows={3}
      />

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedType}
        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Report
          </span>
        )}
      </Button>

      <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
        Your report helps improve community air quality awareness
      </p>
    </div>
  );
}
