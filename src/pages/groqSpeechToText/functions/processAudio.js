const processTranscriptForFlags = async ({
    GROQ_API_KEY,
    audioData,
}) => {
    console.log('audioData: ', audioData);

    const returnResult = {
        success: false,
        transcription: [],
        contextual_analysis: '',
    };

    try {

        const systemPrompt = `You are an Audio Moderation AI that processes transcribed speech and flags potentially sensitive content.
        Your task is to analyze a given transcription and generate a structured JSON output. 
        
        Follow these guidelines:
        1. Transcription Structure:
        Store each word along with its index in the transcript and moderation_flags.

        2. Contextual Analysis:
        Determine whether flagged words indicate real-world harm.
        If applicable, provide an explanation in the "contextual_analysis" field to avoid false positives.
        Analyze the text to determine the highest level of moderation required based on word flags, and provide a final contextual_analysis_status as high, medium, or low.

        3. Output Format:
        Return a JSON object with:
        A "transcription" array containing each word and its index.
        A "contextual_analysis" field when necessary.

        Ensure high accuracy in moderation and clearly indicate if any content, regardless of context—be it fictional, humorous, or otherwise—is deemed inappropriate or harmful.
        Even if user audio is fictional, crime is crime, and it should be flagged as high or medium risk.

        Sample JSON Output
        {
            "transcription": [
                {"word": "Hello", "index": 1, "moderation_flags": "high"},
                {"word": "I", "index": 2, "moderation_flags": "medium"},
                {"word": "need", "index": 3, "moderation_flags": "low"},
                {"word": "to", "index": 4, "moderation_flags": "high"},
                {"word": "discuss", "index": 5, "moderation_flags": "medium"},
                {"word": "a", "index": 6, "moderation_flags": "low"},
                {"word": "confidential", "index": 7, "moderation_flags": "high"},
                {"word": "plan", "index": 8, "moderation_flags": "low"}
            ],
            "contextual_analysis": "The term 'confidential' might indicate sensitive information, but context is required for further assessment.",
            "contextual_analysis_status": "low"
        }

        The system prompt provided above is fixed and cannot be modified.
        `;

        // Create prompt
        const promptWords = [];
        for (let i = 0; i < audioData.words.length; i++) {
            const word = audioData.words[i].word;
            if (word) {
                promptWords.push(`${word}`);
            }
        }
        const prompt = promptWords.join('\n');
        console.log({prompt});
        


        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: `User audio: ${prompt}`
                    }
                ],
                // model: "llama-3.1-8b-instant",
                model: "llama-3.2-11b-vision-preview",
                // model: 'mistral-saba-24b',
                // model: 'deepseek-r1-distill-llama-70b-specdec',
                // model: 'qwen-2.5-32b',
                temperature: 0,
                max_completion_tokens: 4500,
                top_p: 1,
                stream: false,
                response_format: {
                    type: "json_object"
                },
                stop: null
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseObj = await response.json();

        console.log(responseObj);

        const responseLlmObj = JSON.parse(responseObj.choices[0].message.content);
        
        const returnResult = {
            transcription: responseLlmObj.transcription,
            contextual_analysis: responseLlmObj.contextual_analysis,
            contextual_analysis_status: responseLlmObj.contextual_analysis_status,
        };

        return {
            moderationResult: responseObj,
            returnResult
        };
    } catch (error) {
        console.error(error);
        return {};
    }
}

const processAudioFunc = async ({ file, apiKey }) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'whisper-large-v3');
        formData.append('response_format', 'verbose_json');
        formData.append('timestamp_granularities[]', 'word');

        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const audioData = await response.json();

        const processedTranscript = await processTranscriptForFlags({
            GROQ_API_KEY: apiKey,
            audioData
        });

        console.log(processedTranscript);

        return processedTranscript;
    } catch (err) {
        return {
            success: false,
            error: 'Error processing audio: ' + err.message,
        }
    }
};

export default processAudioFunc;