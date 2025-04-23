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
import { AppointmentWithPatient } from "@/lib/appointmentService";

interface AppointmentCardProps {
  appointmentData: AppointmentWithPatient;
}

const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function formatDate(date: Date): string {
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayOfWeek} ${day}/${month}/${year}`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointmentData,
}) => {
  const [notes, setNotes] = useState(appointmentData.notes ?? "");
  const dateObj = new Date(appointmentData.date);
  const formattedDate = formatDate(dateObj);
  const formattedTime = formatTime(dateObj);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{appointmentData.patient_name}</CardTitle>
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
                {appointmentData.patient_name} – {formattedDate}
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
          <strong>Fecha:</strong> {formattedDate}
        </p>
        <p>
          <strong>Hora:</strong> {formattedTime}
        </p>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
