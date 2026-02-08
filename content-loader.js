// ===================================
// CONTENT LOADER - Load content from content.json
// ===================================

function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}
function escapeAttr(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const FALLBACK_HERO = { name: 'Spiros Leividiotis', subtitle: 'Staff Product Motion Designer specializing in motion systems and design system implementation.', tags: { tools: ['Rive', 'Figma', 'LottieFiles'], skills: ['Product Motion', 'Design Systems', 'Interaction Design'] } };
const FALLBACK_ABOUT = { photo: 'about-photo.png', bio: ["I'm Spiros, a Staff Product Motion Designer based in Amsterdam, working at the intersection of product design, animation, and design systems."] };

async function loadContent() {
    let content = {};
    try {
        const response = await fetch('content.json?v=' + Date.now());
        if (response.ok) content = await response.json();
    } catch (error) {
        console.error('Error loading content:', error);
    }
    try {
        updateHero(content.hero || FALLBACK_HERO);
        updateAboutMe(content.aboutMe || FALLBACK_ABOUT);
        
        if (content.music) updateMusic(content.music);
        if (content.reel) updateReel(content.reel);
        if (content.header) updateHeader(content.header);
        if (content.projects) updateProjects(content.projects);
        if (content.experience) updateExperience(content.experience);
        if (content.footer) updateFooter(content.footer);
        if (content.analytics && content.analytics.script && content.analytics.script.trim()) {
            injectAnalyticsScript(content.analytics.script.trim());
        }
        setTimeout(() => {
            window.dispatchEvent(new Event('contentLoaded'));
        }, 150);
    } catch (error) {
        console.error('Error applying content:', error);
    }
}

// Update Hero Section (CMS only – no fallback to HTML)
function updateHero(hero) {
    const heroName = document.getElementById('heroName');
    if (heroName && hero.name) heroName.innerHTML = escapeHtml(hero.name);
    
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle && hero.subtitle != null) heroSubtitle.textContent = hero.subtitle;
    
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto && hero.photo) heroPhoto.style.backgroundImage = `url('${escapeAttr(hero.photo)}')`;
    
    const tagsGrid = document.getElementById('tagsGrid');
    if (tagsGrid) {
        const tools = (hero.tags && Array.isArray(hero.tags.tools)) ? hero.tags.tools : [];
        const skillsHardcoded = ['Product Motion', 'Design Systems', 'Interaction Design'];
        const toolTags = tools.map(tool => `<div class="tag tag-black">${escapeHtml(tool)}</div>`).join('');
        const skillTags = skillsHardcoded.map(skill => `<div class="tag">${escapeHtml(skill)}</div>`).join('');
        tagsGrid.innerHTML = toolTags + skillTags;
    }
}

// Update About Me (hero-about overlay only)
function updateAboutMe(aboutMe) {
    const heroAboutPhoto = document.getElementById('heroAboutPhotoImg');
    if (heroAboutPhoto && aboutMe.photo) {
        heroAboutPhoto.src = aboutMe.photo;
        heroAboutPhoto.alt = 'Spiros Leividiotis';
    }
    const heroAboutText = document.getElementById('heroAboutText');
    if (heroAboutText && Array.isArray(aboutMe.bio)) {
        heroAboutText.innerHTML = aboutMe.bio.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
}

// Update Music Player
function updateMusic(music) {
    const musicTitle = document.querySelector('.player-title');
    if (musicTitle) musicTitle.textContent = music.title;
    
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) audioPlayer.src = music.file;
}

// Inject analytics script (views & location visible in your GA/Plausible dashboard)
function injectAnalyticsScript(scriptHtml) {
    const wrap = document.createElement('div');
    wrap.innerHTML = scriptHtml;
    wrap.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.src) newScript.src = oldScript.src;
        else newScript.textContent = oldScript.textContent;
        (document.head || document.documentElement).appendChild(newScript);
    });
}

// Update Reel (modal + inline reel area)
function updateReel(reel) {
    const modalSource = document.querySelector('#videoPlayerElement source');
    if (modalSource && reel.file) {
        modalSource.src = reel.file;
        const modalVideo = document.getElementById('videoPlayerElement');
        if (modalVideo) modalVideo.load();
    }
    const inlineVideo = document.getElementById('reelInlineVideo');
    if (inlineVideo && reel.file) {
        inlineVideo.src = reel.file;
        inlineVideo.load();
    }
}

