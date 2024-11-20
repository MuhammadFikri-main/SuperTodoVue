import { defineStore } from 'pinia';
import axios from 'axios';

export const useTemplateStore = defineStore('templateStore', {
    state: () => ({
        templates: [],
        isLoading: false,
        error: null,
    }),
    actions: {
        async fetchPublicTemplates() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await axios.get('/api/templates/public');
                this.templates = response.data.templates;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to load templates';
            } finally {
                this.isLoading = false;
            }
        },
        async useTemplate(templateId) {
            this.error = null;
            try {
                await axios.post('/api/templates/use', { template_id: templateId });
                return true;
            } catch (error) {
                this.error = error.response?.data?.message || 'Failed to use template';
                return false;
            }
        },
    },
});
