import { Component, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, ImageGalleryItem } from '../../models/itinerary.model';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';

import { GeminiService } from '../../services/gemini.service';
import { CloudinaryService } from '../../services/cloudinary.service';



@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, CardModule, InputNumberModule, TooltipModule, DialogModule, RadioButtonModule],
  templateUrl: './image-gallery.component.html'
})
export class ImageGalleryComponent {
  trip = input.required<Trip>();
  
  // Selection state: Map of aspect ratio -> boolean
  selectedImages = signal<{ [key: string]: boolean }>({});
  
  // Available items from trip
  galleryItems = signal<ImageGalleryItem[]>([]);

  constructor() {
    effect(() => {
        const t = this.trip();
        if (t && t.imageGallery) {
            this.galleryItems.set(t.imageGallery);
            
            // Initialize selection to true for all available items by default? Or false?
            // Let's set false and let user pick.
            const initialSelection: { [key: string]: boolean } = {};
            t.imageGallery.forEach(item => {
                initialSelection[item.aspectRatio] = false;
            });
            this.selectedImages.set(initialSelection);
        } else {
            this.galleryItems.set([]);
        }
        
        // Sync galleryCount with visible slots (general items)
        // Just once or always? Using untracked to avoid loop?
        // Since this effect runs on trip() change, and we emit tripChange on count change...
        // We must be careful.
        // Let's validly update the signal UI state based on data.
        if (t && t.imageGallery) {
             const generalCount = t.imageGallery.filter(i => 
                  !this.marketingRatios.some(m => m.value === i.aspectRatio)
             ).length;
             // Only update if significantly different? 
             // To prevent cursor jumping if typed? 
             // Actually, if we type '5', local signal becomes 5. 
             // Logic updates trip to 5 items. Trip comes back with 5 items.
             // This sets signal to 5. Stable.
             // If we load a saved trip with 3, signals sets to 3. Correct.
             this.galleryCount.set(generalCount);
             // Suppress if possible, but standard set is fine
        }
        
        if (t && t.headerImage) {
            this.headerImageUrl.set(t.headerImage);
        } else {
             this.headerImageUrl.set(null);
        }
    }, { allowSignalWrites: true });
  }

  galleryCount = signal(4);
  isGenerating = signal(false);
  
  // Available marketing aspect ratios
  marketingRatios = [
    { label: 'Vertical Feature', value: '616x730' },
    { label: 'Standard Landscape', value: '600x400' },
    { label: 'Large Feature', value: '832x785' },
    { label: 'Portrait', value: '482x552' },
    { label: 'Panoramic Banner', value: '1920x251' }
  ];
  
  headerImageUrl = signal<string | null>(null);
  headerUploading = signal(false);

  // Modal State
  showModelDialog = signal(false);
  selectedModel = signal<string>('flux'); // 'flux', 'turbo', 'gemini'
  pendingContext = signal<'cover' | 'gallery'>('gallery');

  aiModels = [
      { name: 'Flux (High Quality Image)', key: 'flux' },
      { name: 'Turbo (Fast Image)', key: 'turbo' },
      { name: 'Gemini (Text Prompts Only)', key: 'gemini' }
  ];

  openModelDialog(context: 'cover' | 'gallery') {
      this.pendingContext.set(context);
      this.showModelDialog.set(true);
  }

  confirmGeneration() {
      this.showModelDialog.set(false);
      const context = this.pendingContext();
      if (context === 'cover') {
          this.generateCover();
      } else {
          this.generateSelected();
      }
  }

  async generateCover() {
      this.headerUploading.set(true);
      try {
          // 1. Generate Prompt
          // We can reuse generateImagePrompts but ask for just one 16:9 item or specific Ratio
          // Or just make a specific call.
          // Let's cheat and use generateImagePrompts with a "Cover Image" request
           const prompts = await this.geminiService.generateImagePrompts(
              this.trip(), 
              0, 
              ['1920x251'] // Using the largest available ratio as proxy for cover
          );
          
          if (prompts.length > 0) {
              const promptObj = prompts[0];
              const prompt = promptObj.prompt;

              if (this.selectedModel() === 'gemini') {
                 // No image gen for cover in "prompt only" mode? 
                 // Just alert user "Copied prompt to clipboard" maybe?
                 alert(`Cover Prompt: ${prompt}`);
              } else {
                 // Generate Image
                 const blob = await this.geminiService.generateImage(prompt);
                 const file = new File([blob], "cover.jpg", { type: "image/jpeg" });
                 
                 // Upload
                 this.cloudinaryService.uploadImage(file).subscribe({
                    next: (url) => {
                        this.headerImageUrl.set(url);
                        const updatedTrip = { ...this.trip(), headerImage: url };
                        this.emitTripUpdate(updatedTrip);
                        this.headerUploading.set(false);
                    },
                    error: (err) => {
                        console.error(err);
                        this.headerUploading.set(false);
                    }
                 });
                 return; // Async return to avoid setting false below immediately
              }
          }
      } catch (e) {
          console.error(e);
          alert('Failed to generate cover.');
      }
      this.headerUploading.set(false);
  }

