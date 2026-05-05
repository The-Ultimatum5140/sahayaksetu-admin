import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";

const AddPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const sigRef = useRef();

  const [signature, setSignature] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const [medicines, setMedicines] = useState([
    {
      name: "",
      dosage: "",
      frequency: "",
      timing: "After Food",
      duration: "",
    },
  ]);

  // 🔥 FETCH EXISTING
  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const { data } = await API.get(`/api/prescription/${appointmentId}`);

        if (data.success) {
          const p = data.prescription;

          setExistingId(p._id);
          setDiagnosis(p.diagnosis || "");
          setMedicines(
            p.medicines?.length
              ? p.medicines
              : [
                  {
                    name: "",
                    dosage: "",
                    frequency: "",
                    timing: "After Food",
                    duration: "",
                  },
                ],
          );
          setNotes(p.notes || "");
          setIsLocked(p.isLocked || false);
          setSignature(p.signature || "");
        }
      } catch {
        // ignore if not exists
      }
    };

    fetchExisting();
  }, [appointmentId]);

  // ➕ ADD MEDICINE
  const addMedicine = () => {
    if (isLocked) return;
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "",
        timing: "After Food",
        duration: "",
      },
    ]);
  };

  // ❌ REMOVE
  const removeMedicine = (index) => {
    if (isLocked) return;
    if (medicines.length === 1) {
      return toast.error("At least one medicine required");
    }
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // ✏️ CHANGE
  const handleChange = (index, field, value) => {
    if (isLocked) return;
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  // 🚀 SAVE / UPDATE
  const handleSubmit = async () => {
    if (isLocked) return;

    try {
      setLoading(true);

      const formatted = medicines.map((m) => ({
        ...m,
        duration: Number(m.duration),
      }));

      let res;

      if (existingId) {
        // 🔥 UPDATE
        res = await API.put(`/api/prescription/update/${existingId}`, {
          diagnosis,
          medicines: formatted,
          notes,
          signature, // ✅ FIXED
        });
      } else {
        // 🔥 CREATE
        res = await API.post("/api/prescription/add", {
          appointmentId,
          diagnosis,
          medicines: formatted,
          notes,
          signature,
        });
      }

      if (res.data.success) {
        toast.success(existingId ? "Updated" : "Saved");
        navigate("/doctor-appointments");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 LOCK
  const handleLock = async () => {
    try {
      await API.put(`/api/prescription/lock/${existingId}`);
      toast.success("Prescription Locked 🔒");
      setIsLocked(true);
    } catch {
      toast.error("Lock failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {existingId ? "Edit Prescription" : "Add Prescription"}
      </h1>

      {/* 🔒 LOCK MESSAGE */}
      {isLocked && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded">
          🔒 Prescription is locked. Editing disabled.
        </div>
      )}

      {/* Diagnosis */}
      <textarea
        disabled={isLocked}
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
        placeholder="Enter diagnosis..."
        className="w-full border p-3 rounded mb-4"
      />

      {/* Medicines */}
      <h2 className="font-medium mb-2">Medicines</h2>

      {medicines.map((med, i) => (
        <div key={i} className="grid grid-cols-5 gap-2 mb-3">
          <input
            disabled={isLocked}
            value={med.name}
            onChange={(e) => handleChange(i, "name", e.target.value)}
            placeholder="Name"
            className="border p-2 rounded"
          />

          <input
            disabled={isLocked}
            value={med.dosage}
            onChange={(e) => handleChange(i, "dosage", e.target.value)}
            placeholder="Dosage"
            className="border p-2 rounded"
          />

          <input
            disabled={isLocked}
            value={med.frequency}
            onChange={(e) => handleChange(i, "frequency", e.target.value)}
            placeholder="Frequency"
            className="border p-2 rounded"
          />

          <select
            disabled={isLocked}
            value={med.timing}
            onChange={(e) => handleChange(i, "timing", e.target.value)}
            className="border p-2 rounded"
          >
            <option>After Food</option>
            <option>Before Food</option>
            <option>Anytime</option>
          </select>

          <input
            disabled={isLocked}
            type="number"
            value={med.duration}
            onChange={(e) => handleChange(i, "duration", e.target.value)}
            placeholder="Days"
            className="border p-2 rounded"
          />

          {!isLocked && (
            <button
              onClick={() => removeMedicine(i)}
              className="text-red-500 text-xs col-span-5 text-left"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {!isLocked && (
        <button onClick={addMedicine} className="mb-4 text-blue-600">
          + Add Medicine
        </button>
      )}

      {/* Notes */}
      <textarea
        disabled={isLocked}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Additional notes..."
        className="w-full border p-3 rounded mb-4"
      />

      {/* ✍️ SIGNATURE */}
      <div className="mb-4">
        <p className="mb-1 font-medium">Doctor Signature</p>

        <div className="border rounded bg-white">
          <SignatureCanvas
            ref={sigRef}
            penColor="black"
            canvasProps={{
              width: 400,
              height: 150,
              className: "signatureCanvas",
            }}
            disabled={isLocked} // ✅ FIXED
          />
        </div>

        {!isLocked && (
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => sigRef.current.clear()}
              className="text-sm text-red-500"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() =>
                setSignature(sigRef.current.toDataURL("image/png"))
              }
              className="text-sm text-blue-600"
            >
              Save Signature
            </button>
          </div>
        )}
      </div>

      {/* SAVE */}
      {!isLocked && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {existingId ? "Update Prescription" : "Save Prescription"}
        </button>
      )}

      {/* LOCK */}
      {existingId && !isLocked && (
        <button
          onClick={handleLock}
          className="bg-red-500 text-white px-6 py-2 rounded ml-3"
        >
          Final Submit & Lock
        </button>
      )}
    </div>
  );
};

export default AddPrescription;
