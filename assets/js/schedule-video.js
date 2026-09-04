/* ===================================================
   SCHEDULE FILTER & VIDEO MODAL — VANILLA JAVASCRIPT
   Pure Vanilla JS with Smooth Animations & Transitions
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ── 1. DAY FILTER (Jadwal Piket & Jadwal Pelajaran) ──
    const filterContainers = document.querySelectorAll('.schedule-filter-bar');

    filterContainers.forEach(container => {
        const buttons = container.querySelectorAll('.filter-btn');
        const targetGridId = container.getAttribute('data-target-grid');
        const grid = document.getElementById(targetGridId);

        if (!grid) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active class on buttons
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const selectedDay = this.getAttribute('data-day');
                const cards = grid.querySelectorAll('.day-card');

                cards.forEach(card => {
                    const cardDay = card.getAttribute('data-day');
                    if (selectedDay === 'all' || cardDay === selectedDay) {
                        card.style.display = '';
                        card.classList.remove('animate-fade-in');
                        // Force reflow for animation restart
                        void card.offsetWidth;
                        card.classList.add('animate-fade-in');
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Also toggle NOTE card if present
                const noteCard = grid.querySelector('.sticky-note-card-wrap');
                if (noteCard) {
                    if (selectedDay === 'all') {
                        noteCard.style.display = '';
                    }
                }
            });
        });
    });

    // ── 2. VIDEO TYPE & YOUTUBE URL HELPER ─────────────────
    function isLocalVideoFile(url) {
        if (!url) return false;
        url = url.trim().toLowerCase();
        return url.endsWith('.mp4') || url.endsWith('.m4v') || url.endsWith('.webm') || 
               url.endsWith('.mov') || url.endsWith('.ogg') || url.includes('assets/uploads/videos/');
    }

    function getYouTubeEmbedUrl(url) {
        if (!url) return '';
        url = url.trim();
        
        let videoId = '';
        
        // Match youtube.com/watch?v=ID
        const watchMatch = url.match(/[?&]v=([^&#]+)/);
        if (watchMatch && watchMatch[1]) {
            videoId = watchMatch[1];
        } 
        // Match youtu.be/ID
        else if (url.includes('youtu.be/')) {
            const parts = url.split('youtu.be/');
            if (parts[1]) videoId = parts[1].split('?')[0].split('/')[0];
        }
        // Match youtube.com/embed/ID
        else if (url.includes('youtube.com/embed/')) {
            const parts = url.split('youtube.com/embed/');
            if (parts[1]) videoId = parts[1].split('?')[0].split('/')[0];
        }
        // Match youtube.com/shorts/ID
        else if (url.includes('youtube.com/shorts/')) {
            const parts = url.split('youtube.com/shorts/');
            if (parts[1]) videoId = parts[1].split('?')[0].split('/')[0];
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }

        return url;
    }

    // ── 3. VIDEO MODAL PLAYER ──────────────────────────────
    const videoModal = document.getElementById('classVideoModal');
    const modalIframeWrap = document.getElementById('videoModalIframeWrap');
    const modalTitleEl = document.getElementById('videoModalTitle');
    const modalCloseBtn = document.getElementById('videoModalCloseBtn');

    window.openClassVideo = function(videoUrl, videoTitle) {
        if (!videoModal || !modalIframeWrap) return;

        if (modalTitleEl) {
            modalTitleEl.textContent = videoTitle || 'Video Kelas XI PPLG 3';
        }

        if (isLocalVideoFile(videoUrl)) {
            // Render HTML5 Video player for MP4/local uploads
            modalIframeWrap.innerHTML = `
                <video controls autoplay playsinline controlsList="nodownload" style="width:100%; height:100%; object-fit:contain; background:#000000; display:block;">
                    <source src="${videoUrl}" type="video/mp4">
                    Browser Anda tidak mendukung tag video HTML5.
                </video>
            `;
        } else {
            // Render YouTube iframe
            const embedUrl = getYouTubeEmbedUrl(videoUrl);
            modalIframeWrap.innerHTML = `
                <iframe src="${embedUrl}" 
                        title="${videoTitle || 'Video'}" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="width:100%; height:100%; border:none; display:block;">
                </iframe>
            `;
        }

        videoModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };

    window.closeClassVideo = function() {
        if (!videoModal || !modalIframeWrap) return;
        videoModal.classList.remove('is-open');
        
        // Pause any active html5 video
        const activeVideo = modalIframeWrap.querySelector('video');
        if (activeVideo) activeVideo.pause();
        
        modalIframeWrap.innerHTML = ''; // Stop playback immediately
        document.body.style.overflow = '';
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', window.closeClassVideo);
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                window.closeClassVideo();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('is-open')) {
            window.closeClassVideo();
        }
    });

});
