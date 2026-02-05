import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Simplified LAS parser logic
const parseLAS = (fileContent) => {
    return new Promise((resolve, reject) => {
        const lines = fileContent.split(/\r?\n/);
        
        let curveInfo = [];
        let dataSection = [];
        let inAsciiSection = false;

        const curveSectionMatch = fileContent.match(/~Curve Information[\s\S]*?~A/i);
        if (curveSectionMatch) {
            const curveLines = curveSectionMatch[0].split(/\r?\n/);
            curveInfo = curveLines
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#') && !line.startsWith('~'))
                .map(line => line.split(/\s+/)[0].split('.')[0]); // Take mnemonic before unit
        } else {
            return reject(new Error("~Curve Information section not found."));
        }
        
        const dataLines = lines.slice(lines.findIndex(line => line.toUpperCase().startsWith('~A')) + 1)
            .map(line => line.trim()).filter(line => line && !line.startsWith('#'));

        if(dataLines.length === 0){
             return reject(new Error("No data found in ~A section."));
        }

        const data = dataLines.map(line => {
            const values = line.split(/\s+/).map(Number);
            const row = {};
            curveInfo.forEach((curve, index) => {
                row[curve] = values[index];
            });
            return row;
        });

        // Calculate stats
        const stats = {};
        curveInfo.forEach(curve => {
            const values = data.map(d => d[curve]).filter(v => !isNaN(v) && v !== -999.25);
            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                stats[curve] = {
                    min: Math.min(...values),
                    max: Math.max(...values),
                    mean: sum / values.length,
                    count: values.length,
                };
            } else {
                stats[curve] = { min: null, max: null, mean: null, count: 0 };
            }
        });

        resolve({ curves: curveInfo, data, header: "Header info placeholder", stats });
    });
};

export const useFileParser = () => {
    const { toast } = useToast();
    const [parsingState, setParsingState] = useState({ status: 'idle', progress: 0, error: null });

    const parseFile = useCallback((file) => {
        return new Promise((resolve, reject) => {
            setParsingState({ status: 'parsing', progress: 0, error: null });
            const reader = new FileReader();

            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setParsingState(prev => ({ ...prev, progress }));
                }
            };
            
            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    setParsingState({ status: 'parsing', progress: 100, error: null });
                    if (file.name.toLowerCase().endsWith('.las')) {
                        const parsedData = await parseLAS(content);
                        setParsingState({ status: 'success', progress: 100, error: null });
                        resolve(parsedData);
                    } else {
                        throw new Error('Unsupported file type. Only .las files are currently supported.');
                    }
                } catch (err) {
                    console.error("Parsing error:", err);
                    setParsingState({ status: 'error', progress: 100, error: err.message });
                    reject(err);
                }
            };

            reader.onerror = (error) => {
                console.error("File reading error:", error);
                setParsingState({ status: 'error', progress: 0, error: 'Failed to read file.' });
                reject(new Error('Failed to read file.'));
            };

            reader.readAsText(file);
        });

    }, [toast]);


    return { parseFile, parsingState };
};