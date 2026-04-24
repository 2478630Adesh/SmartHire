import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';
import Template5 from './Template5';
import Template6 from './Template6';
import Template7 from './Template7';
import Template8 from './Template8';
import Template9 from './Template9';
import Template10 from './Template10';

export const TEMPLATES = [
  { id: 'template1',  name: 'Professional',  category: 'Classic',   color: '#0A66C2', component: Template1,  description: 'Clean blue banner header with two-column layout. Great for corporate roles.' },
  { id: 'template2',  name: 'Editorial',     category: 'Minimal',   color: '#1E293B', component: Template2,  description: 'Elegant serif single-column design inspired by magazine layouts.' },
  { id: 'template3',  name: 'Modern',        category: 'Creative',  color: '#7C3AED', component: Template3,  description: 'Bold sidebar with contrasting content area. Perfect for designers.' },
  { id: 'template4',  name: 'ATS Pro',       category: 'ATS-friendly', color: '#111827', component: Template4, description: 'Maximum ATS compatibility, simple formatting, zero graphics.' },
  { id: 'template5',  name: 'Creative',      category: 'Creative',  color: '#EA580C', component: Template5,  description: 'Warm accent stripe, energetic layout for creative roles.' },
  { id: 'template6',  name: 'Executive',     category: 'Classic',   color: '#C19A6B', component: Template6,  description: 'Sophisticated dark header with gold accents for senior roles.' },
  { id: 'template7',  name: 'Tech',          category: 'Creative',  color: '#10B981', component: Template7,  description: 'Developer-focused with code-style headers and monospace accents.' },
  { id: 'template8',  name: 'Timeline',      category: 'Modern',    color: '#DC2626', component: Template8,  description: 'Vertical timeline that visualizes your career progression.' },
  { id: 'template9',  name: 'Compact',       category: 'Modern',    color: '#0891B2', component: Template9,  description: 'Dense two-column layout that fits rich history on one page.' },
  { id: 'template10', name: 'Gradient',      category: 'Modern',    color: '#6366F1', component: Template10, description: 'Bold gradient header with modern card-based sections.' },
];

export const getTemplate = (id) =>
  TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
