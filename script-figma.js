// ===================================
// PARALLAX SCROLL EFFECTS
// ===================================

let ticking = false;

// Hero: soft position-down (parallax) as content scrolls over it; desktop only, not when About open.
function updateParallax() {
    ticking = false;
    if (typeof checkIfMobile === 'function' && checkIfMobile()) return;
    const hero = document.getElementById('heroSection');
    const heroContent = hero && hero.querySelector('.hero .container');
    if (!hero || !heroContent || hero.classList.contains('hero-about-open') || hero.classList.contains('hero-about-step1') || hero.classList.contains('hero-about-step2')) {
        if (heroContent) heroContent.style.transform = '';
        return;
    }
    const y = window.scrollY || window.pageYOffset;
    const factor = 0.12;
    const max = 80;
    const move = Math.min(y * factor, max);
    heroContent.style.transform = move ? `translateY(${move}px)` : '';
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Enable parallax on desktop (updateParallax bails on mobile)
window.addEventListener('scroll', requestTick);
document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(updateParallax);
});

// ===================================
// SMOOTH SCROLL (eased wheel) – desktop only
// ===================================
(function() {
    var smoothTarget = 0;
    var smoothCurrent = 0;
    var smoothRaf = null;

    function smoothTick() {
        smoothRaf = null;
        smoothCurrent += (smoothTarget - smoothCurrent) * 0.12;
        if (Math.abs(smoothTarget - smoothCurrent) < 0.5) smoothCurrent = smoothTarget;
        window.scrollTo(0, smoothCurrent);
        if (smoothCurrent !== smoothTarget) smoothRaf = requestAnimationFrame(smoothTick);
    }

    function onWheel(e) {
        if (window.innerWidth <= 768) return;
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        smoothTarget = window.scrollY || window.pageYOffset;
        smoothTarget += e.deltaY;
        smoothTarget = Math.max(0, Math.min(smoothTarget, maxScroll));
        e.preventDefault();
        if (!smoothRaf) {
            smoothCurrent = window.scrollY || window.pageYOffset;
            smoothRaf = requestAnimationFrame(smoothTick);
        }
    }

    function syncTarget() {
        smoothTarget = window.scrollY || window.pageYOffset;
        smoothCurrent = smoothTarget;
    }

    document.addEventListener('DOMContentLoaded', function() {
        syncTarget();
        window.addEventListener('scroll', syncTarget, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: false });
    });
})();

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
    if (checkIfMobile()) {
        spacer.style.height = '0';
        return;
    }
    const heroSection = document.getElementById('heroSection');
    if (!heroSection) return;
    const headerH = 92;
    const vh = window.innerHeight;
    const heroH = heroSection.offsetHeight;
    const gap = getHeroScrollGap();
    /* Ensure spacer is at least one viewport so hero is never covered by content on load */
    const minSpacer = vh - headerH;
    const contentSpacer = vh - headerH - heroH + gap;
    const spacerH = Math.max(minSpacer, contentSpacer, 0);
    spacer.style.height = spacerH + 'px';
}

