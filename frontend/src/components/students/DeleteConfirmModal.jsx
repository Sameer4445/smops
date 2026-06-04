/**
 * Delete Confirmation Modal
 */

import { Trash2, AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";

export default function DeleteConfirmModal({ student, onConfirm, onClose, isLoading }) {
  return (
    <Modal isOpen={!!student} onClose={onClose} title="Delete Student" size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>
        <div>
          <p className="text-slate-700 font-medium">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{student?.fullName}</span>?
          </p>
          <p className="text-sm text-slate-500 mt-1">
            This action cannot be undone. All data associated with this student will be permanently removed.
          </p>
        </div>
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(student?.id)}
            disabled={isLoading}
            className="btn-danger flex-1"
          >
            {isLoading ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
