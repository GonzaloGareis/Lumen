"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Paciente {
  id: number;
  nombre: string;
  edad?: number;
  contacto?: string;
  referente?: string;
  comentarios?: string;
}

interface EditPatientModalProps {
  paciente: Paciente;
  onClose: () => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  paciente,
  onClose,
}) => {
  const [nombre, setNombre] = useState(paciente.nombre);
  const [edad, setEdad] = useState(paciente.edad ? String(paciente.edad) : "");
  const [contacto, setContacto] = useState(paciente.contacto || "");
  const [referente, setReferente] = useState(paciente.referente || "");
  const [comentarios, setComentarios] = useState(paciente.comentarios || "");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid gap-1">
            <Label htmlFor="edit-nombre">Nombre *</Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="edit-edad">Edad</Label>
            <Input
              id="edit-edad"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              type="number"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="edit-contacto">Contacto</Label>
            <Input
              id="edit-contacto"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              type="email"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="edit-referente">Referente Familiar</Label>
            <Input
              id="edit-referente"
              value={referente}
              onChange={(e) => setReferente(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="edit-comentarios">Comentarios</Label>
            <Input
              id="edit-comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          {/* Red Eliminar button */}
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Eliminar
          </Button>
          <Button onClick={onClose}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientModal;
