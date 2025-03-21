import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Play, Pause, SkipForward, Settings, Search, Trash2, Filter, Download, Save } from 'lucide-react';

import Header from './Header';
import Transcript from './Transcript';
import AudioSource from './AudioSource';

const ContentModerationTool = () => {
  // State for audio file and processing
  const [isProcessing, setIsProcessing] = useState(false);

  // State for the transcript
  const [transcript, setTranscript] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column - Upload and Controls */}
          <AudioSource
            transcript={transcript}
            setTranscript={setTranscript}

            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />

          {/* Middle Column - Transcript */}
          <div className="col-span-1 md:col-span-2">

            <Transcript
              isProcessing={isProcessing}
              transcript={transcript}
              setTranscript={setTranscript}
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentModerationTool;