// ===================================
// LOCKED PRODUCTION VERSION – hero parallax, scroll spacer, about me, experience
// ===================================

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

// SOFT POSITION-DOWN ON SCROLL (hero + about me, same animation)

let parallaxTicking = false;

function updateParallax() {
    parallaxTicking = false;
    const hero = document.getElementById('heroSection');
    const heroContent = hero && hero.querySelector('.hero .container');
    if (!hero || !heroContent) return;

    const y = window.scrollY || window.pageYOffset;
    const isMobile = window.innerWidth <= 768;
    const isAboutOpen = hero.classList.contains('hero-about-open');
    /* When about open on mobile: stronger parallax so content "lags" as you scroll (visible scroll effect) */
    const factor = (isAboutOpen && isMobile) ? 0.45 : 0.12;
    const max = (isAboutOpen && isMobile) ? 220 : 80;
    const move = Math.min(y * factor, max);
    const translate = move ? `translateY(${move}px)` : '';

    if (isAboutOpen) {
        heroContent.style.transform = '';
        const aboutInner = document.querySelector('.hero-about .hero-about-inner');
        if (aboutInner) {
            /* On mobile don't apply parallax – avoids any transform affecting layout/scroll so full bio is visible */
            aboutInner.style.transform = (isMobile ? '' : translate);
        }
        return;
    }

    heroContent.style.transform = translate;
    const aboutInner = document.querySelector('.hero-about .hero-about-inner');
    if (aboutInner) aboutInner.style.transform = '';
}

function requestParallaxTick() {
    if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
    }
}

window.addEventListener('scroll', requestParallaxTick);
document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(updateParallax);
});

// ===================================
// LIVE TIME
// ===================================

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeElement = document.getElementById('liveTime');
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

updateTime();
setInterval(updateTime, 1000);

// ===================================
// SMOOTH SCROLL
// ===================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or if element has id (handled elsewhere)
            if (href === '#' || this.id) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerOffset = 120;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// EXPERIENCE SWITCHING (Hover-based with vertical slide)
// ===================================

// Check if mobile - use function to check dynamically
function checkIfMobile() {
    return window.innerWidth <= 768;
}
function checkIfTabletOrSmaller() {
    return window.innerWidth <= 1024;
}

// Hero is content-height; spacer fills rest of viewport + gap so Experience doesn't sit under hero text
function getHeroScrollGap() {
    var w = window.innerWidth;
    if (w >= 1200) return 400;
    if (w >= 900) return 350;
    if (w > 768) return 200;
    return 80; /* mobile: small gap so content scrolls over hero */
}
function updateScrollSpacerHeight() {
    const spacer = document.querySelector('.scroll-spacer');
    if (!spacer) return;
    const heroSection = document.getElementById('heroSection');
    if (!heroSection) return;
    const isMobile = checkIfMobile();
    const headerH = isMobile ? 86 : 104;
    const vh = window.innerHeight;
    /* When about me is open on mobile, hero is in-flow so no spacer; clear min-height so no white gap */
    if (heroSection.classList.contains('hero-about-open')) {
        if (isMobile) {
            spacer.style.height = '0';
            spacer.style.minHeight = '0';
        } else {
            spacer.style.height = (vh - headerH) + 'px';
            spacer.style.minHeight = '';
        }
        return;
    }
    const heroH = heroSection.offsetHeight || 0;
    const gap = getHeroScrollGap();
    const minSpacer = Math.max(0, vh - headerH);
    const contentSpacer = vh - headerH - heroH + gap;
    const spacerH = Math.max(minSpacer, contentSpacer, heroH, 1);
    spacer.style.height = spacerH + 'px';
    spacer.style.minHeight = '';
    if (window.__scrollDebug && window.__scrollDebug.enabled) {
        window.__scrollDebug.spacerHeight = spacerH;
        window.__scrollDebug.spacerUpdated = Date.now();
    }
}

// Experience accordion: one row expanded at a time
// Desktop/smaller laptop (1025+): hover. Tablet & mobile (≤1024): click.
function initializeExperienceAccordion() {
    const container = document.querySelector('.experience-rows');
    const rows = document.querySelectorAll('.experience-row');
    if (!container || rows.length === 0) return;

    const useClick = checkIfTabletOrSmaller();

    if (useClick) {
        var lastToggle = 0;
        rows.forEach((row) => {
            function toggleExpanded(e) {
                e.preventDefault();
                e.stopPropagation();
                var now = Date.now();
                if (now - lastToggle < 400) return;
                lastToggle = now;
                const isExpanded = row.classList.contains('expanded');
                rows.forEach((r) => r.classList.remove('expanded'));
                if (!isExpanded) row.classList.add('expanded');
                else if (rows[0]) rows[0].classList.add('expanded');
            }
            row.addEventListener('click', toggleExpanded);
        });
    } else {
        rows.forEach((row) => {
            row.addEventListener('mouseenter', () => {
                rows.forEach((r) => r.classList.remove('expanded'));
                row.classList.add('expanded');
            });
        });
        container.addEventListener('mouseleave', () => {
            rows.forEach((r) => r.classList.remove('expanded'));
            if (rows[0]) rows[0].classList.add('expanded');
        });
    }
}

function initializeExperience() {
    initializeExperienceAccordion();
}

// ===================================
// PORTFOLIO ROLE CYCLING (Click arrows to cycle through roles)
// ===================================

function initializePortfolioRoles() {
    const portfolioDetail = document.getElementById('portfolio');
    if (!portfolioDetail) return;

    const jobTitle = portfolioDetail.querySelector('.job-title');
    const contentWrapper = portfolioDetail.querySelector('.experience-content-wrapper');
    const description = portfolioDetail.querySelector('.experience-description');
    const yearStart = portfolioDetail.querySelector('.timeline-year');
    const yearEnd = portfolioDetail.querySelector('.timeline-end');
    const roleIndicator = portfolioDetail.querySelector('.role-indicator');
    const leftArrow = portfolioDetail.querySelector('.role-arrow-left');
    const rightArrow = portfolioDetail.querySelector('.role-arrow-right');
    
    if (!leftArrow || !rightArrow) return;

    // Portfolio role data (from experience data if available)
    const portfolioRoles = window.experienceData?.find(e => e.id === 'portfolio')?.roles || [
        {
            title: "Staff Motion Designer - Design System",
            description: "Own motion system principles, patterns, and docs. Partner with DS + engineering on implementation and QA. Drive adoption with reusable assets and handoff standards.",
            period: { start: "2025", end: "Now" }
        },
        {
            title: "Staff Motion and Website Designer",
            description: "Led website motion direction and consistency. Built scalable templates/patterns for faster delivery. Shipped implementation-ready motion with performance in mind.",
            period: { start: "2024", end: "2025" }
        },
        {
            title: "Senior Motion and Website Designer",
            description: "Delivered web motion end-to-end (concept → assets). Set early guidelines and delivery workflow. Prototyped interactions and micro-motions for key pages.",
            period: { start: "2022", end: "2024" }
        }
    ];
    
    let currentPortfolioRoleIndex = 0;
    
    function updateRoleArrows() {
        // Update arrow states
        if (currentPortfolioRoleIndex === 0) {
            leftArrow.classList.add('inactive');
        } else {
            leftArrow.classList.remove('inactive');
        }
        
        if (currentPortfolioRoleIndex === portfolioRoles.length - 1) {
            rightArrow.classList.add('inactive');
        } else {
            rightArrow.classList.remove('inactive');
        }
    }
    
    // Update references for updateRoleArrows
    const updateRoleArrowsLocal = () => {
        const freshLeftArrow = portfolioDetail.querySelector('.role-arrow-left');
        const freshRightArrow = portfolioDetail.querySelector('.role-arrow-right');
        
        if (currentPortfolioRoleIndex === 0) {
            freshLeftArrow?.classList.add('inactive');
        } else {
            freshLeftArrow?.classList.remove('inactive');
        }
        
        if (currentPortfolioRoleIndex === portfolioRoles.length - 1) {
            freshRightArrow?.classList.add('inactive');
        } else {
            freshRightArrow?.classList.remove('inactive');
        }
    };
    
    // Cycle through Portfolio roles
    function cyclePortfolioRole(direction) {
        // Update index
        if (direction === 'next' && currentPortfolioRoleIndex < portfolioRoles.length - 1) {
            currentPortfolioRoleIndex++;
        } else if (direction === 'prev' && currentPortfolioRoleIndex > 0) {
            currentPortfolioRoleIndex--;
        } else {
            return;
        }
        
        const role = portfolioRoles[currentPortfolioRoleIndex];
        
        // Fade out only the text content
        if (jobTitle) jobTitle.style.opacity = '0';
        if (contentWrapper) contentWrapper.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            if (jobTitle) jobTitle.textContent = role.title;
            if (description) description.textContent = role.description;
            if (yearStart) yearStart.textContent = role.period.start;
            if (yearEnd) yearEnd.textContent = role.period.end;
            if (roleIndicator) roleIndicator.textContent = `${currentPortfolioRoleIndex + 1}/${portfolioRoles.length}`;
            
            // Update arrows
            updateRoleArrowsLocal();
            
            // Fade back in
            if (jobTitle) jobTitle.style.opacity = '1';
            if (contentWrapper) contentWrapper.style.opacity = '1';
        }, 200);
    }
    
    // Clone arrows to remove old listeners
    const newLeftArrow = leftArrow.cloneNode(true);
    const newRightArrow = rightArrow.cloneNode(true);
    leftArrow.parentNode.replaceChild(newLeftArrow, leftArrow);
    rightArrow.parentNode.replaceChild(newRightArrow, rightArrow);
    
    // Add click handlers to new arrows
    newLeftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        cyclePortfolioRole('prev');
    });
    
    newRightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        cyclePortfolioRole('next');
    });
    
    updateRoleArrowsLocal();
}

// ===================================
// CUSTOM CURSOR (Desktop only)
// ===================================

// Check if mobile - disable cursor on mobile
const isMobileDevice = window.innerWidth <= 768;

function initializeCursor() {
    if (isMobileDevice) return;
    
    const cursorDot = document.querySelector('.cursor-dot');
    if (!cursorDot) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor movement with lerp
    function animateCursor() {
        if (!cursorDot) return;
        // Faster lerp for snappier movement
        currentX += (mouseX - currentX) * 0.5;
        currentY += (mouseY - currentY) * 0.5;
        
        cursorDot.style.left = `${currentX}px`;
        cursorDot.style.top = `${currentY}px`;
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a:not(.footer-link):not(.location-link):not(.nav-link):not(.reel-video-wrap), button, .experience-item');
    const reelLink = document.getElementById('reelLink');
    const projectCards = document.querySelectorAll('.work-card');
    const footerLinks = document.querySelectorAll('.footer-link');
    const locationLink = document.querySelector('.location-link');
    const heroLinks = document.querySelectorAll('.hero-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroName = document.getElementById('heroName');
    const heroPhoto = document.getElementById('heroPhoto');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorDot.classList.remove('cursor-project', 'cursor-arrow-only');
            // Hide text for hover cursor (just dot)
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) {
                cursorText.style.display = 'none';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            // Reset to default if no other class is active
            if (!cursorDot.classList.contains('cursor-project') && 
                !cursorDot.classList.contains('cursor-arrow-only')) {
                resetCursorToDefault();
            }
        });
    });
}

