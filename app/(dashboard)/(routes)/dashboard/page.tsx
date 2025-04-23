"use client";

import React, { useState, useEffect } from "react";
import PatientCard from "@/components/dashboard/patient-card";
import AppointmentCard from "@/components/dashboard/appointment-card";
import { CreateAppointmentModal } from "@/components/dashboard/modals/create-appointment-modal";
import { CreatePatientModal } from "@/components/dashboard/modals/create-patient-modal";
import { Input } from "@/components/ui/input";
import { AppointmentWithPatient } from "@/lib/appointmentService";

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>(
    []
  );
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

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

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments", { credentials: "include" });
      if (!res.ok) {
        console.error("Error fetching appointments", res);
        return;
      }
      const data: AppointmentWithPatient[] = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  useEffect(() => {
    // Initial fetch of patients and appointments.
    fetchPatients();
    fetchAppointments();

    const handlePatientsUpdated = () => {
      fetchPatients();
    };

    window.addEventListener("patientsUpdated", handlePatientsUpdated);
    return () => {
      window.removeEventListener("patientsUpdated", handlePatientsUpdated);
    };
  }, []);

  // Filter patients by name (search bar input)
  const filteredPatients = patients.filter((paciente) =>
    paciente.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle filtering appointments for a specific patient
  const onVerTurnos = (nombre: string) => {
    if (selectedPatient === nombre) {
      setSelectedPatient("");
      setFilteredAppointments(appointments);
    } else {
      setSelectedPatient(nombre);
      const patientAppointments = appointments.filter(
        (appointment) => appointment.patient_name === nombre
      );
      setFilteredAppointments(
        patientAppointments.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    }
  };

  const displayedAppointments =
    selectedPatient !== ""
      ? filteredAppointments
      : [...appointments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F4FF] to-white p-14">
      <div className="flex flex-col md:flex-row gap-8">
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
            {filteredPatients.length > 0 ? (
              filteredPatients.map((paciente) => (
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

        <section className="flex-1">
          <div className="flex items-center justify-between mb-19">
            <h2 className="text-2xl font-semibold text-[#1E3A8A]">Turnos</h2>
            <CreateAppointmentModal patients={patients} />
          </div>

          <div className="space-y-4">
            {displayedAppointments.length > 0 ? (
              displayedAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointmentData={appointment}
                />
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