  triggerHeaderUpload() {
      const fileInput = document.getElementById('header-upload') as HTMLInputElement;
      if (fileInput) fileInput.click();
  }

  onHeaderFileSelected(event: any) {
      const file: File = event.target.files[0];
      if (file) {
          this.headerUploading.set(true);
          this.cloudinaryService.uploadImage(file).subscribe({
              next: (url) => {
                  this.headerImageUrl.set(url);
                  const updatedTrip = { ...this.trip(), headerImage: url };
                  this.emitTripUpdate(updatedTrip);
                  this.headerUploading.set(false);
              },
              error: (err) => {
                  console.error('Header upload failed', err);
                  alert('Upload failed.');
                  this.headerUploading.set(false);
              }
          });
      }
  }

  onCountChange(newCount: number) {
      this.updateGeneralSlots(newCount);
  }

  updateGeneralSlots(count: number) {
      const currentTrip = this.trip();
      const existingGallery = currentTrip.imageGallery || [];
      
      const generalItems = existingGallery.filter(i => 
          !this.marketingRatios.some(m => m.value === i.aspectRatio)
      );
      
      const currentCount = generalItems.length;
      
      if (count > currentCount) {
          const needed = count - currentCount;
          const newSlots: ImageGalleryItem[] = Array(needed).fill(null).map((_, i) => ({
              aspectRatio: '16:9',
              prompt: 'Placeholder', // Mark as placeholder
              altText: `Gallery Slot ${currentCount + i + 1}`
          }));
          
          
          const updatedTrip = { 
              ...currentTrip, 
              imageGallery: [...existingGallery, ...newSlots] 
          };
          this.emitTripUpdate(updatedTrip);
      } else if (count < currentCount) {
           // Provide visual feedback or auto-remove empty ones?
           // For now, let's remove from the end, prioritizing placeholders.
           // Actually, standard array slice for general items.
           const itemsKeep = generalItems.slice(0, count);
           
           const marketingItems = existingGallery.filter(i => 
              this.marketingRatios.some(m => m.value === i.aspectRatio)
           );
           
           const updatedTrip = {
               ...currentTrip,
               imageGallery: [...itemsKeep, ...marketingItems]
           };
           this.emitTripUpdate(updatedTrip);
      }
  }

  /* 
   * We will maintain `selectedImages` for the MARKETING assets checkboxes.
   * "General Gallery" is just a number input.
   */



  private geminiService = inject(GeminiService);
  private cloudinaryService = inject(CloudinaryService);
  // We need to emit changes up to the parent container
  tripChange = output<Trip>();

  uploadingState = signal<{ [key: string]: boolean }>({});

