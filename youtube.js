class YouTubeAdMute {
    constructor() {
        this.video = this.getVideo();
        this.container = this.getVideoContainer();
        this.hasVideo = false;
        this.ad = false;

        // Observe changes inside the player container and mute/skip when ads are playing
        this.observer = new MutationObserver(() => {
            this.update();
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
            this.update();
        }, 1000);
    }

    update() {
        if (this.isAdPlaying()) {
            this.setMuted(true);
            this.ad = true;
            const skipAdButton = document.querySelector(".ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern");
            if (skipAdButton) {
                skipAdButton.click();
            }
        } else if (this.ad) {
            this.setMuted(false);
            this.ad = false;
        }
    }

    /**
     * Observe mutations inside the player container
     * @param {HTMLElement} container 
     * @param {HTMLVideoElement} video 
     */
    videoLoaded(container, video) {
        this.video = video;
        this.container = container;
        this.observer.observe(this.container, {
            childList: true,
            subtree: true,
        });
    }

    videoUnloaded() {
        this.video = null;
        this.container = null;
        this.observer.disconnect();
    }

    isAdPlaying() {
        return document.querySelector(".ytp-ad-player-overlay-layout, .ytp-ad-player-overlay-instream-info, .ytp-ad-survey-player-overlay-instream-info") ? true : false;
    }

    setMuted(muted) {
        const video = this.getVideo();
        if (video) {
            video.muted = muted;
        }
    }

    getVideoContainer() {
        return document.getElementById("ytd-player") || document.querySelector("ytmusic-player");
    }

    getVideo() {
        return document.querySelector("#ytd-player video") || document.querySelector("ytmusic-player video");
    }
}

new YouTubeAdMute();
