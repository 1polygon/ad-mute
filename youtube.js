class YouTubeAdMute {
    constructor() {
        this.video = this.getVideo();
        this.container = this.getVideoContainer();
        this.hasVideo = false;
        this.ad = false;

        // Observe changes inside the player container and mute/skip when ads are playing
        this.observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (this.isAdPlaying()) {
                        if (!this.ad) {
                            this.setMuted(true);
                            this.ad = true;
                        }
                        const skipAdButton = document.querySelector(".ytp-ad-skip-button");
                        if (skipAdButton) {
                            skipAdButton.click();
                            console.log("[ADMUTE] skipped ad");
                        }
                    } else if (this.ad) {
                        this.setMuted(false);
                        this.ad = false;
                    }
                }
            }
        });

        // Wait for the player container to appear
        setInterval(() => {
            const container = this.getVideoContainer();
            const video = this.getVideo();
            if (this.hasVideo && (!video || !container)) {
                this.hasVideo = false;
                this.videoUnloaded();
            }
            if (!this.hasVideo && (video && container)) {
                this.hasVideo = true;
                this.videoLoaded(container, video);
            }
        }, 1000);
    }

    /**
     * Observe mutations inside the player container
     * @param {HTMLElement} container 
     * @param {HTMLVideoElement} video 
     */
    videoLoaded(container, video) {
        console.log("[ADMUTE] video loaded");
        this.video = video;
        this.container = container;
        this.observer.observe(this.container, {
            childList: true,
            subtree: true,
        });
    }

    videoUnloaded() {
        console.log("[ADMUTE] video unloaded");
        this.video = null;
        this.container = null;
        this.observer.disconnect();
    }

    isAdPlaying() {
        return document.querySelector(".ytp-ad-player-overlay-instream-info") ? true : false;
    }

    setMuted(muted) {
        const video = document.querySelector("video");
        if (video) {
            video.muted = muted;
            console.log("[ADMUTE] set muted", muted);
        }
    }

    getVideoContainer() {
        return document.querySelector("ytd-player");
    }

    getVideo() {
        return document.querySelector("video");
    }
}

new YouTubeAdMute();
