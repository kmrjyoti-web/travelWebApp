import { Injectable, inject } from '@angular/core';
import { SavedTrip } from '../models/itinerary.model';
import { EncryptionService } from './encryption.service';
import Dexie, { Table } from 'dexie';

export interface EncryptedTrip {
  id: string;
  encryptedData: { iv: string; data: string; };
}

export class AppDB extends Dexie {
  trips!: Table<EncryptedTrip, string>;

  constructor() {
    super('ItineraryDatabase');
    this.version(1).stores({
      trips: 'id', // Primary key
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private encryptionService = inject(EncryptionService);
  private db: AppDB;

  constructor() {
    this.db = new AppDB();
  }

  async addTrip(trip: SavedTrip): Promise<void> {
    const json = JSON.stringify(trip);
    console.log("datasave");
    console.log(json);
    const encrypted = await this.encryptionService.encrypt(json);
    await this.db.trips.add({ id: trip.id, encryptedData: encrypted });
  }

  async updateTrip(trip: SavedTrip): Promise<void> {
    const json = JSON.stringify(trip);
    const encrypted = await this.encryptionService.encrypt(json);
    await this.db.trips.put({ id: trip.id, encryptedData: encrypted });
  }

  async deleteTrip(tripId: string): Promise<void> {
    await this.db.trips.delete(tripId);
  }

  async getAllTrips(): Promise<SavedTrip[]> {
    const encryptedTrips: EncryptedTrip[] = await this.db.trips.toArray();
    
    if (!encryptedTrips || encryptedTrips.length === 0) {
      return [];
    }

    const decryptedTrips = await Promise.all(
      encryptedTrips.map(async (t) => {
        try {
          const decryptedJson = await this.encryptionService.decrypt(t.encryptedData);
          return JSON.parse(decryptedJson) as SavedTrip;
        } catch (error) {
          console.error(`Failed to decrypt trip ${t.id}. It may be corrupt.`, error);
          // Return null for failed decryptions to filter them out later
          return null;
        }
      })
    );
    
    // Filter out any trips that failed to decrypt
    return decryptedTrips.filter((trip): trip is SavedTrip => trip !== null);
  }
}