// Project cards image gallery functionality (works on all devices)
const projectImageIndices = {};
const projectCards = document.querySelectorAll('.work-card');

// Initialize image indices
projectCards.forEach(card => {
    const projectName = card.querySelector('.project-name').textContent;
    projectImageIndices[projectName] = 0;
});

// Function to cycle project images
function cycleProjectImage(card) {
    const projectName = card.querySelector('.project-name').textContent;
    const workVisual = card.querySelector('.work-visual');
    const projectInfo = card.querySelector('.project-info');
    
    projectInfo.classList.add('hidden');
    projectImageIndices[projectName] = (projectImageIndices[projectName] + 1) % 3;
    
    // Special handling for Motion Design System (first project)
    if (projectName === 'Motion Design System') {
        if (projectImageIndices[projectName] === 1) {
            // Second image: gray shape in white
            workVisual.style.background = '#FFFFFF';
            workVisual.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #E0E0E0 0%, #FFFFFF 70%)';
        } else {
            // Reset to default
            workVisual.style.background = '#141414';
            workVisual.style.backgroundImage = '';
        }
    }
    
}

// Function to reset cursor to default state (just dot, no text) - shared across all cursor handlers
function resetCursorToDefault() {
    const cursorDot = document.querySelector('.cursor-dot');
    if (!cursorDot) return;
    
    cursorDot.classList.remove('cursor-project', 'cursor-arrow-only', 'cursor-hover');
    const cursorText = cursorDot.querySelector('.cursor-text');
    if (cursorText) {
        cursorText.style.display = 'none';
        cursorText.style.opacity = '0';
    }
    // Don't manipulate arrow display/opacity - let CSS handle it based on classes
    const cursorArrow = cursorDot.querySelector('.cursor-arrow');
    if (cursorArrow) {
        cursorArrow.style.display = ''; // Reset inline styles
        cursorArrow.style.opacity = '';
    }
}

// Initialize project card cursors
function initializeProjectCursors() {
    if (isMobileDevice) return;
    
    const cursorDot = document.querySelector('.cursor-dot');
    const projectCards = document.querySelectorAll('.work-card');
    
    if (!cursorDot || projectCards.length === 0) return;
    
    projectCards.forEach(card => {
        // Clone to remove old listeners
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        const workVisual = newCard.querySelector('.work-visual');
        if (workVisual) {
            workVisual.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-project');
                const cursorText = cursorDot.querySelector('.cursor-text');
                if (cursorText) {
                    cursorText.textContent = 'come on, click';
                    cursorText.style.display = 'block';
                    cursorText.style.opacity = '1';
                }
                const cursorArrow = cursorDot.querySelector('.cursor-arrow');
                if (cursorArrow) {
                    cursorArrow.style.display = '';
                    cursorArrow.style.opacity = '';
                }
                cursorDot.classList.remove('cursor-hover', 'cursor-arrow-only', 'cursor-password');
            });
            workVisual.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-project');
                const cursorText = cursorDot.querySelector('.cursor-text');
                if (cursorText) {
                    cursorText.style.display = 'none';
                    cursorText.style.opacity = '0';
                }
                resetCursorToDefault();
            });
        }
        
        newCard.addEventListener('mouseleave', () => {
            resetCursorToDefault();
            
            // Reset project info and image
            const projectInfo = newCard.querySelector('.project-info');
            if (projectInfo) {
                projectInfo.classList.remove('hidden');
            }
            const projectName = newCard.querySelector('.project-name')?.textContent;
            if (projectName && projectImageIndices[projectName] !== undefined) {
                projectImageIndices[projectName] = 0;
            }
        });
        
        // Click opens modal via document-level delegated listener (same for mobile)
        newCard.addEventListener('click', (e) => {
            cursorDot.classList.add('clicked');
            setTimeout(() => {
                cursorDot.classList.remove('clicked');
            }, 300);
        });
    });
}

