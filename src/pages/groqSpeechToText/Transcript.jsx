import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Transcript = ({
    isProcessing,
    transcript,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getWordStyle = (word) => {
        if (word.moderation_flags === 'high') {
            return {
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '2px 4px',
                borderRadius: '4px'
            };
        }
        if (word.moderation_flags === 'medium') {
            return {
                backgroundColor: '#ffcc00',
                color: '#b91c1c',
                padding: '2px 4px',
                borderRadius: '4px'
            };
        }
        return {
            padding: '2px 4px',
            borderRadius: '4px'
        };
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transcript</h2>
                <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                    />
                </div>
            </div>

            {isProcessing === false && transcript?.contextual_analysis_status.length >= 1 && (
                <div className="bg-blue-100 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-2">Summary </h3>
                    <p className="text-blue-800">{transcript?.contextual_analysis}</p>
                    {transcript?.contextual_analysis_status && (
                        <span
                            className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full 
                        ${transcript.contextual_analysis_status === 'high' ? 'bg-red-600' :
                                    transcript.contextual_analysis_status === 'medium' ? 'bg-yellow-500' :
                                        'bg-green-500'}`}>
                            {transcript.contextual_analysis_status.charAt(0).toUpperCase() + transcript.contextual_analysis_status.slice(1)} Risk
                        </span>
                    )}
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                {transcript ? (
                    <div className="text-base leading-relaxed">
                        {transcript.words.map((word, index) => (
                            <span
                                key={index}
                                style={getWordStyle(word)}
                            >
                                {word.word}{' '}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {isProcessing ?
                            "Processing audio transcript..." :
                            "Upload and process an audio file to see the transcript"}
                    </div>
                )}
            </div>
        </div>
    )
};

export default Transcript;