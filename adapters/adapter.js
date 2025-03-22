import {ObjectId} from "mongodb";

export function adaptIssue(issue) {
    return {
        ...issue,
        assigned_to: issue.assigned_to ?? '',
        status_text: issue.status_text ?? '',
        created_on: new Date(),
        updated_on: new Date(),
        open: true
    }
}

export function adaptFilters(filters) {

    filters = { ...filters}; // Clone req.query to avoid modifying it

    // Ensure correct data types
    Object.keys(filters).forEach(key => {

        if(key === '_id'){
            filters[key] = new ObjectId(filters[key]);
        }
        if (!isNaN(filters[key])) {
            filters[key] = Number(filters[key]); // Convert numbers
        } else if (filters[key] === 'true') {
            filters[key] = true;
        } else if (filters[key] === 'false') {
            filters[key] = false;
        }
    });

    return filters
}