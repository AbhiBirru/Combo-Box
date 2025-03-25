import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './ComboBox.css';

interface ComboBoxProps {
    options: string[];
}

export default function ComboBox({ options }: ComboBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    Math.min(prev + 1, filteredOptions.length - 1)
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => Math.max(prev - 1, -1));
                break;
            case 'Enter':
                if (highlightedIndex >= 0) {
                    setInputValue(filteredOptions[highlightedIndex]);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    useEffect(() => {
        if (listboxRef.current && highlightedIndex >= 0) {
            const items = listboxRef.current.children;
            items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex]);

    return (
        <div
            className="combobox-wrapper"
            ref={wrapperRef}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
        >
            <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setIsOpen(true);
                    setHighlightedIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                aria-autocomplete="list"
                aria-controls="combobox-listbox"
                aria-activedescendant={highlightedIndex !== -1 ? `option-${highlightedIndex}` : undefined}
            />

            {isOpen && (
                <ul
                    id="combobox-listbox"
                    className="combobox-listbox"
                    role="listbox"
                    ref={listboxRef}
                >
                    {filteredOptions.length === 0 ? (
                        <li className="no-results" role="option">No results found</li>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <li
                                key={option}
                                id={`option-${index}`}
                                role="option"
                                aria-selected={index === highlightedIndex}
                                className={`combobox-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                                onClick={() => {
                                    setInputValue(option);
                                    setIsOpen(false);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {option}
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}