// Move all cursor hover effects to be called during initialization
function initializeCursorHoverEffects() {
    if (isMobileDevice) return;
    
    const cursorDot = document.querySelector('.cursor-dot');
    const footerLinks = document.querySelectorAll('.footer-link');
    const locationLink = document.querySelector('.location-link');
    const heroLinks = document.querySelectorAll('.hero-link');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!cursorDot) return;
    
    // Arrow cursor only (no text) for footer links
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-arrow-only');
            cursorDot.classList.remove('cursor-hover', 'cursor-project');
            // Explicitly hide text
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) {
                cursorText.style.display = 'none';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-arrow-only');
            resetCursorToDefault();
        });
    });
    
    // Arrow cursor for Amsterdam link
    if (locationLink) {
        locationLink.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-arrow-only');
            cursorDot.classList.remove('cursor-hover', 'cursor-project');
            // Explicitly hide text
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) {
                cursorText.style.display = 'none';
            }
        });
        
        locationLink.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-arrow-only');
            resetCursorToDefault();
        });
    }
    
    // cursor-arrow-only for header nav links (event delegation for CMS-injected links)
    const headerEntries = document.querySelector('.header-entries');
    if (headerEntries) {
        headerEntries.addEventListener('mouseover', (e) => {
            const link = e.target.closest('.nav-link');
            if (link && headerEntries.contains(link)) {
                cursorDot.classList.add('cursor-arrow-only');
                cursorDot.classList.remove('cursor-hover', 'cursor-project');
                const cursorText = cursorDot.querySelector('.cursor-text');
                if (cursorText) cursorText.style.display = 'none';
            }
        });
        headerEntries.addEventListener('mouseout', (e) => {
            const stillOverLink = e.relatedTarget && e.relatedTarget.closest('.nav-link') && headerEntries.contains(e.relatedTarget.closest('.nav-link'));
            if (!stillOverLink) {
                cursorDot.classList.remove('cursor-arrow-only');
                resetCursorToDefault();
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-arrow-only');
            cursorDot.classList.remove('cursor-hover', 'cursor-project');
            // Explicitly hide text
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) {
                cursorText.style.display = 'none';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-arrow-only');
            resetCursorToDefault();
        });
    });
    
    // Arrow cursor for grid link
    const gridLinkElement = document.getElementById('gridLink');
    if (gridLinkElement) {
        gridLinkElement.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-arrow-only');
            cursorDot.classList.remove('cursor-hover', 'cursor-project');
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) {
                cursorText.style.display = 'none';
            }
        });
        
        gridLinkElement.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-arrow-only');
            resetCursorToDefault();
        });
    }
    
    // Arrow cursor for reel video wrap
    const reelWrap = document.querySelector('.reel-video-wrap');
    if (reelWrap) {
        reelWrap.addEventListener('mouseenter', function() {
            cursorDot.classList.add('cursor-arrow-only');
            cursorDot.classList.remove('cursor-hover', 'cursor-project');
            const cursorText = cursorDot.querySelector('.cursor-text');
            if (cursorText) cursorText.style.display = 'none';
        });
        reelWrap.addEventListener('mouseleave', function() {
            cursorDot.classList.remove('cursor-arrow-only');
            resetCursorToDefault();
        });
    }
}

// Initialize modals and players
function initializeModalsAndPlayers() {
    // Amsterdam link music player (works on all devices)
    const locationLink = document.querySelector('.location-link');
    if (locationLink) {
        locationLink.addEventListener('click', (e) => {
            e.preventDefault();
            const musicPlayer = document.getElementById('musicPlayer');
            const audioPlayer = document.getElementById('audioPlayer');
            
            if (musicPlayer) musicPlayer.classList.add('active');
            
            // Auto-play
            if (audioPlayer) {
                audioPlayer.play().catch(err => {
                });
            }
        });
    }

    // ===================================
    // MUSIC PLAYER
    // ===================================

    const musicPlayer = document.getElementById('musicPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const closePlayerBtn = document.getElementById('closePlayer');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    // Set volume to 30%
    if (audioPlayer) {
        audioPlayer.volume = 0.3;
    }

    if (audioPlayer && playPauseBtn) {
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    const progressBar = document.querySelector('.progress-bar');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeIcon = volumeBtn?.querySelector('.volume-icon');
    const volumeMuteIcon = volumeBtn?.querySelector('.volume-mute-icon');
    
    let previousVolume = 0.3;
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });
    
    // Update play/pause icons
    audioPlayer.addEventListener('play', () => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    });
    
    audioPlayer.addEventListener('pause', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
    
    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audioPlayer.volume = volume;
            previousVolume = volume;
            
            // Update icon
            if (volumeIcon && volumeMuteIcon) {
                if (volume === 0) {
                    volumeIcon.style.display = 'none';
                    volumeMuteIcon.style.display = 'block';
                } else {
                    volumeIcon.style.display = 'block';
                    volumeMuteIcon.style.display = 'none';
                }
            }
        });
    }
    
    // Volume button (mute/unmute)
    if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
            if (audioPlayer.volume > 0) {
                previousVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
                volumeSlider.value = 0;
                volumeIcon.style.display = 'none';
                volumeMuteIcon.style.display = 'block';
            } else {
                audioPlayer.volume = previousVolume;
                volumeSlider.value = previousVolume * 100;
                volumeIcon.style.display = 'block';
                volumeMuteIcon.style.display = 'none';
            }
        });
    }
    
    // Update progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = `${progress}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });
    
    // Update duration when loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    
    // Click on progress bar to seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }
    
    // Close player
    if (closePlayerBtn) {
        closePlayerBtn.addEventListener('click', () => {
            musicPlayer.classList.remove('active');
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        });
    }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Arrow cursor for Download CV
    const downloadCv = document.getElementById('downloadCv');
    const cursorDot = document.querySelector('.cursor-dot');
    if (downloadCv && cursorDot) {
    downloadCv.addEventListener('mouseenter', () => {
        cursorDot.classList.add('cursor-arrow-only');
        cursorDot.classList.remove('cursor-hover', 'cursor-project');
    });
    
        downloadCv.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-arrow-only');
        });
    }

    // Reel: play within the reel area (inline)
    const reelVideoWrap = document.getElementById('reelVideoWrap');
    const reelInlineVideo = document.getElementById('reelInlineVideo');
    const reelCloseBtn = document.getElementById('reelCloseBtn');

    if (reelVideoWrap && reelInlineVideo) {
        reelVideoWrap.addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.closest('.reel-close-btn')) return;
            if (reelVideoWrap.classList.contains('is-playing')) return;
            reelVideoWrap.classList.add('is-playing');
            reelInlineVideo.setAttribute('controls', '');
            reelInlineVideo.play().catch(function() {});
        });
        if (reelCloseBtn) {
            reelCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                reelVideoWrap.classList.remove('is-playing');
                reelInlineVideo.removeAttribute('controls');
                reelInlineVideo.pause();
                reelInlineVideo.currentTime = 0;
            });
        }
        reelInlineVideo.addEventListener('ended', function() {
            reelVideoWrap.classList.remove('is-playing');
            reelInlineVideo.removeAttribute('controls');
        });
    }

    const videoPlayer = document.getElementById('videoPlayer');
    const videoClose = document.getElementById('videoClose');
    const videoPlayerElement = document.getElementById('videoPlayerElement');
    if (videoClose && videoPlayerElement) {
        videoClose.addEventListener('click', function() {
            if (videoPlayer) {
                videoPlayer.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('video-player-active');
                videoPlayerElement.pause();
                videoPlayerElement.currentTime = 0;
            }
        });
    }

    // Close video player on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoPlayer && videoPlayer.classList.contains('active')) {
            videoPlayer.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('video-player-active');
            if (videoPlayerElement) {
                videoPlayerElement.pause();
                videoPlayerElement.currentTime = 0;
            }
        }
    });

    // About Me: popup overlay on top of hero – photo, text, X on white; fade in/out
    const heroSection = document.getElementById('heroSection');
    const heroAbout = document.getElementById('heroAbout');

    const heroAboutCloseBtn = document.getElementById('heroAboutClose');

    function openAboutView() {
        if (!heroSection || !heroAbout) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        heroAbout.setAttribute('aria-hidden', 'false');
        heroSection.classList.add('hero-about-open');
        if (!checkIfMobile()) document.body.style.overflow = 'hidden';
        if (checkIfMobile()) {
            const aboutInner = document.querySelector('.hero-about .hero-about-inner');
            if (aboutInner) aboutInner.style.transform = '';
        }
        updateScrollSpacerHeight();
        requestParallaxTick();
        if (checkIfMobile()) setTimeout(updateScrollSpacerHeight, 50);
    }

    function closeAboutView() {
        if (!heroSection || !heroAbout) return;
        heroSection.classList.remove('hero-about-open');
        heroAbout.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        updateScrollSpacerHeight();
    }

    /* Mobile: about me is in-flow, one natural scroll (no handoff). Desktop: overlay, handoff not needed. */
    function setupAboutScrollHandoff() { /* no-op: mobile uses in-flow about */ }

    // Use delegation so About me works when link is injected by content-loader after load
    document.addEventListener('click', function(e) {
        const aboutLink = e.target.closest('a#aboutMeLink');
        if (aboutLink) {
            e.preventDefault();
            e.stopPropagation();
            openAboutView();
            return false;
        }
    });

    if (heroAboutCloseBtn) {
        heroAboutCloseBtn.addEventListener('click', function() {
            closeAboutView();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && heroSection && heroSection.classList.contains('hero-about-open')) {
            closeAboutView();
        }
    });

    setupAboutScrollHandoff();
    
    // Close video player when clicking outside (on modal background)
    if (videoPlayer) {
        videoPlayer.addEventListener('click', function(e) {
            // Close if clicking directly on the video player (not on the video element)
            if (e.target === videoPlayer) {
                videoPlayer.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('video-player-active');
                if (videoPlayerElement) {
                    videoPlayerElement.pause();
                    videoPlayerElement.currentTime = 0;
                }
            }
        });
    }
}

