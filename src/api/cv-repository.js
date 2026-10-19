import { config } from '../config.js';

export const cvRepository = {
  async fetchMarkdown() {
    const response = await fetch(config.cvUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} on ${config.cvUrl}`);
    return response.text();
  },
};
