import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';

import processAudioFunc from './functions/processAudio';

const AudioSource = ({
    transcript,
    setTranscript,

    isProcessing,
    setIsProcessing,
}) => {
    // State for audio file and processing
    const [file, setFile] = useState(null);
    // const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const [error, setError] = useState(null);

    // State for moderation settings and results
    const [apiKey, setApiKey] = useState('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');

    // Implement the API call to process audio
    const processAudio = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const result = await processAudioFunc({
                file, apiKey
            })
            console.log('result: ', result);

            setTranscript({
                words: result.returnResult.transcription,

                transcription: result.returnResult.transcription,
                contextual_analysis: result.returnResult.contextual_analysis,
                contextual_analysis_status: result.returnResult.contextual_analysis_status
            });
        } catch (error) {

        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (audioRef.current) {
                const url = URL.createObjectURL(selectedFile);
                audioRef.current.src = url;
                audioRef.current.onloadedmetadata = () => {
                    setDuration(audioRef.current.duration);
                };
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setIsPlaying(!audioRef.current.paused);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            const newTime = Math.min(audioRef.current.currentTime + 5, duration);
            audioRef.current.currentTime = newTime;
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const getProgressBarWidth = () => {
        return duration ? (currentTime / duration) * 100 : 0;
    };

    return (
        <div className="col-span-1">

            <a
                href='https://groq.com'
            >
                <div className='bg-white p-6 rounded-lg shadow-sm mb-3 text-center'>
                    <img
                        src='/powered_by/PBG mark1 color.svg'
                        style={{
                            width: '100%',
                            height: '60px',
                        }}
                    />
                </div>
            </a>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-4">Audio Source</h2>

                {/* Groq API Key */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Groq API Key
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Groq API key"
                        className="w-full border border-gray-300 rounded-md py-2 px-3"
                    />
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="audio-upload"
                        />
                        <label htmlFor="audio-upload" className="cursor-pointer block">
                            <div className="flex flex-col items-center">
                                <div className="p-3 mb-2 rounded-full bg-slate-100">
                                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {file ? file.name : "Select an audio file"}
                                </span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Audio Player */}
                <div className="mb-4">
                    <audio
                        ref={audioRef}
                        className="hidden"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                    />

                    {/* Custom Audio Controls */}
                    <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-300 rounded-full mb-3 relative">
                            <div
                                className="h-full bg-red-600 rounded-full"
                                style={{ width: `${getProgressBarWidth()}%` }}
                            />
                        </div>

                        {/* Control Buttons */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={togglePlay}
                                className="p-2 rounded-full bg-white shadow"
                                disabled={!file}
                            >
                                {isPlaying ? <Pause className="h-5 w-5 text-gray-700" /> : <Play className="h-5 w-5 text-gray-700" />}
                            </button>
                            <button
                                onClick={skipForward}
                                className="p-2 rounded-full bg-white shadow"
                                disabled={!file}
                            >
                                <SkipForward className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={processAudio}
                    disabled={!file || !apiKey || isProcessing}
                    className={`w-full py-2 rounded-md ${!file || !apiKey || isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                >
                    {isProcessing ? 'Processing...' : 'Analyze Audio Content'}
                </button>
            </div>
        </div>
    );
};

export default AudioSource;