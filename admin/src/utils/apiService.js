const BASE_URL = 'http://localhost:5000/api';

/**
 * Meaningful abstraction for API calls. 
 * Low coupling: Components don't need to know the exact URL or handle common headers.
 */
export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Safety check for non-JSON responses (404s, etc)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } else {
        const text = await response.text();
        return { ok: response.ok, status: response.status, data: { message: text } };
    }
};
