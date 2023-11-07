import React from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";

function FileInput({ onFileUpload }) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      onFileUpload(excelData);
    };

    reader.readAsBinaryString(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="file-input p-6 m-4 rounded-lg border-dashed border-2 border-gray-300 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-lg">Drag & drop an Excel file here, or click to select one</p>
    </div>
  );
}

export default FileInput;
