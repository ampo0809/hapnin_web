const CACHE_NAME = 'video-cache-v1';
const URLS_TO_CACHE = [
    'https://hapnin-video-teaser-container.s3.eu-north-1.amazonaws.com/demo_video.mp4'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', event => {
    if (URLS_TO_CACHE.includes(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});