export function isValidUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);

        // Check for protocol
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return false;
        }

        // Check for hostname
        if (!parsedUrl.hostname || parsedUrl.hostname.length < 2) {
            return false;
        }

        // Check for TLD
        const hostnameParts = parsedUrl.hostname.split('.');
        if (hostnameParts.length < 2 || hostnameParts[hostnameParts.length - 1].length < 2) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}
