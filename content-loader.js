// ===================================
// CONTENT LOADER - Load content from content.json
// ===================================

async function loadContent() {
    try {
        const response = await fetch('content.json');
        const content = await response.json();
        
        // Update Hero
        updateHero(content.hero);
        
        // Update About Me
        updateAboutMe(content.aboutMe);
        
        // Update Music Player
        updateMusic(content.music);
        
        // Update Reel
        updateReel(content.reel);
        
        // Update Header
        updateHeader(content.header);
        
        // Update Projects
        updateProjects(content.projects);
        
        // Update Experience
        updateExperience(content.experience);
        
        // Update Footer
        updateFooter(content.footer);
        
        console.log('✓ Content loaded successfully');
        
        // Dispatch event to notify other scripts that content is loaded
        setTimeout(() => {
            window.dispatchEvent(new Event('contentLoaded'));
        }, 150);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Update Hero Section
function updateHero(hero) {
    const heroName = document.getElementById('heroName');
    if (heroName) heroName.innerHTML = hero.name;
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) heroPhoto.style.backgroundImage = `url('${hero.photo}')`;
    
    // Update tags
    const tagsGrid = document.querySelector('.tags-grid');
    if (tagsGrid) {
        const toolTags = hero.tags.tools.map(tool => `<div class="tag tag-black">${tool}</div>`).join('');
        const skillTags = hero.tags.skills.map(skill => `<div class="tag">${skill}</div>`).join('');
        tagsGrid.innerHTML = toolTags + '<div style="flex-basis: 100%; height: 0;"></div>' + skillTags;
    }
}

// Update About Me Modal
function updateAboutMe(aboutMe) {
    const aboutPhoto = document.querySelector('.about-photo img');
    if (aboutPhoto) aboutPhoto.src = aboutMe.photo;
    
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.innerHTML = aboutMe.bio.map(p => `<p>${p}</p>`).join('');
    }
}

// Update Music Player
function updateMusic(music) {
    const musicTitle = document.querySelector('.player-title');
    if (musicTitle) musicTitle.textContent = music.title;
    
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) audioPlayer.src = music.file;
}

// Update Reel
function updateReel(reel) {
    const videoPlayer = document.querySelector('#videoPlayerElement source');
    if (videoPlayer) {
        videoPlayer.src = reel.file;
        document.getElementById('videoPlayerElement').load();
    }
}

// Update Header
function updateHeader(header) {
    const location = document.querySelector('.location');
    if (location) {
        location.textContent = header.location.text;
        location.href = header.location.link;
    }
    
    const cvLink = document.querySelector('a[href*="cv"]');
    if (cvLink) cvLink.href = header.cvFile;
}

