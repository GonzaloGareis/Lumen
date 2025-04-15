"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface Turno {
  id: number;
  paciente: string;
  fecha: string;
  hora: string;
  notas?: string;
}

interface AppointmentCardProps {
  turno: Turno;
}

// Helper function to format date as 'Dia de la semana DD/MM/YYYY'
const formatDate = (dateString: string): string => {
  const daysOfWeek = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const date = new Date(dateString);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${dayOfWeek} ${day}/${month}/${year}`;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ turno }) => {
  const [notes, setNotes] = useState(turno.notas || "");

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{turno.paciente}</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="text-xs px-2 py-1 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#E0F2FE] transition"
            >
              Notas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {turno.paciente} - {formatDate(turno.fecha)}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <textarea
                className="w-full border rounded p-2 min-h-[150px]"
                placeholder="Escriba sus notas aquí..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end">
              <Button>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Fecha:</strong> {formatDate(turno.fecha)}
        </p>
        <p>
          <strong>Hora:</strong> {turno.hora}
        </p>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
