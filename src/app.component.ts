import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from './services/ai.service';

interface Skill {
  name: string;
  level: number;
  category: 'CORE' | 'SUPPORT' | 'INTEL';
}

interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  tech: string[];
  status: 'COMPLETED' | 'CLASSIFIED';
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true, // <--- ¡ESTA LÍNEA FALTABA!
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private aiService = inject(AiService);

  // State
  currentSection = signal<'MISSION' | 'LOADOUT' | 'OPS' | 'INTEL'>('MISSION');
  aiBriefing = signal<string>('');
  isLoadingAi = signal<boolean>(false);
  showMenu = signal<boolean>(false);

  // Data Content
  candidateName = "Recluta Backend";
  candidateRank = "JUNIOR OPERATIVE";
  
  objective = "Asegurar un puesto Junior desarrollando soluciones backend robustas y escalables. Listo para despliegue inmediato.";

  experience = {
    role: "Practicante Desarrollador Junior (Backend Unit)",
    location: "Universidad Adventista de Bolivia - Depto. Desarrollo TI",
    duration: "6 Meses de Servicio Activo",
    details: [
      "Mantenimiento de bases de datos críticas del campus.",
      "Desarrollo de APIs RESTful para sistemas de gestión estudiantil.",
      "Colaboración estrecha con el equipo frontend bajo metodología ágil."
    ]
  };

  skills: Skill[] = [
    { name: "PYTHON", level: 85, category: "CORE" },
    { name: "SQL / PL-SQL", level: 90, category: "CORE" },
    { name: "SCRUM TACTICS", level: 75, category: "SUPPORT" },
    { name: "INGLÉS TÉCNICO", level: 88, category: "INTEL" },
    { name: "AI FOR BUSINESS", level: 60, category: "INTEL" },
    { name: "GIT / VERSION CONTROL", level: 80, category: "SUPPORT" }
  ];

  projects: Project[] = [
    {
      id: "PRJ-01",
      title: "RESTO-NET BACKEND",
      role: "Arquitecto de Datos",
      description: "Sistema de gestión de pedidos para sitio web de restaurante. Implementación de endpoints seguros y optimización de consultas para alta disponibilidad.",
      tech: ["Node.js", "Express", "MongoDB"],
      status: "COMPLETED"
    },
    {
      id: "PRJ-02",
      title: "TIC-TAC-TOE SQL",
      role: "Lógica de Juego",
      description: "Implementación no convencional de lógica de juego completa utilizando únicamente procedimientos almacenados y estructuras SQL.",
      tech: ["PostgreSQL", "PL/SQL", "Logic"],
      status: "COMPLETED"
    },
    {
      id: "PRJ-03",
      title: "PROTO-ROBOTICS",
      role: "Integración de Sistemas",
      description: "Interfaz de control backend para unidad robótica básica. Comunicación serial y procesamiento de comandos en tiempo real.",
      tech: ["Python", "Arduino Bridge", "C++"],
      status: "COMPLETED"
    }
  ];

  contactInfo = {
    email: "dev.junior@example.com",
    github: "github.com/junior-backend",
    linkedin: "linkedin.com/in/junior-backend"
  };

  // Methods
  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  setSection(section: 'MISSION' | 'LOADOUT' | 'OPS' | 'INTEL') {
    this.currentSection.set(section);
    this.showMenu.set(false);
  }

  async requestTacticalAnalysis() {
    if (this.aiBriefing()) return; // Already loaded
    
    this.isLoadingAi.set(true);
    const profileSummary = `
      Nombre: ${this.candidateName}.
      Rol: ${this.candidateRank}.
      Objetivo: ${this.objective}.
      Skills: Python, SQL, Scrum, Ingles Avanzado.
      Experiencia: UAB (6 meses).
      Proyectos: Restaurante, Juego SQL, Robotica.
    `;

    const result = await this.aiService.generateTacticalBrief(profileSummary);
    this.aiBriefing.set(result);
    this.isLoadingAi.set(false);
  }
}