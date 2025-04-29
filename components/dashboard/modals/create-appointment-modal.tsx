"use client";

import React, { useEffect, useState } from "react";
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

import {
  RecurrenceModal,
  RecurrenceSettings,
} from "./recurrent-appointment-modal";

export interface Patient {
  id: string;
  name: string;
}

interface CreateAppointmentModalProps {
  patients: Patient[];
}

export const CreateAppointmentModal: React.FC<CreateAppointmentModalProps> = ({
  patients,
}) => {
  const [patientId, setPatientId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [useRecurrence, setUseRecurrence] = useState(false);

  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  const [recurrenceSettings, setRecurrenceSettings] =
    useState<RecurrenceSettings>({
      interval: 1,
      frequency: "week",
      weekdays: [],
      endOption: "never",
    });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setPatientId("");
      setFecha("");
      setHora("");
      setUseRecurrence(false);
      setRecurrenceSettings({
        interval: 1,
        frequency: "week",
        weekdays: [],
        endOption: "never",
      });
    }
  }, [open]);

  const recurrenceSummary = () => {
    const frequencyMap: Record<string, string> = {
      week: "semana",
      day: "día",
      month: "mes",
    };

    if (!useRecurrence) return "No repetir";

    const {
      interval,
      frequency,
      weekdays,
      endOption,
      endDate,
      occurrenceCount,
    } = recurrenceSettings;
    const translated = frequencyMap[frequency] || frequency;
    const plural = interval > 1 ? (translated === "mes" ? "es" : "s") : "";
    let text = `${interval} ${translated}${plural}`;

    if (frequency === "week") {
      const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      text += ` ${weekdays.map((d) => dayLabels[d]).join(", ")}`;
    }
    if (endOption === "onDate" && endDate) {
      text += ` hasta el ${endDate}`;
    } else if (endOption === "afterCount" && occurrenceCount) {
      text += `, ${occurrenceCount} turnos`;
    }
    return text;
  };

  const handleCrearTurno = async () => {
    if (!patientId || !fecha || !hora) {
      alert("Complete todos los campos requeridos.");
      return;
    }
    setLoading(true);
    try {
      const appointmentDate = new Date(`${fecha}T${hora}`);
      const body: any = {
        patient_id: patientId,
        date: appointmentDate.toISOString(),
      };

      // if recurrence is enabled, send series settings
      if (useRecurrence) {
        body.recurrence = recurrenceSettings;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error creando turno:", err.error);
        alert("No se pudo crear el turno.");
      } else {
        window.dispatchEvent(new CustomEvent("appointmentsUpdated"));
        // reset form
        setPatientId("");
        setFecha("");
        setHora("");
        setUseRecurrence(false);
        setRecurrenceSettings({
          interval: 1,
          frequency: "week",
          weekdays: [],
          endOption: "never",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Seleccione un paciente</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & time */}
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

          {fecha != "" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="repetir"
                checked={useRecurrence}
                onCheckedChange={setUseRecurrence}
              />
              <Label htmlFor="repetir">Repetir</Label>

              {useRecurrence && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRecurrenceOpen(true)}
                    className="ml-4"
                  >
                    Repetir cada…
                  </Button>
                  <span className="italic text-sm text-gray-600">
                    {recurrenceSummary()}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button onClick={handleCrearTurno} disabled={loading}>
              {loading ? "Creando…" : "Crear"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      <RecurrenceModal
        initialDate={new Date(fecha)}
        open={recurrenceOpen}
        onOpenChange={setRecurrenceOpen}
        settings={recurrenceSettings}
        onSave={(settings) => setRecurrenceSettings(settings)}
      />
    </Dialog>
  );
};
