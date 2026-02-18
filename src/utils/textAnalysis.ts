import { v4 as uuidv4 } from 'uuid';
import type { Claim, Source } from '../types';

export function analyzeText(text: string, storyId: string): {
    title: string;
    summary: string;
    claims: Claim[];
    sources: Source[];
} {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const title = lines[0]?.substring(0, 100) || 'Untitled Story';
    const summary = lines.slice(0, 3).join(' ').substring(0, 500) + '...';

    const claims: Claim[] = [];
    const sources: Source[] = [];
    const sourceNames = new Set<string>();

    const attributionRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s(?:said|stated|claimed|reported|announced|according to)/;

    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || lines;

    sentences.forEach(sentence => {
        const cleanSentence = sentence.trim();
        if (cleanSentence.length < 20) return;

        let isClaim = false;
        let priority: Claim['priority'] = 'Medium';
        let type: Claim['type'] = 'Factual';
        let status: Claim['status'] = 'Unverified' as const;
        let sourceName = 'Text Analysis'; // Default source for the claim

        // Check for numbers (Statistical)
        if (/\d+(?:%|\s(?:percent|dollars|million|billion))?/.test(cleanSentence)) {
            isClaim = true;
            type = 'Statistical';
            priority = 'High';
        }

        // Check for quotes (Attribution)
        if (/"([^"]*)"/.test(cleanSentence)) {
            isClaim = true;
            type = 'Attribution';
        }

        // Check for sources
        const sourceMatch = cleanSentence.match(attributionRegex);
        if (sourceMatch && sourceMatch[1]) {
            const name = sourceMatch[1];
            // Exclude common pronouns and articles
            if (!sourceNames.has(name) && !['He', 'She', 'It', 'They', 'The', 'However', 'But'].includes(name)) {
                sourceNames.add(name);
                sources.push({
                    id: uuidv4(),
                    storyId,
                    name: name,
                    type: 'Primary',
                    isConfidential: false,
                    stake: 'None',
                    corroborated: 'No',
                    assessment: 'Requires corroboration',
                    notes: `Auto-extracted from context: "${cleanSentence.substring(0, 50)}..."`
                });
            }
            if (sourceMatch[1]) sourceName = sourceMatch[1];
            isClaim = true;
        }

        if (isClaim) {
            claims.push({
                id: uuidv4(),
                storyId,
                text: cleanSentence,
                type: type,
                source: sourceName,
                status: status,
                priority: priority,
                notes: 'Auto-extracted from text',
                verificationLogs: []
            });
        }
    });

    return {
        title,
        summary,
        claims,
        sources
    };
}
