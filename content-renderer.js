/**
 * content-renderer.js
 * Renders structured project content into HTML
 */

function isAbsoluteMediaUrl(s) {
    if (!s) return false;
    const v = String(s).trim().toLowerCase();
    return v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:') || v.startsWith('blob:');
}

function joinUrl(base, path) {
    const b = String(base || '').trim().replace(/\/+$/, '');
    const p = String(path || '').trim().replace(/^\/+/, '');
    if (!b) return p;
    if (!p) return b;
    return `${b}/${p}`;
}

function resolveMediaUrl(value) {
    if (value == null) return '';
    const v = String(value).trim();
    if (!v) return '';
    if (isAbsoluteMediaUrl(v) || v.startsWith('#')) return v;
    return joinUrl(window.MEDIA_BASE_URL, v);
}

function renderStructuredProject(project) {
    if (!project.structuredContent) {
        // Fallback to bodyHtml if no structured content
        return project.bodyHtml || '';
    }

    const content = project.structuredContent;
    let html = '';

    // Add inline styles for this project
    html += generateProjectStyles(project);

    // Start wrapper
    html += '<div class="motion-system-content">';

    // Tags
    if (content.tags && content.tags.length > 0) {
        html += '<div class="motion-tags">';
        content.tags.forEach(tag => {
            html += `<span class="motion-tag">${tag}</span>`;
        });
        html += '</div>';
    }

    // Intro
    if (content.intro) {
        html += `<p class="motion-intro">${content.intro}</p>`;
    }

    // Meta
    if (content.meta) {
        html += `<div class="motion-meta">${content.meta}</div>`;
    }

    // Sections
    if (content.sections && content.sections.length > 0) {
        content.sections.forEach(section => {
            html += renderSection(section);
        });
    }

    html += '</div>';

    return html;
}

