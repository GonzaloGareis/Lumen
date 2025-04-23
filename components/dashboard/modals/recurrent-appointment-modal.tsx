"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface RecurrenceSettings {
  interval: number;
  frequency: "week" | "month";
  weekdays: number[];
  endOption: "never" | "onDate" | "afterCount";
  endDate?: string;
  occurrenceCount?: number;
}

interface RecurrenceModalProps {
  initialDate: Date;
  open: boolean;
  settings: RecurrenceSettings;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: RecurrenceSettings) => void;
}

const WEEKDAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

export const RecurrenceModal: React.FC<RecurrenceModalProps> = ({
  initialDate,
  open,
  settings,
  onOpenChange,
  onSave,
}) => {
  // local copy of settings
  const [interval, setInterval] = useState(settings.interval);
  const [frequency, setFrequency] = useState(settings.frequency);
  const [weekdays, setWeekdays] = useState<number[]>([...settings.weekdays]);
  const [endOption, setEndOption] = useState(settings.endOption);
  const [endDate, setEndDate] = useState(settings.endDate || "");
  const [occurrenceCount, setOccurrenceCount] = useState(
    settings.occurrenceCount ?? 2
  );

  // whenever modal opens, copy in the parent's saved settings
  useEffect(() => {
    if (open) {
      setInterval(settings.interval);
      setFrequency(settings.frequency);
      setEndOption(settings.endOption);
      setEndDate(settings.endDate || "");
      setOccurrenceCount(settings.occurrenceCount ?? 2);

      // if parent has no weekdays yet, default to initialDate day
      if (settings.weekdays.length > 0) {
        setWeekdays([...settings.weekdays]);
      } else {
        setWeekdays([initialDate.getDay()]);
      }
    }
  }, [open, settings, initialDate]);

  // prevent deselecting all when weekly
  const handleWeekdaysChange = (vals: string[]) => {
    const days = vals.map((v) => parseInt(v, 10));
    if (frequency === "week" && days.length === 0) return;
    setWeekdays(days);
  };

  const handleSave = () => {
    onSave({
      interval,
      frequency,
      weekdays,
      endOption,
      endDate: endOption === "onDate" ? endDate : undefined,
      occurrenceCount: endOption === "afterCount" ? occurrenceCount : undefined,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
    // local state will be overwritten next time open=true
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Frecuencia personalizada</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Interval & frequency */}
          <div className="flex items-center space-x-2">
            <span>Repetir cada</span>
            <Input
              type="number"
              min={1}
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value, 10) || 1)}
              className="w-16"
            />
            <select
              value={frequency}
              onChange={(e) => {
                const f = e.target.value as "week" | "month";
                setFrequency(f);
                if (f === "month") setWeekdays([]);
                else if (weekdays.length === 0)
                  setWeekdays([initialDate.getDay()]);
              }}
              className="border rounded p-2"
            >
              <option value="week">semana(s)</option>
              <option value="month">mes(es)</option>
            </select>
          </div>

          {frequency === "week" && (
            <div className="space-y-1">
              <Label>Repetir los</Label>
              <ToggleGroup
                type="multiple"
                value={weekdays.map(String)}
                onValueChange={handleWeekdaysChange}
                className="flex space-x-1"
              >
                {WEEKDAYS.map((d) => (
                  <ToggleGroupItem
                    key={d.value}
                    value={String(d.value)}
                    className="px-3 py-1 border rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                  >
                    {d.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label>Finaliza</Label>
            <RadioGroup
              value={endOption}
              onValueChange={(v) =>
                setEndOption(v as "never" | "onDate" | "afterCount")
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="never" value="never" />
                <Label htmlFor="never">Nunca</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="onDate" value="onDate" />
                <Label htmlFor="onDate">El</Label>
                <Input
                  type="date"
                  disabled={endOption !== "onDate"}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="ml-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="afterCount" value="afterCount" />
                <Label htmlFor="afterCount">Después de</Label>
                <Input
                  type="number"
                  disabled={endOption !== "afterCount"}
                  min={2}
                  value={occurrenceCount}
                  onChange={(e) =>
                    setOccurrenceCount(parseInt(e.target.value, 10) || 2)
                  }
                  className="w-20"
                />
                <span>turnos</span>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
