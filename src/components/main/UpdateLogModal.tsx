import React, { useEffect, useState } from "react";
import Icon from "@component/helper/Icon";
import Button from "@component/helper/Button";
import { Request } from "@utils/axios";
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
  const [requestData, setUpdates] = useState<requestFrame>({
    updates: [
      {
        version: "x.x.x",
        notes: ["**???**: Đang lấy data về các bản cập nhật..."],
      },
    ],
  });
  let requestSent = false;

  useEffect(function () {
    const CACHE_KEY = "updateDataCache";
    const TIMESTAMP_KEY = "updateDataTimestamp";
    const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION) {
      setUpdates(JSON.parse(cachedData));
      return;
    }

    if (requestSent) return;
    requestSent = true;
    Request.getJSON<requestFrame>(url)
      .then(function (r) {
        setUpdates(r.data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(r.data));
        localStorage.setItem(TIMESTAMP_KEY, now.toString());
        requestSent = false;
      })
      .catch(function () {
        if (cachedData) {
          setUpdates(JSON.parse(cachedData));
        } else {
          setUpdates({
            updates: [
              {
                version: "x.x.x",
                notes: ["**???**: Không thể lấy data về các bản cập nhật!"],
              },
            ],
          });
        }
      });
  }, []);

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
      {requestData &&
        requestData.updates.map((update, index) => (
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
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <Icon name="xCircle" className="w-7 h-7" />
          </button>
        </div>

        <div className="update_modal_display">
          <UpdateDataDisplay url="https://raw.githubusercontent.com/KrayOristine/ai-sim-game-ozzzzy/main/update_metadata.json" />
        </div>

        <div className="update_modal_close_div">
          <Button onClick={onClose} variant="special" className="update_modal_close_btn">
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateLogModal;