function generateProjectStyles(project) {
    // Generate project-specific CSS based on what's needed
    let styles = '<style>';
    
    // Common/shared styles for all structured projects
    styles += `
        #projectModalBody .motion-system-content {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
        }
        #projectModalBody .motion-tags {
            display: flex;
            gap: 12px;
            margin-bottom: 10px;
            flex-wrap: wrap;
        }
        #projectModalBody .motion-tag {
            padding: 6px 14px;
            background: #f0f0f0;
            border: 1px solid #333333;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            color: #000000;
        }
        #projectModalBody .motion-intro {
            font-size: 16px;
            line-height: 19px;
            font-weight: 600;
            color: #555555;
            margin-bottom: 20px;
            text-align: left;
        }
        #projectModalBody .motion-meta {
            font-size: 16px;
            font-weight: 600;
            color: #555555;
            margin-bottom: 20px;
            padding: 0;
            border: none;
            text-align: left;
        }
        #projectModalBody .motion-section {
            margin-bottom: 20px;
        }
        #projectModalBody .motion-section-label {
            font-size: 16px;
            font-weight: 400;
            color: #555555;
            margin-bottom: 10px;
            text-align: left;
        }
        #projectModalBody .motion-section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 10px;
            line-height: 19px;
            color: #000000;
            text-align: left;
        }
        #projectModalBody .motion-section-content {
            font-size: 16px;
            line-height: 19px;
            font-weight: 600;
            color: #555555;
            margin-bottom: 20px;
            text-align: left;
        }
        #projectModalBody .motion-section-content p {
            margin-bottom: 10px;
        }
        #projectModalBody .motion-section-content strong {
            color: #000000;
            font-weight: 600;
        }
        #projectModalBody .brand-showcase {
            margin-bottom: 20px;
        }
        #projectModalBody .deliverable-title {
            font-size: 16px;
            font-weight: 700;
            color: #000000;
            margin-bottom: 10px;
            text-align: left;
        }
        #projectModalBody .motion-tldr-box {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            border: 1px solid #ddd;
        }
    `;
    
    // Motion System-specific styles (Project 1)
    if (project.id === 1) {
        styles += `
            #projectModalBody .motion-step {
                margin-bottom: 20px;
            }
            #projectModalBody .motion-step-title {
                font-size: 16px;
                font-weight: 700;
                color: #000000;
                line-height: 19px;
                margin-bottom: 10px;
                text-align: left;
            }
            #projectModalBody .motion-step-content {
                font-size: 16px;
                line-height: 19px;
                font-weight: 600;
                color: #555555;
                padding-left: 0;
                margin-bottom: 20px;
                text-align: left;
            }
            #projectModalBody .motion-step-content p {
                margin-bottom: 10px;
            }
            #projectModalBody .motion-step-content strong {
                color: #000000;
                font-weight: 600;
            }
            #projectModalBody .motion-subsection-title {
                font-size: 16px;
                font-weight: 700;
                color: #000000;
                margin-top: 10px;
                margin-bottom: 10px;
                text-align: left;
            }
            #projectModalBody .principle-examples {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
                margin-top: 24px;
                margin-bottom: 20px;
            }
            #projectModalBody .principle-examples img {
                width: 100%;
                border-radius: 4px;
                border: none;
            }
            #projectModalBody .token-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 16px;
                margin-top: 24px;
                margin-bottom: 20px;
            }
            #projectModalBody .token-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px 16px;
                background: #f9f9f9;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            #projectModalBody .token-icon {
                width: 80px;
                height: 80px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                border-radius: 4px;
            }
            #projectModalBody .token-icon img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            #projectModalBody .token-name {
                font-size: 14px;
                color: #555555;
                text-align: center;
                font-weight: 600;
            }
            @media (max-width: 768px) {
                #projectModalBody .principle-examples {
                    grid-template-columns: 1fr;
                    gap: 12px;
                }
                #projectModalBody .token-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                #projectModalBody .token-icon {
                    width: 60px;
                    height: 60px;
                }
                #projectModalBody .token-name {
                    font-size: 12px;
                }
                #projectModalBody .motion-subsection-title {
                    font-size: 14px;
                    margin-top: 32px;
                }
            }
        `;
    }
    
    // Flink-specific styles
    if (project.id === 5) {
        styles += `
            #projectModalBody .flink-video-full {
                width: 100%;
                aspect-ratio: 16 / 9;
                max-height: 420px;
                overflow: hidden;
                margin-top: 10px;
                background: #f5f5f5;
                border-radius: 4px;
            }
            #projectModalBody .flink-video-full video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            #projectModalBody .flink-alt-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-top: 10px;
            }
            #projectModalBody .flink-alt-box {
                aspect-ratio: 16 / 9;
                overflow: hidden;
                background: #f5f5f5;
                border-radius: 4px;
            }
            #projectModalBody .flink-alt-box video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            #projectModalBody .flink-explorations {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 8px;
                margin-top: 10px;
            }
            #projectModalBody .flink-exploration-cell {
                aspect-ratio: 16 / 9;
                overflow: hidden;
                background: #f5f5f5;
                border-radius: 4px;
            }
            #projectModalBody .flink-exploration-cell video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
            }
            @media (max-width: 768px) {
                #projectModalBody .flink-video-full { max-height: 280px; }
                #projectModalBody .flink-alt-row { grid-template-columns: 1fr; }
                #projectModalBody .flink-explorations { grid-template-columns: repeat(2, 1fr); }
            }
        `;
    }

    // Lottie-specific styles
    if (project.id === 3) {
        styles += `
            #projectModalBody .lottie-container {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
                overflow: hidden;
                background: #000000;
            }
            #projectModalBody .lottie-container lottie-player { width: 100%; height: 100%; }
            #projectModalBody .lottie-card {
                background: #000000;
                border-color: #222;
            }
            #projectModalBody .lottie-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 10px 0;
            }
            #projectModalBody .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 10px 0;
            }
            #projectModalBody .stat-card {
                padding: 24px;
                text-align: center;
                border-radius: 4px;
            }
            #projectModalBody .stat-number {
                font-size: 24px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 8px;
            }
            #projectModalBody .stat-label {
                font-size: 14px;
                color: #555555;
                font-weight: 600;
            }
            @media (max-width: 768px) {
                #projectModalBody .lottie-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
                #projectModalBody .stats-grid { grid-template-columns: 1fr; }
            }
        `;
    }

    styles += '</style>';
    return styles;
}

function renderSection(section) {
    switch (section.type) {
        case 'text':
            return renderTextSection(section);
        case 'showcase':
            return renderShowcaseSection(section);
        case 'stats':
            return renderStatsSection(section);
        case 'step':
            return renderStepSection(section);
        default:
            return '';
    }
}