// ===================================
// URL ROUTING - Projects and Sections
// ===================================

// Map URL paths to project IDs
const PROJECT_ROUTES = {
    '/motion-system': 1,
    '/motion-tool': 2,
    '/lotties': 3,
    '/product-motion': 4,
    '/flink': 5,
    '/selection': 6
};

// Map URL paths to section IDs
const SECTION_ROUTES = {
    '/about': 'heroSection',
    '/reel': 'reelSection',
    '/experience': 'experienceSection',
    '/projects': 'workSection',
    '/contact': 'footerSection'
};

function handleRoute() {
    const path = window.location.pathname;
    
    // Check if path matches a project route
    if (PROJECT_ROUTES[path]) {
        const projectId = PROJECT_ROUTES[path];
        // Wait for content to be loaded
        if (window.projectsData) {
            openProjectByIdFromRoute(projectId);
        } else {
            // Content not loaded yet, wait for contentLoaded event
            window.addEventListener('contentLoaded', () => openProjectByIdFromRoute(projectId), { once: true });
        }
        return;
    }
    
    // Check if path matches a section route
    if (SECTION_ROUTES[path]) {
        const sectionId = SECTION_ROUTES[path];
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => scrollToSection(sectionId), { once: true });
        } else {
            scrollToSection(sectionId);
        }
        return;
    }
}

