export interface LasHeader {
    [key: string]: {
      mnemonic: string;
      unit: string;
      value: string;
      description: string;
    };
  }
  
  export interface LasCurve {
    mnemonic: string;
    unit: string;
    description: string;
  }
  
  export interface ParsedLas {
    version: LasHeader;
    well: LasHeader;
    curves: LasCurve[];
    parameters: LasHeader;
    data: number[][];
    other: string;
    log: string[];
  }
  
  export function parseLAS(fileContent: string): ParsedLas {
    const lines = fileContent.replace(/\r\n/g, '\n').split('\n');
    const result: ParsedLas = {
      version: {},
      well: {},
      curves: [],
      parameters: {},
      data: [],
      other: '',
      log: []
    };
  
    let currentSection: keyof Omit<ParsedLas, 'data' | 'log'> | null = null;
    let dataHeader: string[] = [];
  
    for (const line of lines) {
      const trimmedLine = line.trim();
  
      if (trimmedLine.startsWith('#')) {
        continue;
      }
  
      if (trimmedLine.startsWith('~')) {
        const sectionChar = trimmedLine.charAt(1).toUpperCase();
        switch (sectionChar) {
          case 'V': currentSection = 'version'; break;
          case 'W': currentSection = 'well'; break;
          case 'C': currentSection = 'curves'; break;
          case 'P': currentSection = 'parameters'; break;
          case 'O': currentSection = 'other'; break;
          case 'A':
            currentSection = null; // Data section starts
            dataHeader = result.curves.map(c => c.mnemonic);
            break;
          default:
            currentSection = null;
            result.log.push(`Unknown section: ${trimmedLine}`);
        }
        continue;
      }
  
      if (currentSection) {
        if (currentSection === 'version' || currentSection === 'well' || currentSection === 'parameters') {
          const match = trimmedLine.match(/^(\w+)\s*\.\s*([\w\s]*?)\s*:(.*)$/);
          if (match) {
            const [, mnemonic, unit, description] = match.map(s => s.trim());
            const value = (result[currentSection] as LasHeader)[mnemonic]?.value || '';
            (result[currentSection] as LasHeader)[mnemonic] = { mnemonic, unit, value, description };
          }
        } else if (currentSection === 'curves') {
          const match = trimmedLine.match(/^(\w+)\s*\.\s*([\w\s]*?)\s*:(.*)$/);
          if (match) {
            const [, mnemonic, unit, description] = match.map(s => s.trim());
            result.curves.push({ mnemonic, unit, description });
          }
        } else if (currentSection === 'other') {
          result.other += trimmedLine + '\n';
        }
      } else if (dataHeader.length > 0 && trimmedLine) {
        // Data section
        const values = trimmedLine.split(/\s+/).map(Number);
        if (values.length > 0 && !values.some(isNaN)) {
            result.data.push(values);
        }
      }
    }
    
    // Some LAS files have values on the same line as the mnemonic in the well section.
    // Example: STRT.M  1.0000 : START DEPTH
    if (result.well) {
        Object.keys(result.well).forEach(key => {
            const item = result.well[key];
            const descParts = item.description.split(':');
            if (descParts.length > 1) {
                const potentialValue = descParts[0].trim();
                const floatVal = parseFloat(potentialValue);
                if (!isNaN(floatVal)) {
                    item.value = potentialValue;
                    item.description = descParts.slice(1).join(':').trim();
                }
            }
        });
    }
  
    return result;
  }