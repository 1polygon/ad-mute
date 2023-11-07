class TwitchAdMute {
    constructor() {
        this.ad = false;

        // Observe changes inside the document body and mute player when ads are playing
        this.observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (this.isAdPlaying()) {
                        if (!this.ad) {
                            this.setMuted(true);
                            this.ad = true;
                        }
                    } else if (this.ad) {
                        this.setMuted(false);
                        this.ad = false;
                    }
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    isAdPlaying() {
        return document.querySelector("[data-a-target='video-ad-countdown']") ? true : false;
    }

    setMuted(muted) {
        const video = document.querySelector("video");
        if (video) {
            video.muted = muted;
            console.log("[ADMUTE] set muted", muted);
        }
    }
}

new TwitchAdMute();
