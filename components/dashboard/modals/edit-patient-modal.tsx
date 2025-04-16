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
import { useRouter } from "next/navigation";

export interface Paciente {
  id: string;
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
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const body = {
        name: nombre,
        age: edad ? Number(edad) : null,
        contact: contacto,
        family_reference: referente,
        comments: comentarios,
      };

      const res = await fetch(`/api/patients/${paciente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error updating patient:", errorData.error);
      } else {
        window.dispatchEvent(new CustomEvent("patientsUpdated"));
        onClose();
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${paciente.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting patient:", errorData.error);
      } else {
        window.dispatchEvent(new CustomEvent("patientsUpdated"));
        onClose();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
    setLoading(false);
  };

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
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            Eliminar
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientModal;
