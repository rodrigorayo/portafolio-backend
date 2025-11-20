import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

declare var process: any;

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // Defensive check to prevent app crash if process is undefined in browser
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      console.warn('API_KEY not found in environment. AI features will be disabled.');
    }
  }

  async generateTacticalBrief(profileData: string): Promise<string> {
    if (!this.ai) {
      return 'SYSTEM OFFLINE. MISSING API CREDENTIALS.';
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Actúa como un oficial militar de alto rango en un entorno futurista (estilo Call of Duty). Analiza el siguiente perfil de desarrollador y genera un "Informe de Evaluación Táctica" breve (máximo 80 palabras) en Español. El tono debe ser autoritario, técnico y motivador, confirmando la idoneidad del recluta para misiones de backend.
        
        PERFIL: ${profileData}`,
        config: {
          temperature: 0.7,
          // maxOutputTokens removed to avoid conflicts with thinking budget in gemini-2.5-flash
        }
      });
      return response.text;
    } catch (error) {
      console.error('Error generating brief:', error);
      return 'ERROR DE COMUNICACIÓN CON EL MANDO CENTRAL. REINTENTE LA TRANSMISIÓN.';
    }
  }
}