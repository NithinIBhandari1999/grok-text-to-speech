import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-600 rounded">
                        <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Audio Moderation Suite</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <a href="https://github.com/NithinIBhandari1999/grok-text-to-speech" className="px-4 py-2 text-sm bg-gray-800 text-white border border-gray-300 rounded shadow-sm hover:bg-gray-700">
                        Github
                    </a>
                    {/*
                    <button className="px-4 py-2 text-sm bg-red-600 text-white rounded shadow-sm hover:bg-red-700">
                        New Report
                    </button>
                    */}
                </div>
            </div>
        </header>
    )
}

export default Header;