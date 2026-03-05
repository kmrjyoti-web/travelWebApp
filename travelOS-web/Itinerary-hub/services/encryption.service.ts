import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private cryptoKey: CryptoKey | null = null;
  private isInitialized = false;
  private readonly KEY_NAME = 'itinerary-encryption-key';
  private readonly ENABLE_ENCRYPTION = true; // Toggle this to enable/disable encryption

  async initialize(): Promise<void> {
    if (!this.ENABLE_ENCRYPTION) {
        this.isInitialized = true;
        return;
    }

    if (this.isInitialized) {
      return;
    }

    try {
      const storedKey = localStorage.getItem(this.KEY_NAME);
      if (storedKey) {
        const keyData = this.base64ToBuffer(storedKey);
        this.cryptoKey = await this.importKey(keyData);
      } else {
        this.cryptoKey = await this.generateKey();
        const exportedKey = await this.exportKey(this.cryptoKey);
        localStorage.setItem(this.KEY_NAME, this.bufferToBase64(exportedKey));
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Encryption key initialization failed:', error);
      // If key import fails (e.g., corrupt), try generating a new one.
      // Note: This would make old data unreadable.
      this.cryptoKey = await this.generateKey();
      const exportedKey = await this.exportKey(this.cryptoKey);
      localStorage.setItem(this.KEY_NAME, this.bufferToBase64(exportedKey));
      this.isInitialized = true;
    }
  }

  async encrypt(data: string): Promise<{ iv: string; data: string }> {
    if (!this.ENABLE_ENCRYPTION) {
        return { iv: '', data: data };
    }

    if (!this.isInitialized || !this.cryptoKey) {
      throw new Error('Encryption service not initialized.');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.cryptoKey,
      encodedData
    );

    return {
      iv: this.bufferToBase64(iv.buffer),
      data: this.bufferToBase64(encryptedData)
    };
  }

  async decrypt(encrypted: { iv: string; data: string }): Promise<string> {
    if (!this.ENABLE_ENCRYPTION) {
        return encrypted.data;
    }

    // If IV is missing, it was likely stored without encryption
    if (!encrypted.iv) {
      return encrypted.data;
    }

    if (!this.isInitialized || !this.cryptoKey) {
      throw new Error('Encryption service not initialized.');
    }

    try {
      const iv = this.base64ToBuffer(encrypted.iv);
      const data = this.base64ToBuffer(encrypted.data);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.cryptoKey,
        data
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Decryption failed, attempting to return raw data as fallback', error);
      // Fallback: maybe it's actually not encrypted or encrypted with a different key
      // We return raw data and let the caller (IndexedDbService) handle JSON parsing
      return encrypted.data;
    }
  }

  private generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true, // exportable
      ['encrypt', 'decrypt']
    );
  }

  private importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return crypto.subtle.exportKey('raw', key);
  }

  private bufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