// Update Projects
function updateProjects(projects) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/75a39076-4f26-46f4-aa78-a1720ba436f3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content-loader.js:107',message:'updateProjects called',data:{projectCount:projects.length,motionSystemPreview:projects[0]?.cardPreview},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H8'})}).catch(()=>{});
    // #endregion
    
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;
    
    workGrid.innerHTML = projects.map((project, index) => {
        const hasPreview = project.cardPreview && project.cardPreview.trim();
        const fileExt = hasPreview ? project.cardPreview.split('.').pop().toLowerCase() : '';
        const isVideo = fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'mov';
        const isHtml = fileExt === 'html';
        
        // #region agent log
        if (project.name === 'Qonto Motion System') {
            fetch('http://127.0.0.1:7242/ingest/75a39076-4f26-46f4-aa78-a1720ba436f3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content-loader.js:118',message:'Motion System card preview',data:{hasPreview,fileExt,isHtml,cardPreview:project.cardPreview},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6,H8'})}).catch(()=>{});
        }
        // #endregion
        
        return `
        <article class="work-card" ${project.passwordProtected ? 'data-password-protected="true"' : ''} data-project-id="${project.id}">
            <div class="work-visual work-color-${index + 1}" style="background: ${hasPreview ? 'transparent' : project.color};">
                ${hasPreview ? (isHtml ?
                    `<iframe src="${project.cardPreview}" style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0; pointer-events: none;"></iframe>` :
                    isVideo ? 
                    `<video src="${project.cardPreview}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;"></video>` :
                    `<img src="${project.cardPreview}" alt="${project.name}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">`) : ''}
                <div class="project-info" style="position: relative; z-index: 1;">
                    <div class="project-text-mask">
                        <h3 class="project-name">${project.name}</h3>
                    </div>
                    <div class="project-text-mask">
                        <p class="project-company">${project.company}</p>
                    </div>
                </div>
            </div>
        </article>
        `;
    }).join('');
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/75a39076-4f26-46f4-aa78-a1720ba436f3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'content-loader.js:145',message:'Projects HTML rendered',data:{cardCount:workGrid.querySelectorAll('.work-card').length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6'})}).catch(()=>{});
    // #endregion
    
    // Store project data globally for password check
    window.projectsData = projects;
}

// Update Experience
function updateExperience(experience) {
    // Update sidebar list
    const experienceList = document.querySelector('.experience-list');
    if (experienceList) {
        experienceList.innerHTML = experience.map((exp, i) => `
            <div class="experience-item ${i === 0 ? 'active' : ''}" data-experience="${exp.id}">
                <span class="item-name">${exp.company}</span>
            </div>
        `).join('');
    }
    
    // Update details content
    const experienceWrapper = document.querySelector('.experience-details-wrapper');
    if (experienceWrapper) {
        experienceWrapper.innerHTML = experience.map((exp, expIndex) => {
            const hasMultipleRoles = exp.roles.length > 1;
            const firstRole = exp.roles[0];
            
            return `
                <div class="experience-detail ${expIndex === 0 ? 'active' : ''}" id="${exp.id}" data-role-index="0">
                    <h2 class="company-name">${exp.company}</h2>
                    ${hasMultipleRoles ? `
                    <div class="job-title-wrapper">
                        <p class="job-title">${firstRole.title}</p>
                        <div class="role-navigation">
                            <button class="role-arrow role-arrow-left inactive" data-direction="prev">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 2L4 6L8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <span class="role-indicator">1/${exp.roles.length}</span>
                            <button class="role-arrow role-arrow-right" data-direction="next">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ` : `
                    <p class="job-title">${firstRole.title}</p>
                    `}
                    <div class="experience-content-wrapper">
                        <p class="experience-description">${firstRole.description}</p>
                        <div class="experience-timeline">
                            <span class="timeline-year">${firstRole.period.start}</span>
                            <span class="timeline-line"></span>
                            <span class="timeline-end">${firstRole.period.end}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Update visuals
    const experienceVisual = document.querySelector('.experience-visual');
    if (experienceVisual) {
        experienceVisual.innerHTML = experience.map((exp, i) => {
            const hasImage = exp.image && exp.image.trim();
            const fileExt = hasImage ? exp.image.split('.').pop().toLowerCase() : '';
            const isVideo = fileExt === 'mp4' || fileExt === 'webm' || fileExt === 'mov';
            
            return `
            <div class="visual-placeholder ${i === 0 ? 'active' : ''}" data-visual="${exp.id}" ${hasImage && !isVideo ? `style="background-image: url('${exp.image}');"` : ''}>
                ${hasImage && isVideo ? `<video src="${exp.image}" autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>` : ''}
            </div>
            `;
        }).join('');
    }
    
    // Store experience data globally for role switching
    window.experienceData = experience;
}

// Update Footer
function updateFooter(footer) {
    const footerEmail = document.querySelector('.footer-left .footer-link');
    if (footerEmail) {
        footerEmail.textContent = footer.email;
        footerEmail.href = `mailto:${footer.email}`;
    }
    
    const socialLinks = document.querySelectorAll('.footer-right .footer-link');
    footer.social.forEach((social, i) => {
        if (socialLinks[i]) {
            socialLinks[i].href = social.url;
            socialLinks[i].textContent = social.name;
        }
    });
    
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) footerLogo.src = footer.logo;
    
    const footerCredit = document.querySelector('.footer-credit');
    if (footerCredit) {
        footerCredit.innerHTML = `<img src="${footer.logo}" alt="Spiros Leividiotis logo" class="footer-logo">${footer.year} Spiros Leividiotis`;
    }
}

// Load content on page load
window.addEventListener('DOMContentLoaded', loadContent);