function renderTextSection(section) {
    const styleClass = section.style ? ` motion-${section.style}` : '';
    let html = `<div class="motion-section${styleClass}">`;
    
    if (section.label) {
        html += `<div class="motion-section-label">${section.label}</div>`;
    }
    
    if (section.title) {
        html += `<h2 class="motion-section-title">${section.title}</h2>`;
    }
    
    if (section.paragraphs && section.paragraphs.length > 0) {
        html += '<div class="motion-section-content">';
        section.paragraphs.forEach(para => {
            html += `<p>${para}</p>`;
        });
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

function renderShowcaseSection(section) {
    let html = '<div class="motion-section">';
    
    if (section.label) {
        html += `<div class="motion-section-label">${section.label}</div>`;
    }
    
    if (section.title) {
        html += `<h2 class="motion-section-title">${section.title}</h2>`;
    }

    if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
            html += renderShowcaseItem(item);
        });
    }
    
    html += '</div>';
    return html;
}

function renderShowcaseItem(item) {
    let html = '<div class="brand-showcase">';
    
    if (item.title) {
        html += `<h4 class="deliverable-title">${item.title}</h4>`;
    }
    
    if (item.description) {
        html += `<p class="motion-section-content">${item.description}</p>`;
    }

    // Render media based on layout
    if (item.media && item.media.length > 0) {
        switch (item.layout) {
            case 'full':
                html += '<div class="flink-video-full">';
                html += renderMediaElement(item.media[0]);
                html += '</div>';
                break;
            
            case 'grid-2':
                html += '<div class="flink-alt-row">';
                item.media.forEach(mediaUrl => {
                    html += '<div class="flink-alt-box">';
                    html += renderMediaElement(mediaUrl);
                    html += '</div>';
                });
                html += '</div>';
                break;
            
            case 'grid-6':
                html += '<div class="flink-explorations">';
                item.media.forEach(mediaUrl => {
                    html += '<div class="flink-exploration-cell">';
                    html += renderMediaElement(mediaUrl);
                    html += '</div>';
                });
                html += '</div>';
                break;
            
            case 'lottie-grid':
                html += '<div class="lottie-grid">';
                item.media.forEach(mediaUrl => {
                    html += '<div class="lottie-card">';
                    html += '<div class="lottie-container" style="display:flex;align-items:center;justify-content:center;">';
                    html += renderMediaElement(mediaUrl);
                    html += '</div>';
                    html += '</div>';
                });
                html += '</div>';
                break;
        }
    }
    
    html += '</div>';
    return html;
}

function renderMediaElement(mediaUrl) {
    const resolved = resolveMediaUrl(mediaUrl);
    const ext = resolved.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
    
    if (['mp4', 'webm', 'mov', 'gif'].includes(ext)) {
        return `<video src="${resolved}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:contain;"></video>`;
    } else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
        return `<img src="${resolved}" alt="" style="width:100%;height:100%;object-fit:contain;" />`;
    } else {
        return '';
    }
}

function renderStatsSection(section) {
    let html = '<div class="stats-grid">';
    
    if (section.items && section.items.length > 0) {
        section.items.forEach(item => {
            html += '<div class="stat-card">';
            html += `<div class="stat-number">${item.number}</div>`;
            html += `<div class="stat-label">${item.label}</div>`;
            html += '</div>';
        });
    }
    
    html += '</div>';
    return html;
}

function renderStepSection(section) {
    let html = '<div class="motion-step">';
    
    if (section.number && section.title) {
        html += `<h3 class="motion-step-title">${section.number} ${section.title}</h3>`;
    }
    
    if (section.paragraphs && section.paragraphs.length > 0) {
        html += '<div class="motion-step-content">';
        section.paragraphs.forEach(para => {
            html += `<p>${para}</p>`;
        });
        html += '</div>';
    }
    
    // Render media (for principle examples)
    if (section.media && section.media.length > 0 && section.layout === 'principle-examples') {
        html += '<div class="principle-examples">';
        section.media.forEach(mediaUrl => {
            html += `<img src="${mediaUrl}" alt="">`;
        });
        html += '</div>';
    }
    
    // Render token sections (Base Patterns, Common Interactions)
    if (section.tokenSections && section.tokenSections.length > 0) {
        section.tokenSections.forEach(tokenSection => {
            html += `<h4 class="motion-subsection-title">${tokenSection.title}</h4>`;
            html += '<div class="token-grid">';
            tokenSection.tokens.forEach(token => {
                html += '<div class="token-card">';
                html += `<div class="token-icon"><img src="${token.icon}" alt="${token.name}"></div>`;
                html += `<div class="token-name">${token.name}</div>`;
                html += '</div>';
            });
            html += '</div>';
        });
    }
    
    html += '</div>';
    return html;
}

// Export for use in content-loader.js
if (typeof window !== 'undefined') {
    window.renderStructuredProject = renderStructuredProject;
}