function openProjectByIdFromRoute(projectId) {
    const card = document.querySelector(`[data-project-id="${projectId}"]`);
    if (card) {
        setTimeout(() => openProjectModal(card), 300);
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 120;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        setTimeout(() => {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Update URL when project opens (without page reload)
function updateProjectUrl(projectId) {
    const routePath = Object.keys(PROJECT_ROUTES).find(key => PROJECT_ROUTES[key] === parseInt(projectId));
    if (routePath && window.history) {
        window.history.pushState({ projectId }, '', routePath);
    }
}

// Update URL when project closes (back to root)
function clearProjectUrl() {
    if (window.history) {
        window.history.pushState({}, '', '/');
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.projectId) {
        openProjectByIdFromRoute(e.state.projectId);
    } else {
        // Close modal if open
        const modal = document.getElementById('projectModal');
        if (modal && modal.classList.contains('active')) {
            closeProjectModal();
        }
    }
});

// Initialize routing on page load
handleRoute();

// ===================================
// PROJECT MODAL (Full-screen)
// ===================================

function openProjectModal(card) {
    const projectName = card.querySelector('.project-name')?.textContent;
    const projectCompany = card.querySelector('.project-company')?.textContent;
    const projectId = card.getAttribute('data-project-id');
    const isPasswordProtected = card.getAttribute('data-password-protected') === 'true';
    
    // Get project data from window.projectsData (loaded by content-loader.js)
    const projectData = window.projectsData?.find(p => p.id == projectId);
    
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const modalSubtitle = document.getElementById('projectModalSubtitle');
    const passwordGate = document.getElementById('projectPasswordGate');
    const passwordInput = document.getElementById('passwordGateInput');
    const passwordError = document.getElementById('passwordGateError');
    const modalBody = document.getElementById('projectModalBody');
    const modalHero = document.getElementById('projectHero');
    const modalGrid = document.getElementById('projectGrid');
    
    if (!modal) return;
    
    // Set title and subtitle
    if (modalTitle) modalTitle.textContent = projectName || 'Project';
    if (modalSubtitle) modalSubtitle.textContent = projectCompany || '';
    
    // Clear previous content (including custom HTML from Motion System)
    const modalBodyText = document.getElementById('projectBodyText');
    if (modalHero) {
        modalHero.innerHTML = '';
        modalHero.style.display = 'none';
    }
    if (modalGrid) {
        modalGrid.innerHTML = '';
        modalGrid.style.display = 'none';
    }
    if (modalBodyText) {
        modalBodyText.innerHTML = '';
        modalBodyText.style.display = 'none';
    }
    if (passwordError) passwordError.classList.remove('show');
    if (passwordInput) passwordInput.value = '';
    
    // Check if password protected
    if (isPasswordProtected && projectData?.password) {
        // Show password gate, hide content
        if (passwordGate) passwordGate.style.display = 'flex';
        if (modalBody) modalBody.style.display = 'none';
        
        // Store project data for later
        modal.dataset.projectId = projectId;
        modal.dataset.projectName = projectName;
        
        // Focus password input
        setTimeout(() => {
            if (passwordInput) passwordInput.focus();
        }, 300);
        
        // Handle password submission
        const handlePasswordSubmit = (e) => {
            if (e.key === 'Enter' || e.type === 'blur') {
                const enteredPassword = passwordInput.value.trim();
                if (enteredPassword === projectData.password) {
                    // Correct password - show content
                    loadProjectContent(projectData, projectName);
                    if (passwordGate) passwordGate.style.display = 'none';
                    if (modalBody) modalBody.style.display = 'block';
                } else if (enteredPassword) {
                    // Wrong password - show error
                    if (passwordError) passwordError.classList.add('show');
                    if (passwordInput) passwordInput.value = '';
                }
            }
        };
        
        passwordInput?.removeEventListener('keypress', handlePasswordSubmit);
        passwordInput?.addEventListener('keypress', handlePasswordSubmit);
    } else {
        // No password - show content directly
        if (passwordGate) passwordGate.style.display = 'none';
        if (modalBody) modalBody.style.display = 'block';
        loadProjectContent(projectData, projectName);
    }
    
    // Show modal: lock body scroll (desktop + mobile); on iOS position:fixed so background doesn't scroll
    var scrollY = window.scrollY || window.pageYOffset;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('project-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = scrollY ? ('-' + scrollY + 'px') : '0';
    document.body.style.left = '0';
    document.body.style.right = '0';
    modal.dataset.scrollY = String(scrollY);
    
    // Update URL to project route
    updateProjectUrl(projectId);
}

function fillBrandVideos(container, videos) {
    if (!container || !Array.isArray(videos)) return;
    [0, 1, 2].forEach(index => {
        const el = container.querySelector('#brand-video-' + index);
        if (!el) return;
        const url = (videos[index] || '').trim();
        if (!url) {
            const label = el.querySelector('.brand-placeholder-label') ? el.querySelector('.brand-placeholder-label').textContent : 'Add video in CMS';
            el.innerHTML = '<span class="brand-placeholder-label">' + (['Logo Animation', 'Endscreen Animation', 'Splashscreen Animation'][index]) + '</span>';
            return;
        }
        const pathOnly = url.split('?')[0].split('#')[0];
        const ext = pathOnly ? pathOnly.split('.').pop().toLowerCase() : '';
        const isVideo = ext === 'mp4' || ext === 'webm' || ext === 'mov';
        const escaped = url.replace(/"/g, '&quot;');
        if (isVideo) {
            el.innerHTML = '<video src="' + escaped + '" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:contain;"></video>';
        } else {
            el.innerHTML = '<img src="' + escaped + '" alt="" style="width:100%;height:100%;object-fit:contain;">';
        }
    });
}

function loadProjectContent(projectData, projectName) {
    const modalHero = document.getElementById('projectHero');
    const modalBodyText = document.getElementById('projectBodyText');
    const modalGrid = document.getElementById('projectGrid');
    
    // Use the new renderer if available
    if (projectData && (projectData.structuredContent || projectData.bodyHtml)) {
        const renderedHtml = window.renderProjectBody 
            ? window.renderProjectBody(projectData) 
            : (projectData.bodyHtml || '');
        
        if (renderedHtml && renderedHtml.trim()) {
            if (modalHero) modalHero.style.display = 'none';
            if (modalGrid) modalGrid.style.display = 'none';
            if (modalBodyText) {
                modalBodyText.style.display = 'block';
                modalBodyText.innerHTML = renderedHtml.trim();
                if (projectData.id === 5) {
                    const videos = projectData.media && Array.isArray(projectData.media.videos) ? projectData.media.videos : [];
                    fillBrandVideos(modalBodyText, videos);
                }
                initHandoffTabs();
            }
            return;
        }
    }
    
    // Legacy: load from customUrl if specified
    if (projectData && projectData.customUrl) {
        fetch(projectData.customUrl)
            .then(response => response.text())
            .then(html => {
                // Hide standard elements
                if (modalHero) modalHero.style.display = 'none';
                if (modalGrid) modalGrid.style.display = 'none';
                
                // Load custom HTML into body text area
                if (modalBodyText) {
                    modalBodyText.style.display = 'block';
                    modalBodyText.innerHTML = html;
                    initHandoffTabs();
                    // Brand Guidelines (project 5): always fetch content.json so live site shows latest videos (avoids stale projectsData / CDN cache)
                    if (projectData.id === 5) {
                        fetch('content.json?v=' + Date.now())
                            .then(r => r.json())
                            .then(content => {
                                const proj = content.projects && content.projects.find(p => p.id === 5);
                                const videos = proj && proj.media && Array.isArray(proj.media.videos) ? proj.media.videos : [];
                                fillBrandVideos(modalBodyText, videos);
                            })
                            .catch(() => {
                                const fallback = projectData.media && Array.isArray(projectData.media.videos) ? projectData.media.videos : [];
                                fillBrandVideos(modalBodyText, fallback);
                            });
                    }
                }
            })
            .catch(error => {
                console.error('Error loading custom content:', error);
                if (modalBodyText) {
                    modalBodyText.innerHTML = '<p>Error loading project content.</p>';
                }
            });
        return;
    }
    
    // CRITICAL: Reset modal for standard projects (clear custom HTML)
    if (modalBodyText) {
        modalBodyText.innerHTML = '';
        modalBodyText.style.display = 'none';
    }
    if (modalHero) modalHero.style.display = 'none';
    if (modalGrid) modalGrid.innerHTML = '';
    
    // Load project media if available (standard projects)
    if (projectData && projectData.media) {
        // Hero image
        if (projectData.media.hero && projectData.media.hero.trim()) {
            if (modalHero) {
                modalHero.style.display = 'block';
                const heroFile = resolveMediaUrl(projectData.media.hero.trim());
                const heroPath = heroFile.split('?')[0].split('#')[0];
                const heroExt = heroPath.split('.').pop().toLowerCase();
                
                if (heroExt === 'mp4' || heroExt === 'webm' || heroExt === 'mov') {
                    modalHero.innerHTML = `<video src="${heroFile}" autoplay loop muted playsinline></video>`;
                } else {
                    modalHero.innerHTML = `<img src="${heroFile}" alt="${projectName}">`;
                }
            }
        }
        
        // Body text (between hero and grid)
        if (projectData.bodyText && projectData.bodyText.trim() && modalBodyText) {
            modalBodyText.style.display = 'block';
            modalBodyText.innerHTML = `<p>${projectData.bodyText.replace(/\n/g, '<br>')}</p>`;
        }
        
        // Grid items (masonry: images, GIFs, videos)
        if (projectData.media.grid && projectData.media.grid.length > 0 && modalGrid) {
            modalGrid.style.display = 'block';
            modalGrid.innerHTML = projectData.media.grid.map(file => {
                const url = resolveMediaUrl((file || '').trim());
                const pathOnly = url.split('?')[0].split('#')[0];
                const ext = pathOnly ? pathOnly.split('.').pop().toLowerCase() : '';
                const isVideo = ext === 'mp4' || ext === 'webm' || ext === 'mov';
                const escaped = url.replace(/"/g, '&quot;');
                return `
                    <div class="project-grid-item">
                        ${isVideo
                            ? `<video src="${escaped}" autoplay loop muted playsinline onmouseenter="this.play()" onmouseleave="this.pause(); this.currentTime=0;"></video>`
                            : `<img src="${escaped}" alt="${(projectName || '').replace(/"/g, '&quot;')}">`
                        }
                    </div>
                `;
            }).join('');
        }
    }
}

// Play all videos in a panel after it is visible; load() ensures video is ready
function playVideosInPanel(panel) {
    if (!panel) return;
    var videos = panel.querySelectorAll('video');
    if (!videos.length) return;
    setTimeout(function() {
        videos.forEach(function(v) {
            v.load();
            v.play().catch(function() {});
        });
    }, 450);
}

function initHandoffTabs() {
    const container = document.getElementById('projectModalBody');
    if (!container) return;
    const tabs = container.querySelectorAll('.handoff-tab');
    const panels = container.querySelectorAll('.handoff-panel');
    if (!tabs.length || !panels.length) return;
    // Always show first panel: clear active then set first tab + first panel (works for Product Motion & Motion system)
    tabs.forEach(function(t) { t.classList.remove('active'); });
    panels.forEach(function(p) { p.classList.remove('active'); });
    tabs[0].classList.add('active');
    panels[0].classList.add('active');
    playVideosInPanel(panels[0]);
}

// Handoff tabs: capture phase so we run before anything else; only when modal is open
function handleHandoffTabClick(e) {
    var modal = document.getElementById('projectModal');
    if (!modal || !modal.classList.contains('active')) return;
    var tab = e.target.closest('.handoff-tab');
    if (!tab) return;
    var container = document.getElementById('projectModalBody');
    if (!container || !container.contains(tab)) return;
    var tabId = tab.getAttribute('data-tab');
    if (!tabId) return;
    e.preventDefault();
    e.stopPropagation();
    var tabs = container.querySelectorAll('.handoff-tab');
    var panels = container.querySelectorAll('.handoff-panel');
    tabs.forEach(function(t) { t.classList.remove('active'); });
    panels.forEach(function(p) { p.classList.remove('active'); });
    tab.classList.add('active');
    var panel = container.querySelector('#panel-' + tabId);
    if (panel) {
        panel.classList.add('active');
        playVideosInPanel(panel);
    }
}
document.addEventListener('click', handleHandoffTabClick, true);
document.addEventListener('touchend', handleHandoffTabClick, { passive: false, capture: true });

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        var scrollY = modal.dataset.scrollY ? parseInt(modal.dataset.scrollY, 10) : 0;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.classList.remove('project-modal-open');
        if (scrollY) window.scrollTo(0, scrollY);
        
        // Clear URL back to root
        clearProjectUrl();
    }
}

// Project modal close: use capture so it runs before any other handler; also bind when DOM ready
function bindProjectModalClose() {
    const btn = document.getElementById('projectModalClose');
    if (!btn) return;
    function doClose(e) {
        e.preventDefault();
        e.stopPropagation();
        closeProjectModal();
    }
    btn.addEventListener('click', doClose, true);
    btn.addEventListener('touchend', doClose, { passive: false, capture: true });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindProjectModalClose);
} else {
    bindProjectModalClose();
}

// Close project modal on Escape
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('projectModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Close modal when clicking X or backdrop – use capture so it runs before other handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('#projectModalClose') || e.target.closest('.project-modal-close')) {
        e.preventDefault();
        e.stopPropagation();
        closeProjectModal();
        return;
    }
    var modal = document.getElementById('projectModal');
    var modalWrapper = document.querySelector('.project-modal-wrapper');
    if (modal && modal.classList.contains('active') && e.target === modal && modalWrapper && !modalWrapper.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        closeProjectModal();
    }
}, true);

// Open project modal only when clicking the preview image (.work-visual), not the text (bubble)
document.addEventListener('click', function(e) {
    var card = e.target.closest('.work-card');
    if (card && e.target.closest('.work-visual')) {
        e.preventDefault();
        openProjectModal(card);
    }
});

// Safari / iOS: X close – pointerdown + touchend so close works when click doesn't fire (Safari quirk).
(function() {
    function maybeCloseFromButton(e) {
        var btn = document.getElementById('projectModalClose');
        if (!btn) return false;
        var x = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0));
        var y = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0));
        var rect = btn.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            closeProjectModal();
            e.preventDefault();
            e.stopPropagation();
            return true;
        }
        return false;
    }
    document.addEventListener('pointerdown', function(e) {
        if (!document.getElementById('projectModal') || !document.getElementById('projectModal').classList.contains('active')) return;
        if (e.target.closest('#projectModalClose') || e.target.closest('.project-modal-close')) {
            closeProjectModal();
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
    document.addEventListener('touchend', function(e) {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        var modal = document.getElementById('projectModal');
        if (!modal || !modal.classList.contains('active')) return;
        if (maybeCloseFromButton(e)) return;
    }, { passive: false, capture: true });
})();

// ===================================
// INITIALIZE ON LOAD
// ===================================

// Master initialization function
function initializeAll() {
    initializeSmoothScroll();
    initializeCursor();
    initializeCursorHoverEffects();
    initializeModalsAndPlayers();
    initializeExperience();
    initializePortfolioRoles();
    initializeProjectCursors();
    requestAnimationFrame(() => {
        updateScrollSpacerHeight();
        requestAnimationFrame(updateScrollSpacerHeight);
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeAll();
});

// Reinitialize when content is loaded (from content-loader.js)
window.addEventListener('contentLoaded', () => {
    setTimeout(() => {
        initializeExperience();
        initializePortfolioRoles();
        initializeProjectCursors();
        updateScrollSpacerHeight();
    }, 300);
});

// Resize: recompute scroll-spacer so first screen stays correct
window.addEventListener('resize', () => {
    requestAnimationFrame(updateScrollSpacerHeight);
});

// Chrome: run spacer after full load so layout is final and scroll works
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        updateScrollSpacerHeight();
        setTimeout(updateScrollSpacerHeight, 50);
    });
});

// Optional scroll debug: set window.__scrollDebug = { enabled: true } in Console to inspect spacer/wheel.
window.__scrollDebug = undefined;
document.addEventListener('wheel', function(e) {
    if (!window.__scrollDebug || !window.__scrollDebug.enabled) return;
    window.__scrollDebug.lastWheel = Date.now();
    window.__scrollDebug.wheelTarget = (e.target && e.target.id) ? e.target.id : (e.target && e.target.className) ? String(e.target.className).slice(0, 80) : e.target.tagName;
    window.__scrollDebug.wheelTargetNode = e.target;
}, { passive: true });

// Chrome desktop: wheel over content below hero doesn't scroll. Forward wheel to body scroll when target is not body.
(function chromeDesktopWheelFix() {
    var ua = navigator.userAgent;
    var isChromeDesktop = (/Chrome|Chromium/).test(ua) && !(/Mobile|Android|webOS|iPhone|iPad|Opera Mini/).test(ua);
    if (!isChromeDesktop) return;
    document.addEventListener('wheel', function(e) {
        var scrollEl = document.scrollingElement || document.body;
        var target = e.target;
        if (target === document.body || target === document.documentElement) return;
        var maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
        if (maxScroll <= 0) return;
        var amount = e.deltaY;
        if (amount === 0) return;
        scrollEl.scrollTop += amount;
        e.preventDefault();
    }, { passive: false, capture: true });
})();

// ===================================
// PASSWORD INPUT IN CURSOR
// ===================================

// Don't declare these as const at module level - get them dynamically in functions
// to avoid initialization errors

