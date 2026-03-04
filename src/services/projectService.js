
const API_URL = 'https://tm-backend-qfaf.onrender.com/api/projects';

export const fetchProjects = async (page = 1, limit = 20) => {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                limit,
            }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const fetchProjectById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}?include=true`);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};
