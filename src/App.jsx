import React, { useEffect, useState } from 'react'
import { FaDownload, FaLink, FaList, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import api from "./api"

export default function App() {
  const [files, estFiles] = useState(null);
  const [selected, setSelected] = useState();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyLink = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };


  useEffect(() => {
    api.get("/files").then(res => {
      if (res.status === 200) {
        estFiles(res.data);
      }
    }).catch(err => {
      alert("Error.")
      console.log(err);
    })
  }, [])

  const deleteFile = (name) => {
    if (!window.confirm("Вы уверены, что хотите удалить файл?")) return;

    api.delete(`/delete/${name}`)
      .then(res => {
        if (res.status === 200) {
          alert("Документ успешно удалён");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Ошибка при удалении документа");
      });
  };

  if (!files) {
    return <div>Загрузка...</div>
  }

  const handleSelectedFIle = (name) => {
    api.get(`/schema/${name}`).then(res => {
      setSelected(res.data);
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div className='w-full h-screen flex flex-col p-5 gap-4 bg-slate-100'>
      <h4 className="text-slate-900 text-2xl">Файлы Excel</h4>

      <Link to='/create' className='px-4 py-1 bg-blue-400 text-white w-max rounded-lg'>Создать</Link>

      <div className="list w-full h-max flex flex-col gap-2 rounded-xl shadow-xl bg-white p-3">
        {files.length && files.map((file, idx) => {
          return (
            <div key={idx} className="flex w-full items-center rounded-xl justify-between p-3 h-10 border-1 border-slate-200">
              <h3 className="text-lg text-slate-600">{file.split(".")[0]}</h3>

              <div className="flex items-center gap-2">
                {/* <FaList title='Изменить' /> */}
                <FaLink title='Links' onClick={() => handleSelectedFIle(file)} />
                <FaTrash title='Удалить' className='text-red-600' onClick={() => deleteFile(file)} />
                <a href={`https://excel-helper-server.onrender.com/file/download/${file}`}>
                  <FaDownload title='Скачать' />
                </a>
              </div>
            </div>
          )
        }) || <span>Пока нет документов </span>}
      </div>

      {selected && (
        <div className='w-full h-screen bg-black/30 absolute top-0 left-0 p-10 flex items-center justify-center'>
          <div className="box w-full min-h-full h-max bg-white rounded-xl shadow-xl p-5 flex flex-col gap-4">
            <h3 className="text-slate-800 text-3xl font-semibold mb-5">Ссылки документа {selected.document_name}</h3>

            {selected.sheets.map((sheet, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-slate-800 text-lg flex-col relative"
                >
                  <span className="font-semibold">{sheet.name}:</span>

                  <code
                    onClick={() =>
                      copyLink(
                        `https://excel-helper-app.netlify.app/${selected.document_name}/${sheet.name}`,
                        idx
                      )
                    }
                    className="bg-slate-200 px-3 py-1 rounded-xl cursor-pointer hover:bg-slate-300 transition"
                  >
                    http://localhost:5173/{selected.document_name}/{sheet.name}
                  </code>

                  {copiedIndex === idx && (
                    <span className="text-green-500 text-sm">
                      Успешно скопирована!
                    </span>
                  )}
                </div>
              );
            })}

            <button onClick={()=>setSelected(null)} className='absolute bottom-20 right-20 text-white bg-slate-800 px-5 py-2 rounded-xl hover:bg-slate-600'>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  )
}