// Update Header (4 links: About me, Experience, Reel, Projects)
function updateHeader(header) {
    const location = document.querySelector('.location');
    if (location) {
        const locText = (header.location.text || '').trim();
        location.textContent = locText ? locText.charAt(0).toUpperCase() + locText.slice(1).toLowerCase() : '';
        location.href = header.location.link;
    }
    
    const footerCvLink = document.querySelector('.footer-left a[href*="cv"], .footer-left a[href*=".pdf"]');
    if (footerCvLink && header.cvFile) footerCvLink.href = header.cvFile;
    
    const nav = header.navigation && header.navigation.length ? header.navigation : [
        { text: 'about me', href: '#' },
        { text: 'experience', href: '#experience' },
        { text: 'projects', href: '#work' }
    ];
    // Figma: two columns. Col1: About me, Experience. Col2: Reel, Projects. Display: proper case.
    const labelsLower = ['about me', 'experience', 'reel', 'projects'];
    const labelsDisplay = ['About me', 'Experience', 'Reel', 'Projects'];
    const defaultHrefs = ['#', '#experience', '#reel', '#work'];
    const linkByLabel = {};
    nav.forEach((item) => {
        const t = (item.label || item.text || '').toLowerCase();
        if (t) linkByLabel[t] = item.href || '#';
    });
    const entriesEl = document.getElementById('heroNavLeft');
    if (entriesEl) {
        const link = (labelKey, displayText, i) => {
            const href = linkByLabel[labelKey] || defaultHrefs[i];
            const isAbout = (href.replace(/^#/, '') === '' || href === '#') && i === 0;
            return `<a href="${escapeAttr(href)}" class="nav-link" ${isAbout ? 'id="aboutMeLink"' : ''}>${escapeHtml(displayText)}</a>`;
        };
        entriesEl.innerHTML = `
            <div class="header-col">${link('about me', 'About me', 0)}${link('experience', 'Experience', 1)}</div>
            <div class="header-col">${link('reel', 'Reel', 2)}${link('projects', 'Projects', 3)}</div>
        `;
    }
}

// Update Projects
function updateProjects(projects) {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;
    
    workGrid.innerHTML = projects.map((project, index) => {
        const hasPreview = project.cardPreview && project.cardPreview.trim();
        // Strip query/hash for extension (e.g. Cloudinary URLs) so .gif?x=y is treated as image
        const pathOnly = hasPreview ? project.cardPreview.split('?')[0].split('#')[0] : '';
        const fileExt = pathOnly ? pathOnly.split('.').pop().toLowerCase() : '';
        const isVideo = fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'mov';
        const isHtml = fileExt === 'html';
        const previewUrl = project.cardPreview || '';
        const lazyLoad = index >= 2 ? ' loading="lazy"' : '';
        return `
        <article class="work-card" ${project.passwordProtected ? 'data-password-protected="true"' : ''} data-project-id="${project.id}">
            <div class="work-visual work-color-${index + 1}" style="background: ${hasPreview ? 'transparent' : project.color};">
                ${hasPreview ? (isHtml ?
                    `<iframe src="${project.cardPreview}"${lazyLoad} style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0; pointer-events: none;"></iframe>` :
                    isVideo ? 
                    `<video src="${project.cardPreview}" autoplay loop muted playsinline${lazyLoad ? ' loading="lazy"' : ''} style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;"></video>` :
                    `<img src="${previewUrl}" alt="${project.name}"${lazyLoad} decoding="async" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">`) : ''}
            </div>
            <div class="project-info">
                <div class="project-text-mask">
                    <h3 class="project-name">${project.name}</h3>
                </div>
                <div class="project-text-mask">
                    <p class="project-company">${project.company}</p>
                </div>
            </div>
        </article>
        `;
    }).join('');
    
    // Store project data globally for password check
    window.projectsData = projects;
}

// Update Experience (flat list: one row per role, description on first row only)
function updateExperience(experience) {
    const rowsEl = document.querySelector('.experience-rows');
    if (!rowsEl || !experience.length) return;
    
    let rowIndex = 0;
    const rows = [];
    experience.forEach((exp) => {
        const roles = exp.roles && exp.roles.length ? exp.roles : [{ title: '', description: '', period: { start: '', end: '' } }];
        roles.forEach((role) => {
            const company = escapeHtml(exp.company || '');
            const title = escapeHtml(role.title || '');
            const description = escapeHtml(role.description || '');
            const start = escapeHtml((role.period && role.period.start) || '');
            const endDisplay = rowIndex === 0 ? 'On going' : (role.period && role.period.end) || '';
            const end = escapeHtml(endDisplay);
            const expanded = rowIndex === 0 ? ' expanded' : '';
            rowIndex++;
            rows.push(`
                <div class="experience-row${expanded}">
                    <div class="experience-row-left">
                        <span class="experience-company">${company}</span>
                        <div class="experience-job-block">
                            <span class="experience-job-title">${title}</span>
                            ${description ? `<p class="experience-description">${description.replace(/\n/g, '<br>')}</p>` : ''}
                        </div>
                    </div>
                    <div class="experience-dates">
                        <span class="experience-date-start">${start}</span>
                        <span class="experience-date-line"></span>
                        <span class="experience-date-end">${end}</span>
                    </div>
                </div>
            `);
        });
    });
    rowsEl.innerHTML = rows.join('');
    window.experienceData = experience;
}

// Update Footer (left = logo + cv + email, right = social)
function updateFooter(footer) {
    const footerEmail = document.querySelector('.footer-email');
    if (footerEmail) {
        footerEmail.textContent = footer.email;
        footerEmail.href = `mailto:${footer.email}`;
    }
    
    const socialLinks = document.querySelectorAll('.footer-right .footer-link');
    if (footer.social) footer.social.forEach((social, i) => {
        if (socialLinks[i]) {
            socialLinks[i].href = social.url;
            const name = (social.name || '').toLowerCase();
            socialLinks[i].textContent = name === 'linkedin' ? 'Linkedin' : name === 'dribbble' ? 'Dribbble' : (social.name || '');
        }
    });
    
    const footerLogo = document.querySelector('.footer-logo-circle');
    if (footerLogo && footer.logo) footerLogo.src = footer.logo;
    
    const cvLink = document.querySelector('.footer-left a[href*="cv"], .footer-left a[href*=".pdf"]');
    if (cvLink && footer.cvFile) cvLink.href = footer.cvFile;
}

// Load content on page load
window.addEventListener('DOMContentLoaded', loadContent);
