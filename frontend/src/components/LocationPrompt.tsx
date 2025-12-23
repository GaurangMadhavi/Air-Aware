import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const LocationPrompt = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const shown = localStorage.getItem('airwatch_location_prompt_shown');
    if (!shown) setOpen(true);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Error', description: 'Geolocation is not supported by your browser' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        localStorage.setItem('airwatch_location', JSON.stringify({ latitude, longitude }));
        localStorage.setItem('airwatch_location_prompt_shown', '1');
        setOpen(false);
        toast({ title: 'Location enabled', description: `Lat ${latitude.toFixed(3)}, Lon ${longitude.toFixed(3)}` });
      },
      (err) => {
        localStorage.setItem('airwatch_location_prompt_shown', '1');
        setOpen(false);
        toast({ title: 'Location denied', description: 'You can enable location from browser settings' });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable location</DialogTitle>
          <DialogDescription>To show nearby sensors and localized weather, please enable location access.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button onClick={requestLocation}>Enable location</Button>
          <Button variant="ghost" onClick={() => { localStorage.setItem('airwatch_location_prompt_shown','1'); setOpen(false); }}>Skip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
