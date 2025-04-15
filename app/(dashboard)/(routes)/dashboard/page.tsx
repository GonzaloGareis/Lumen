"use client";

import React, { useState, useEffect } from "react";
import PatientCard from "@/components/patient-card";
import AppointmentCard from "@/components/appointment-card";
import {
  CreatePatientModal,
  CreateAppointmentModal,
} from "@/components/dashboard/modals";
import { Input } from "@/components/ui/input";

// Hardcoded appointments remain for now
const turnos = [
  {
    id: 1,
    paciente: "Juan Perez",
    fecha: "2025-04-15",
    hora: "10:00",
  },
  {
    id: 2,
    paciente: "Ana Gómez",
    fecha: "2025-04-14",
    hora: "11:30",
  },
  {
    id: 3,
    paciente: "Juan Perez",
    fecha: "2025-04-12",
    hora: "08:00",
  },
  {
    id: 4,
    paciente: "Ana Gómez",
    fecha: "2025-04-10",
    hora: "09:00",
  },
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [filteredTurnos, setFilteredTurnos] = useState(turnos);
  const [patients, setPatients] = useState<any[]>([]);

  // Fetch patients from the database (via your GET API route)
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients", { credentials: "include" });
        if (!res.ok) {
          console.error("Error fetching patients", res);
          return;
        }
        const data = await res.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients", error);
      }
    };
    fetchPatients();
  }, []);

  // Filter patients by name based on search
  const filteredPacientes = patients.filter((paciente) =>
    paciente.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle filtering appointments for a specific patient
  const onVerTurnos = (nombre: string) => {
    if (selectedPatient === nombre) {
      setSelectedPatient("");
      setFilteredTurnos(turnos);
    } else {
      setSelectedPatient(nombre);
      const patientAppointments = turnos.filter(
        (turno) => turno.paciente === nombre
      );
      setFilteredTurnos(
        patientAppointments.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
      );
    }
  };

  const displayedTurnos =
    selectedPatient !== ""
      ? filteredTurnos
      : [...turnos].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-14">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Pacientes Section */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-[#1E3A8A]">Pacientes</h2>
            <CreatePatientModal />
          </div>
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 border border-gray-300 shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
          />

          <div className="space-y-4">
            {filteredPacientes.length > 0 ? (
              filteredPacientes.map((paciente) => (
                <PatientCard
                  key={paciente.id}
                  paciente={{
                    id: paciente.id,
                    nombre: paciente.name,
                    edad: paciente.age,
                    contacto: paciente.contact,
                    referente: paciente.family_reference,
                    comentarios: paciente.comments,
                  }}
                  onVerTurnos={onVerTurnos}
                  isActive={selectedPatient === paciente.name}
                />
              ))
            ) : (
              <p className="text-gray-500">No se encontraron pacientes.</p>
            )}
          </div>
        </section>

        {/* Turnos Section */}
        <section className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-[#1E3A8A]">Turnos</h2>
            <CreateAppointmentModal />
          </div>

          <div className="space-y-4">
            {displayedTurnos.length > 0 ? (
              displayedTurnos.map((turno) => (
                <AppointmentCard key={turno.id} turno={turno} />
              ))
            ) : (
              <p className="text-gray-500">No se encontraron turnos.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
