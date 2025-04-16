"use client";
import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import EditPatientModal from "@/components/dashboard/modals/edit-patient-modal";

interface PatientCardProps {
  paciente: {
    id: string;
    nombre: string;
    edad?: number;
    contacto?: string;
    referente?: string;
    comentarios?: string;
  };
  onVerTurnos: (nombre: string) => void;
  isActive: boolean;
}

const PatientCard: React.FC<PatientCardProps> = ({
  paciente,
  onVerTurnos,
  isActive,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative bg-white p-6 border rounded-lg shadow-md min-h-30">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{paciente.nombre}</h3>
          {paciente.edad != null && (
            <p className="text-sm">{paciente.edad} años</p>
          )}
          <p className="text-sm">{paciente.contacto}</p>
          <p className="text-sm">{paciente.referente}</p>
          <p className="text-sm text-gray-500">{paciente.comentarios}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-2 mt-1 p-2 rounded-full text-gray-600 hover:text-[#1E3A8A] transition"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => onVerTurnos(paciente.nombre)}
          className={`py-1 px-3 rounded transition ${
            isActive ? "bg-[#1E3A8A] text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {isActive ? "Ver todos los turnos" : "Ver turnos"}
        </button>
      </div>

      {isModalOpen && (
        <EditPatientModal
          paciente={paciente}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientCard;
