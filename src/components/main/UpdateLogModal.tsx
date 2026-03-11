import React, { Suspense, use } from "react";
import Icon from "#/components/helper/Icon";
import Button from "#/components/helper/Button";
import { Request } from "#/utils/axios";
import "#/assets/update_modal.css";

interface UpdateLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface updateDataDisplayProps {
  url: string;
}

interface updatePatch {
  version: string;
  notes: string[];
}

interface requestFrame {
  updates: updatePatch[];
}

const UpdateDataDisplay: React.FC<updateDataDisplayProps> = ({ url }) => {
  const r = use(Request.getJSON<requestFrame>(url));

  const formatNote = (note: string) => {
    // A simple markdown-like bold formatter
    return note.split("**").map((text, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="text-slate-200">
          {text}
        </strong>
      ) : (
        text
      ),
    );
  };

  return (
    <>
      {r.data.updates.map((update, index) => (
        <div key={index}>
          <h3 className="update_modal_text_version">{update.version}</h3>
          <ul className="update_modal_text_notes">
            {update.notes.map((note, noteIndex) => (
              <li key={noteIndex}>{formatNote(note)}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

const UpdateLogModal: React.FC<UpdateLogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="update_modal_main_div" onClick={onClose}>
      <div
        className="update_modal_second_div"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="update_modal_third_div">
          <h2 className="update_modal_title">
            <Icon name="news" className="w-6 h-6 text-fuchsia-400" />
            Nhật Ký Cập Nhật Game
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <Icon name="xCircle" className="w-7 h-7" />
          </button>
        </div>

        <div className="update_modal_display">
          <Suspense fallback={<Icon name="trash" />}>
            <UpdateDataDisplay url="https://raw.githubusercontent.com/KrayOristine/ai-sim-game-ozzzzy/main/update_metadata.json" />
          </Suspense>
        </div>

        <div className="update_modal_close_div">
          <Button
            onClick={onClose}
            variant="special"
            className="update_modal_close_btn"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateLogModal;
