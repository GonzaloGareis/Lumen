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

export const CreatePatientModal = () => {
  // State for patient form fields
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [contacto, setContacto] = useState("");
  const [referente, setReferente] = useState("");
  const [comentarios, setComentarios] = useState("");

  const handleRegistrarPaciente = async () => {
    const patientData = {
      name: nombre,
      age: edad ? Number(edad) : null,
      contact: contacto,
      family_reference: referente,
      comments: comentarios,
    };

    const result = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(patientData),
    }).then((res) => res.json());

    if (result) {
      // Clear the fields after successful creation
      setNombre("");
      setEdad("");
      setContacto("");
      setReferente("");
      setComentarios("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#E0F2FE]"
        >
          Registrar Paciente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Paciente</DialogTitle>
          <DialogDescription>
            Ingrese los datos del paciente. El nombre es obligatorio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="edad">Edad</Label>
            <Input
              id="edad"
              placeholder="Edad"
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="contacto">Contacto</Label>
            <Input
              id="contacto"
              placeholder="Contacto"
              type="email"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="referente">Referente Familiar</Label>
            <Input
              id="referente"
              placeholder="Referente Familiar"
              value={referente}
              onChange={(e) => setReferente(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="comentarios">Comentarios</Label>
            <Input
              id="comentarios"
              placeholder="Comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleRegistrarPaciente}>Registrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