  triggerUpload(index: number) {
    const fileInput = document.getElementById(`file-upload-${index}`) as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    }
  }

  onFileSelected(event: any, index: number) {
      const file: File = event.target.files[0];
      if (file) {
          this.uploadingState.update(current => ({ ...current, [`item-${index}`]: true }));
          
          this.cloudinaryService.uploadImage(file).subscribe({
              next: (imageUrl) => {
                  this.updateItemImage(index, imageUrl);
                  this.uploadingState.update(current => ({ ...current, [`item-${index}`]: false }));
              },
              error: (err) => {
                  console.error('Upload failed', err);
                  alert('Image upload failed. Please checking your cloud configuration.');
                  this.uploadingState.update(current => ({ ...current, [`item-${index}`]: false }));
              }
          });
      }
  }

  updateItemImage(index: number, url: string) {
      const currentTrip = this.trip();
      const updatedTrip = { ...currentTrip };
      if (updatedTrip.imageGallery && updatedTrip.imageGallery[index]) {
          // Clone array
          const newGallery = [...updatedTrip.imageGallery];
          // Update item
          newGallery[index] = { ...newGallery[index], imageUrl: url };
          
          updatedTrip.imageGallery = newGallery;
          this.emitTripUpdate(updatedTrip);
      }
  }

  toggleSelection(aspectRatio: string) {
      this.selectedImages.update(current => {
          const newState = { ...current };
          newState[aspectRatio] = !newState[aspectRatio];
          return newState;
      });
  }

  async generateSelected() {
      const count = this.galleryCount();
      
      // Marketing Ratios Logic
      const selectedRatios = this.marketingRatios
        .filter(r => this.selectedImages()[r.value])
        .map(r => r.value);

      if (count <= 0 && selectedRatios.length === 0) {
          alert('Please enter a valid number of gallery images or select at least one marketing size.');
          return;
      }
      
      this.isGenerating.set(true);
      try {
        const currentTrip = this.trip();
        const existingGallery = currentTrip.imageGallery || [];
        
        // 1. Generate Prompts (Base Step)
        let newItems = await this.geminiService.generateImagePrompts(
            this.trip(), 
            count, 
            selectedRatios
        );
        
        // 2. [NEW] Image Generation Step (if supported model)
        const model = this.selectedModel();
        if (model !== 'gemini') {
            // We need to upgrade these items with actual imageUrls
            // Process sequentially to be safe with upload limits/bandwidth
            for (let i = 0; i < newItems.length; i++) {
                const item = newItems[i];
                try {
                    // Generate Blob
                    const blob = await this.geminiService.generateImage(item.prompt, model);
                    // Create File
                    const file = new File([blob], `gen_${item.aspectRatio}_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    
                    // Upload to Cloudinary (Convert Observable to Promise)
                    const url = await new Promise<string>((resolve, reject) => {
                        this.cloudinaryService.uploadImage(file).subscribe({
                            next: resolve,
                            error: reject
                        });
                    });
                    
                    // Update Item
                    newItems[i] = { ...item, imageUrl: url };
                    
                } catch (e) {
                    console.error(`Failed to generate image for ${item.aspectRatio}:`, e);
                    // Fallback: It remains a text prompt item
                }
            }
        }

        // Merge Logic:
        // 1. Marketing Items: Replace/Update existing ones by aspectRatio.
        // 2. General Items: Fill existing "Placeholder" slots (or '16:9' items that don't have imageUrl)
        
        const newMarketing = newItems.filter(i => i.aspectRatio !== '16:9');
        const newGeneral = newItems.filter(i => i.aspectRatio === '16:9');
        
        let updatedGallery = [...existingGallery];
        
        // 1. Update Marketing
        newMarketing.forEach(newItem => {
            const idx = updatedGallery.findIndex(i => i.aspectRatio === newItem.aspectRatio);
            if (idx > -1) {
                // If we generated a REAL image, we definitely overwrite (or prompt user? assuming overwrite)
                // If it's just a prompt, we safeguard against overwriting an existing image
                // BUT here, if we just spent time generating an image, we probably want to use it.
                // However, safe logic: Overwrite if no URL OR if we Just Generated a URL
                if (!updatedGallery[idx].imageUrl || newItem.imageUrl) {
                     updatedGallery[idx] = { ...updatedGallery[idx], ...newItem };
                }
            } else {
                updatedGallery.push(newItem);
            }
        });
        
        // 2. Update General
        let targetSlotsIndices = updatedGallery
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => 
                !this.marketingRatios.some(m => m.value === item.aspectRatio) && // Is General
                !item.imageUrl // Not Uploaded (or we force overwrite if we have new Image?)
                // Actually, if we generated new IMAGES, we might want to fill placeholders first.
            )
            .map(x => x.index);
            
        newGeneral.forEach((newItem, i) => {
            if (i < targetSlotsIndices.length) {
                // Overwrite existing slot
                const slotIndex = targetSlotsIndices[i];
                updatedGallery[slotIndex] = { 
                    ...updatedGallery[slotIndex],
                    ...newItem // This copies prompt, altText, AND imageUrl if present
                };
            } else {
                updatedGallery.push(newItem);
            }
        });


        const updatedTrip = { ...currentTrip, imageGallery: updatedGallery };
        this.emitTripUpdate(updatedTrip);
        
        const typeMsg = model === 'gemini' ? 'prompts' : 'images';
        alert(`Successfully generated ${typeMsg} for ${newMarketing.length} marketing items and ${newGeneral.length} gallery slots.`);
        
      } catch (err) {
          console.error('Generation failed', err);
          alert('Failed to generate. See console for details.');
      } finally {
          this.isGenerating.set(false);
      }
  }


  private emitTripUpdate(trip: Trip) {
      const images: string[] = [];
      if (trip.headerImage) {
          images.push(trip.headerImage);
      }
      if (trip.imageGallery) {
          trip.imageGallery.forEach(item => {
              if (item.imageUrl) {
                  images.push(item.imageUrl);
              }
          });
      }
      const uniqueImages = Array.from(new Set(images));
      
      const syncedTrip = { ...trip, itineraryImages: uniqueImages };
      this.tripChange.emit(syncedTrip);
  }
}
