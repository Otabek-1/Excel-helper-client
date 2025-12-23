import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "./api";

export default function Form() {
  const { filename, sheetname } = useParams();

  const [schema, setSchema] = useState(null);
  const [sheet, setSheet] = useState([]);
  const [datas, setDatas] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/schema/${filename}.xlsx`)
      .then((res) => {
        setSchema(res.data);
        const currentSheet = res.data.sheets.find(
          (i) => i.name === sheetname
        );
        setSheet(currentSheet.columns);
      })
      .catch(console.error);
  }, [filename, sheetname]);

  const handleChange = (index, value) => {
    const copy = [...datas];
    copy[index] = value;
    setDatas(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      doc_name: filename,
      sheet: sheetname,
      datas,
    };

    api
      .post("/submit", payload)
      .then(() => {
        setSubmitted(true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (!schema) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      {/* FORM */}
      {!submitted && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-6 border-b pb-4">
            <h1 className="text-3xl font-semibold text-slate-800">
              {sheetname}
            </h1>
            <p className="text-slate-500 mt-1">
              Форма для заполнения данных
            </p>
          </div>

          {/* Fields */}
          <form className="flex flex-col gap-6">
            {sheet.map((sh, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <label className="text-slate-700 font-medium">
                  {sh.name}
                </label>

                <input
                  type={sh.type}
                  value={datas[idx] || ""}
                  onChange={(e) =>
                    handleChange(idx, e.target.value)
                  }
                  className="
                    border border-slate-300 rounded-lg px-4 py-2
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition
                  "
                />
              </div>
            ))}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
                mt-4 bg-blue-600 text-white py-3 rounded-xl
                hover:bg-blue-700 transition
                disabled:opacity-50
              "
            >
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </form>
        </div>
      )}

      {/* SUCCESS MODAL (Google Form style) */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="text-green-500 text-6xl mb-4">✔</div>

            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Ответ отправлен
            </h2>

            <p className="text-slate-600 mb-6">
              Ваши данные успешно сохранены.
              <br />
              Спасибо за заполнение формы!
            </p>

            <button
              onClick={() => window.location.reload()}
              className="
                bg-blue-600 text-white px-6 py-2 rounded-xl
                hover:bg-blue-700 transition
              "
            >
              Отправить ещё раз
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