// Experience accordion: one row expanded at a time
// Desktop: switch on hover. Mobile: tap to expand/collapse (only one expanded).
function initializeExperienceAccordion() {
    const container = document.querySelector('.experience-rows');
    const rows = document.querySelectorAll('.experience-row');
    if (!container || rows.length === 0) return;

    const isMobile = checkIfMobile();

    if (isMobile) {
        rows.forEach((row) => {
            row.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = row.classList.contains('expanded');
                rows.forEach((r) => r.classList.remove('expanded'));
                if (!isExpanded) row.classList.add('expanded');
                else if (rows[0]) rows[0].classList.add('expanded');
            });
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

// Legacy experience (sidebar + detail) - no longer used
let experienceInitialized = false;

function initializeExperience() {
    initializeExperienceAccordion();
    const experienceItems = document.querySelectorAll('.experience-item');
    const experienceDetails = document.querySelectorAll('.experience-detail');
    const visualPlaceholders = document.querySelectorAll('.visual-placeholder');
    const isMobile = checkIfMobile();
    
    if (experienceItems.length === 0) {
        return;
    }
    
    console.log(`Found ${experienceItems.length} experience items`);
    
    // Keep track of the previous active index
    let previousExperienceIndex = 0;
    let isAnimating = false;

    // Only enable hover switching on desktop
    if (!isMobile) {
        console.log('Adding experience hover listeners');
        // Get fresh references after content load
        const freshItems = document.querySelectorAll('.experience-item');
        const freshDetails = document.querySelectorAll('.experience-detail');
        const freshVisuals = document.querySelectorAll('.visual-placeholder');
        
        freshItems.forEach((item, currentIndex) => {
            item.addEventListener('mouseenter', () => {
                console.log(`Experience item ${currentIndex} hovered`);
            // Prevent rapid transitions while animating
            if (isAnimating) return;
            
            const targetExperience = item.getAttribute('data-experience');
            
            // Don't do anything if already active
            if (item.classList.contains('active')) return;
            
            // Set animating flag
            isAnimating = true;
            
            // Clear flag after animation completes (700ms + small buffer)
            setTimeout(() => {
                isAnimating = false;
            }, 750);
            
            // Update active states for items
            freshItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Determine slide direction
            const slideUp = currentIndex < previousExperienceIndex;
            
            // Switch content (text boxes) with vertical slide animation
            freshDetails.forEach((detail) => {
                if (detail.id === targetExperience) {
                    // Remove any exit classes
                    detail.classList.remove('exit-up', 'exit-down');
                    
                    // Add entrance class based on direction
                    if (slideUp) {
                        detail.classList.add('enter-from-top');
                    } else {
                        detail.classList.add('enter-from-bottom');
                    }
                    
                    // Activate after a tick
                    requestAnimationFrame(() => {
                        detail.classList.add('active');
                        detail.classList.remove('enter-from-top', 'enter-from-bottom');
                    });
                } else if (detail.classList.contains('active')) {
                    // Exit current active detail
                    detail.classList.remove('active');
                    if (slideUp) {
                        detail.classList.add('exit-down');
                    } else {
                        detail.classList.add('exit-up');
                    }
                }
            });
            
            // Switch visuals (opposite direction)
            freshVisuals.forEach((visual) => {
                const visualTarget = visual.getAttribute('data-visual');
                if (visualTarget === targetExperience) {
                    // Remove any exit classes
                    visual.classList.remove('exit-up', 'exit-down');
                    
                    // Add entrance class OPPOSITE to text direction
                    if (slideUp) {
                        visual.classList.add('enter-from-bottom');
                    } else {
                        visual.classList.add('enter-from-top');
                    }
                    
                    // Activate after a tick
                    requestAnimationFrame(() => {
                        visual.classList.add('active');
                        visual.classList.remove('enter-from-top', 'enter-from-bottom');
                    });
                } else if (visual.classList.contains('active')) {
                    // Exit current active visual
                    visual.classList.remove('active');
                    if (slideUp) {
                        visual.classList.add('exit-up');
                    } else {
                        visual.classList.add('exit-down');
                    }
                }
            });
            
            // Update previous index
            previousExperienceIndex = currentIndex;
        });
    });
    }
}

// ===================================
// PORTFOLIO ROLE CYCLING (Click arrows to cycle through roles)
// ===================================

function initializePortfolioRoles() {
    console.log('initializePortfolioRoles called');
    
    const portfolioDetail = document.getElementById('portfolio');
    
    if (!portfolioDetail) {
        console.log('Portfolio detail not found, will retry on contentLoaded');
        return;
    }
    
    console.log('Portfolio detail found');
    
    const jobTitle = portfolioDetail.querySelector('.job-title');
    const contentWrapper = portfolioDetail.querySelector('.experience-content-wrapper');
    const description = portfolioDetail.querySelector('.experience-description');
    const yearStart = portfolioDetail.querySelector('.timeline-year');
    const yearEnd = portfolioDetail.querySelector('.timeline-end');
    const roleIndicator = portfolioDetail.querySelector('.role-indicator');
    const leftArrow = portfolioDetail.querySelector('.role-arrow-left');
    const rightArrow = portfolioDetail.querySelector('.role-arrow-right');
    
    if (!leftArrow || !rightArrow) {
        console.log('Arrows not found');
        return;
    }
    
    console.log('Arrows found, attaching listeners');
    
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
        console.log(`Cycling role: ${direction}, current index: ${currentPortfolioRoleIndex}`);
        
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
        console.log('Left arrow clicked');
        e.stopPropagation();
        cyclePortfolioRole('prev');
    });
    
    newRightArrow.addEventListener('click', (e) => {
        console.log('Right arrow clicked');
        e.stopPropagation();
        cyclePortfolioRole('next');
    });
    
    // Initialize arrow states
    updateRoleArrowsLocal();
    
    console.log('Portfolio roles initialized successfully');
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
    
    // Special handling for Portfolio Motion System (first project)
    if (projectName === 'Portfolio Motion System') {
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
    
    console.log(`${projectName}: showing image ${projectImageIndices[projectName] + 1}`);
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
        
        newCard.addEventListener('mouseenter', () => {
            // Always show "come on, click" on hover
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
        
        // Add click handler - just open modal directly
        newCard.addEventListener('click', (e) => {
            cursorDot.classList.add('clicked');
            setTimeout(() => {
                cursorDot.classList.remove('clicked');
            }, 300);
            
            // Open project modal (password handled inside)
            openProjectModal(newCard);
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
                    console.log('Audio autoplay prevented. Click play button to start:', err);
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
            console.log(`Seeked to ${percent * 100}% - ${formatTime(audioPlayer.currentTime)}`);
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
            reelInlineVideo.play().catch(function() {});
        });
        if (reelCloseBtn) {
            reelCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                reelVideoWrap.classList.remove('is-playing');
                reelInlineVideo.pause();
                reelInlineVideo.currentTime = 0;
            });
        }
        reelInlineVideo.addEventListener('ended', function() {
            reelVideoWrap.classList.remove('is-playing');
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

    // About Me: JS-driven animation so sequence is reliable (no layout jump mid-animation)
    const heroSection = document.getElementById('heroSection');
    const heroAbout = document.getElementById('heroAbout');
    var aboutAnimationInProgress = false;

    function openAboutView() {
        if (!heroSection || aboutAnimationInProgress) return;
        aboutAnimationInProgress = true;
        heroAbout?.setAttribute('aria-hidden', 'false');

        // Step 1: fade out intro + tags
        heroSection.classList.add('hero-about-step1');
        setTimeout(function() {
            // Step 2: move name down
            heroSection.classList.add('hero-about-step2');
            setTimeout(function() {
                // Step 3: show about (hero in flow, about visible)
                heroSection.classList.remove('hero-about-step1', 'hero-about-step2');
                heroSection.classList.add('hero-about-open');
                var spacer = document.querySelector('.scroll-spacer');
                if (spacer) spacer.style.height = '0';
                aboutAnimationInProgress = false;
            }, 550);
        }, 400);
    }

    function closeAboutView() {
        if (!heroSection || aboutAnimationInProgress) return;
        aboutAnimationInProgress = true;
        heroAbout?.setAttribute('aria-hidden', 'true');

        // Step 1: hide about, hero back to fixed
        heroSection.classList.remove('hero-about-open');
        heroSection.classList.add('hero-about-closing');
        var spacer = document.querySelector('.scroll-spacer');
        if (spacer) spacer.style.height = '0';
        setTimeout(function() {
            // Step 2: name moves up, intro+tags fade in (handled by CSS)
            setTimeout(function() {
                heroSection.classList.remove('hero-about-closing');
                updateScrollSpacerHeight();
                aboutAnimationInProgress = false;
            }, 700);
        }, 350);
    }

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

    const heroAboutClose = document.getElementById('heroAboutClose');
    if (heroAboutClose) {
        heroAboutClose.addEventListener('click', function() {
            closeAboutView();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && heroSection && heroSection.classList.contains('hero-about-open')) {
            closeAboutView();
        }
    });
    
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
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('project-modal-open');
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
    
    // Check if this is a custom HTML project (like motion system)
    if (projectData && projectData.customUrl) {
        // Load custom HTML content
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
                const heroFile = projectData.media.hero.trim();
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
                const url = (file || '').trim();
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

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('project-modal-open');
    }
}

// Toggle Motion System interactive examples (globally accessible)
function toggleMotionExpand(idx = 0) {
    // Try with and without index suffix
    let containerId = 'motionIframeContainer' + idx;
    let container = document.getElementById(containerId);
    
    // If not found with index, try without
    if (!container) {
        containerId = 'motionIframeContainer';
        container = document.getElementById(containerId);
    }
    
    const btns = document.querySelectorAll('.expand-btn');
    const btn = btns[idx] || document.querySelector('.expand-btn');
    
    if (container && btn) {
        if (container.style.display === 'none' || container.style.display === '') {
            container.style.display = 'block';
            btn.textContent = 'Click to collapse ↑';
        } else {
            container.style.display = 'none';
            btn.textContent = 'Click to expand →';
        }
    }
}

// Project modal close button
const projectModalClose = document.getElementById('projectModalClose');
if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
}

// Close project modal on Escape
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('projectModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Close project modal when clicking outside (on the modal background)
document.addEventListener('click', function(e) {
    const modal = document.getElementById('projectModal');
    const modalWrapper = document.querySelector('.project-modal-wrapper');
    if (modal && modal.classList.contains('active')) {
        // Check if click is on modal background (not on wrapper content)
        if (e.target === modal && !modalWrapper?.contains(e.target)) {
            closeProjectModal();
        }
    }
});

// ===================================
// INITIALIZE ON LOAD
// ===================================

// Master initialization function
function initializeAll() {
    console.log('Initializing all event listeners');
    initializeSmoothScroll();
    initializeCursor();
    initializeCursorHoverEffects();
    initializeModalsAndPlayers();
    initializeExperience();
    initializePortfolioRoles();
    initializeProjectCursors();
    requestAnimationFrame(() => {
        updateScrollSpacerHeight();
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing');
    initializeAll();
});

// Reinitialize when content is loaded (from content-loader.js)
window.addEventListener('contentLoaded', () => {
    console.log('Content loaded event received, reinitializing');
    setTimeout(() => {
        console.log('Running reinitialization now');
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

// ===================================
// PASSWORD INPUT IN CURSOR
// ===================================

// Don't declare these as const at module level - get them dynamically in functions
// to avoid initialization errors

