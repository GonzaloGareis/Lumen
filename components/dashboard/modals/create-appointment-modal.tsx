"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const CreateAppointmentModal = () => {
  // State for appointment form fields
  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [semanal, setSemanal] = useState(false);

  const handleCrearTurno = async () => {
    const appointmentDate = new Date(`${fecha}T${hora}`);
    const appointmentData = {
      // Replace with actual user id from authentication as needed.
      // user_id: "user-id-here",
      patient_id: paciente, // Ensure this corresponds to a valid patient id
      date: appointmentDate,
      // Add a weekly field if your table supports it, or handle accordingly.
      weekly: semanal,
    };

    const result = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(appointmentData),
    }).then((res) => res.json());

    if (result) {
      // Clear the fields after successful creation
      setPaciente("");
      setFecha("");
      setHora("");
      setSemanal(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#E0F2FE]"
        >
          Crear Turno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Turno</DialogTitle>
          <DialogDescription>Ingrese los detalles del turno.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="paciente">Paciente</Label>
            <select
              id="paciente"
              className="border rounded p-2"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
            >
              <option value="">Seleccione un paciente</option>
              <option value="patient-id-1">Juan Perez</option>
              <option value="patient-id-2">Ana Gómez</option>
              {/* Populate dynamically as needed */}
            </select>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="hora">Hora</Label>
            <Input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="semanal"
              checked={semanal}
              onCheckedChange={setSemanal}
            />
            <Label htmlFor="semanal">Programar semanalmente</Label>
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleCrearTurno}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
