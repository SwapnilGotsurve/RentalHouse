import React from 'react';
import { FaFileAlt, FaEye, FaDownload, FaTrash, FaUpload } from 'react-icons/fa';

const Documents = () => {
  const documents = [
    { id: 1, name: 'House Rules.pdf', size: '2.4 MB', date: '2024-11-15', type: 'PDF' },
    { id: 2, name: 'Lease Agreement.docx', size: '1.8 MB', date: '2024-11-20', type: 'Document' },
    { id: 3, name: 'Check-in Instructions.pdf', size: '0.9 MB', date: '2024-11-25', type: 'PDF' },
    { id: 4, name: 'Guest Policies.pdf', size: '1.2 MB', date: '2024-12-01', type: 'PDF' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Documents</h1>
          <p className="text-gray-600">Manage your property documents and contracts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-medium">
          <FaUpload />
          Upload Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-gray-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.size} • {doc.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {doc.type}
                </span>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <FaEye className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <FaDownload className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;

