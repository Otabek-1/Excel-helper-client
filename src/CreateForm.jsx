import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const [docName, setDocName] = useState("");
  const [sheets, setSheets] = useState([]);
  const navigate = useNavigate();

  const addSheet = () => {
    setSheets([
      ...sheets,
      {
        name: "",
        columns: [{ name: "", type: "text" }]
      }
    ]);
  };

  const removeSheet = (i) => {
    setSheets(sheets.filter((_, idx) => idx !== i));
  };

  const updateSheetName = (i, value) => {
    const copy = [...sheets];
    copy[i].name = value;
    setSheets(copy);
  };

  const addColumn = (sheetIndex) => {
    const copy = [...sheets];
    copy[sheetIndex].columns.push({ name: "", type: "text" });
    setSheets(copy);
  };

  const updateColumn = (sheetIndex, colIndex, key, value) => {
    const copy = [...sheets];
    copy[sheetIndex].columns[colIndex][key] = value;
    setSheets(copy);
  };

  const removeColumn = (sheetIndex, colIndex) => {
    const copy = [...sheets];
    copy[sheetIndex].columns.splice(colIndex, 1);
    setSheets(copy);
  };

  const submit = (e) => {
    e.preventDefault();

    const schema = {
      document_name: docName,
      sheets: sheets.map(s => ({
        name: s.name,
        columns: s.columns.filter(c => c.name.trim() !== "")
      }))
    };

    api.post("/create", schema)
      .then(res => {
        if (res.status === 200) {
          alert("Документ успешно создан");
          navigate("/");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Ошибка при создании документа");
      });
  };

  return (
    <div className="h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-4xl overflow-y-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Создать новый Excel документ
          </h2>

          <form onSubmit={submit} className="flex flex-col gap-6">
            {/* Document name */}
            <input
              type="text"
              placeholder="Название документа"
              className="px-4 py-3 border rounded-xl"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
            />

            {/* Sheets */}
            {sheets.map((sheet, sheetIndex) => (
              <div
                key={sheetIndex}
                className="border rounded-xl p-4 bg-slate-50"
              >
                {/* Sheet header */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Название листа"
                    className="flex-1 px-3 py-2 border rounded-lg"
                    value={sheet.name}
                    onChange={(e) =>
                      updateSheetName(sheetIndex, e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() => removeSheet(sheetIndex)}
                    className="text-red-500 font-semibold"
                  >
                    Удалить лист
                  </button>
                </div>

                {/* Columns */}
                <div className="flex flex-col gap-2">
                  {sheet.columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className="flex gap-2 items-center"
                    >
                      {/* Column name */}
                      <input
                        type="text"
                        placeholder={`Колонка ${colIndex + 1}`}
                        className="flex-1 px-3 py-2 border rounded-lg"
                        value={col.name}
                        onChange={(e) =>
                          updateColumn(
                            sheetIndex,
                            colIndex,
                            "name",
                            e.target.value
                          )
                        }
                        required
                      />

                      {/* Column type */}
                      <select
                        className="px-3 py-2 border rounded-lg"
                        value={col.type}
                        onChange={(e) =>
                          updateColumn(
                            sheetIndex,
                            colIndex,
                            "type",
                            e.target.value
                          )
                        }
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </select>

                      {/* Delete column */}
                      <button
                        type="button"
                        onClick={() =>
                          removeColumn(sheetIndex, colIndex)
                        }
                        className="text-red-500 font-bold px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addColumn(sheetIndex)}
                  className="mt-3 text-blue-600 font-medium"
                >
                  ➕ Добавить колонку
                </button>
              </div>
            ))}

            {/* Actions */}
            <div className="sticky bottom-0 bg-white py-4 flex gap-4 border-t">
              <button
                type="button"
                onClick={addSheet}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl"
              >
                ➕ Добавить лист
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-xl"
              >
                ✅ Создать документ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
