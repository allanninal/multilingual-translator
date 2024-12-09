/**
 * Multilingual Translator Application
 * 
 * This React application provides a user interface for translating text between different languages.
 * It communicates with a backend API endpoint to perform the translations and handles various
 * states including loading, errors, and successful translations.
 * 
 * @module App
 * @requires React
 * @requires axios
 * @requires PropTypes
 */

import React, { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

// Application-wide styles defined as JavaScript objects
const styles = {
    container: {
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        boxShadow: "0 0 40px rgba(0,0,0,0.03)"
    },
    title: {
        color: "#1a365d",
        marginBottom: "40px",
        textAlign: "center",
        fontSize: "2.8rem",
        fontWeight: "800",
        letterSpacing: "-0.5px"
    },
    textarea: {
        width: "100%",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        fontSize: "1rem",
        marginBottom: "24px",
        resize: "vertical",
        fontFamily: "inherit"
    },
    languageInputsContainer: {
        display: "flex",
        gap: "20px",
        marginBottom: "24px"
    },
    labelContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 1
    },
    labelText: {
        fontSize: "0.9rem",
        color: "#4a5568",
        marginBottom: "8px"
    },
    input: {
        padding: "12px",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        fontSize: "1rem"
    },
    button: {
        backgroundColor: "#4299e1",
        color: "white",
        padding: "12px 24px",
        borderRadius: "6px",
        border: "none",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.2s",
        width: "100%",
        marginBottom: "24px",
        "&:hover": {
            backgroundColor: "#3182ce"
        }
    }
};

/**
 * TranslationInput Component
 * Renders a textarea for users to input text for translation
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.value - The current input text value
 * @param {function} props.onChange - Handler for input changes
 * @param {string} props.placeholder - Placeholder text for the textarea
 */
const TranslationInput = ({ value, onChange, placeholder }) => (
    <textarea
        rows="6"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.textarea}
    />
);

/**
 * LanguageInput Component
 * Renders an input field for language selection with a label
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label text for the input
 * @param {string} props.value - Current language code value
 * @param {function} props.onChange - Handler for input changes
 * @param {string} props.placeholder - Placeholder text for the input
 */
const LanguageInput = ({ label, value, onChange, placeholder }) => (
    <label style={styles.labelContainer}>
        <span style={styles.labelText}>{label}</span>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={styles.input}
        />
    </label>
);

/**
 * ErrorMessage Component
 * Displays error messages in a styled container
 */
const ErrorMessage = ({ message }) => (
    <div style={{
        padding: "12px",
        backgroundColor: "#fed7d7",
        color: "#c53030",
        borderRadius: "6px",
        marginBottom: "24px",
        fontSize: "0.9rem"
    }}>
        {message}
    </div>
);

/**
 * TranslatedOutput Component
 * Displays the translated text result
 */
const TranslatedOutput = ({ text }) => (
    <div style={{
        padding: "16px",
        backgroundColor: "#e6fffa",
        border: "1px solid #81e6d9",
        borderRadius: "6px",
        marginBottom: "24px",
        fontSize: "1rem",
        color: "#2c7a7b"
    }}>
        {text}
    </div>
);

/**
 * Main Application Component
 * Manages the translation interface and handles API communication
 * 
 * @component
 * @returns {React.Element} The rendered application
 */
function App() {
    // State management for form inputs and UI states
    const [inputText, setInputText] = useState(""); // Text to be translated
    const [originalLanguage, setOriginalLanguage] = useState("en"); // Source language code
    const [destinationLanguage, setDestinationLanguage] = useState("es"); // Target language code
    const [translationResult, setTranslationResult] = useState(""); // Translated text result
    const [errorMessage, setErrorMessage] = useState(""); // Error message display
    const [isTranslating, setIsTranslating] = useState(false); // Loading state indicator

    /**
     * Handles the translation submission process
     * Validates input, makes API call, and updates state accordingly
     * 
     * @async
     * @function handleTranslationSubmit
     * @returns {Promise<void>}
     */
    const handleTranslationSubmit = async () => {
        // Input validation
        if (!inputText.trim()) {
            setErrorMessage("Please enter some text.");
            return;
        }

        // Reset states before translation
        setErrorMessage("");
        setTranslationResult("");
        setIsTranslating(true);

        try {
            // Make API call to translation endpoint
            const response = await axios.post("http://127.0.0.1:5000/translate", {
                text: inputText,
                source_language: originalLanguage,
                target_language: destinationLanguage,
            });
            setTranslationResult(response.data.translated_text || "No translation available.");
        } catch (err) {
            // Handle API errors
            setErrorMessage(err.response?.data?.message || "Failed to translate text. Please try again.");
        } finally {
            // Reset loading state
            setIsTranslating(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Multilingual Translator</h1>
            
            {/* Text input area for content to translate */}
            <TranslationInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
            />
            
            {/* Language selection container */}
            <div style={styles.languageInputsContainer}>
                {/* Source language input */}
                <LanguageInput
                    label="Original Language:"
                    value={originalLanguage}
                    onChange={(e) => setOriginalLanguage(e.target.value)}
                    placeholder="e.g., en"
                />
                {/* Target language input */}
                <LanguageInput
                    label="Destination Language:"
                    value={destinationLanguage}
                    onChange={(e) => setDestinationLanguage(e.target.value)}
                    placeholder="e.g., es"
                />
            </div>

            {/* Translation submit button with loading state */}
            <button 
                onClick={handleTranslationSubmit}
                disabled={isTranslating}
                style={{
                    ...styles.button,
                    opacity: isTranslating ? 0.7 : 1,
                }}
            >
                {isTranslating ? "Translating..." : "Translate"}
            </button>

            {/* Conditional rendering of error and result messages */}
            {errorMessage && <ErrorMessage message={errorMessage} />}
            {translationResult && <TranslatedOutput text={translationResult} />}
        </div>
    );
}

// PropType definitions for type checking
TranslationInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

LanguageInput.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

TranslatedOutput.propTypes = {
    text: PropTypes.string.isRequired
};

export default App;
