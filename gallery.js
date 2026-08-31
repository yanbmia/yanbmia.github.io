// Photo wall + lightbox

const PHOTOS = [
    { id: 'img_1186', w: 4284, h: 5712, place: 'zhongzheng district, taipei',        coords: [25.0356, 121.524475] },
    { id: 'img_1193', w: 2825, h: 3766, place: 'chiang kai-shek memorial hall, taipei', coords: [25.035269, 121.522186] },
    { id: 'img_1338', w: 4032, h: 3024, place: 'ximending, taipei',                  coords: [25.043086, 121.504686] },
    { id: 'img_2029', w: 4032, h: 3024, place: 'jongno-gu, seoul',                   coords: [37.576311, 126.987183] },
    { id: 'img_2582', w: 4128, h: 5504, place: 'haedong yonggungsa, busan',          coords: [35.188989, 129.223206] },
    { id: 'img_2603', w: 8064, h: 6048, place: 'haedong yonggungsa, busan',          coords: [35.188939, 129.223175] },
    { id: 'img_2763', w: 3024, h: 4032, place: null, coords: null },
    { id: 'img_3091', w: 4032, h: 3024, place: 'jusangjeolli cliff, jeju',           coords: [33.236814, 126.425858] },
    { id: 'img_3150', w: 3919, h: 2939, place: 'jusangjeolli cliff, jeju',           coords: [33.237319, 126.425378] },
    { id: 'img_3396', w: 4032, h: 3024, place: 'yangmingshan, taipei',               coords: [25.163931, 121.5755] },
    { id: 'img_3332', w: 1600, h: 1200, place: 'yangmingshan, taipei',               coords: [25.163931, 121.5755]},
    { id: 'img_1237', w: 4032, h: 3024, place: 'mount rainier national park',        coords: [46.751561, -121.559381] },
    { id: 'img_1476', w: 2856, h: 3808, place: 'olympic national park',              coords: [48.050633, -123.788742] },
    { id: 'img_4459', w: 4032, h: 3024, place: 'bernese oberland, switzerland',      coords: [46.769986, 8.425419] },
    { id: 'img_4494', w: 2268, h: 4032, place: 'bernese oberland, switzerland',      coords: [46.770825, 8.426544] },
    { id: 'img_6640', w: 3024, h: 4032, place: 'paris, france',                      coords: [48.852731, 2.352808] },
    { id: 'img_8612', w: 4032, h: 3024, place: 'kamakura, japan',                    coords: [35.312122, 139.533294] },
    { id: 'img_8194', w: 4032, h: 3024, place: 'quebec city, canada',                coords: [46.813708, -71.203711] },
    { id: 'img_3893', w: 3024, h: 4032, place: 'washington, d.c.',                   coords: [38.888694, -77.010842] },
    { id: 'img_0856', w: 3024, h: 4032, place: 'upper west side, manhattan',         coords: [40.778694, -73.971589] },
    { id: 'img_7413', w: 4032, h: 3024, place: 'long island city, queens',           coords: [40.74395, -73.924622] },
];

const WEB_DIR = 'photo-gallery/web/';
const MOBILE_QUERY = '(max-width: 760px)';

function fmtCoords([lat, lon]) {
    const ns = lat >= 0 ? 'N' : 'S';
    const ew = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lon).toFixed(4)}° ${ew}`;
}

(function initGallery() {
    const wall = document.getElementById('galleryWall');
    const lightbox = document.getElementById('lightbox');
    if (!wall || !lightbox) return;

    const lbImg = document.getElementById('lightboxImg');
    const lbCap = document.getElementById('lightboxCap');
    const lbClose = document.getElementById('lightboxClose');
    let lastFocused = null;

    // build each photo item once; itemHeights tracks aspect ratio for balancing
    const items = PHOTOS.map((photo, i) => {
        const btn = document.createElement('button');
        btn.className = 'gallery-item';
        btn.setAttribute('aria-label', photo.place
            ? `view photo — ${photo.place}`
            : 'view photo');
        btn.setAttribute('aria-haspopup', 'dialog');

        const img = document.createElement('img');
        img.src = `${WEB_DIR}${photo.id}-thumb.jpg`;
        img.alt = photo.place ? `photo taken in ${photo.place}` : 'photo';
        img.loading = i < 4 ? 'eager' : 'lazy';
        img.decoding = 'async';
        // intrinsic ratio so the wall doesn't reflow while loading
        img.width = photo.w;
        img.height = photo.h;

        btn.appendChild(img);
        btn.addEventListener('click', () => openLightbox(photo, btn));

        return { photo, btn, ratio: photo.h / photo.w };
    });

    let currentCols = 0;

    function colCountForViewport() {
        return window.matchMedia(MOBILE_QUERY).matches ? 2 : 3;
    }

    function layoutColumns(colCount) {
        if (colCount === currentCols) return;
        currentCols = colCount;

        wall.innerHTML = '';
        const cols = [];
        const heights = [];
        for (let c = 0; c < colCount; c++) {
            const col = document.createElement('div');
            col.className = 'gallery-col';
            wall.appendChild(col);
            cols.push(col);
            heights.push(0);
        }

        // greedy balance: each item goes into the currently-shortest column
        items.forEach(({ btn, ratio }) => {
            let shortest = 0;
            for (let c = 1; c < colCount; c++) {
                if (heights[c] < heights[shortest]) shortest = c;
            }
            cols[shortest].appendChild(btn);
            heights[shortest] += ratio;
        });
    }

    layoutColumns(colCountForViewport());

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => layoutColumns(colCountForViewport()), 150);
    });

    function openLightbox(photo, trigger) {
        lastFocused = trigger;
        lbImg.src = `${WEB_DIR}${photo.id}-full.jpg`;
        lbImg.alt = photo.place ? `photo taken in ${photo.place}` : 'photo';

        // location line: only when EXIF geodata exists — no placeholder
        if (photo.coords) {
            lbCap.innerHTML = '';
            const placeEl = document.createElement('span');
            placeEl.textContent = photo.place || '';
            const coordsEl = document.createElement('span');
            coordsEl.className = 'cap-coords';
            coordsEl.textContent = fmtCoords(photo.coords);
            if (photo.place) lbCap.appendChild(placeEl);
            lbCap.appendChild(coordsEl);
            lbCap.style.display = '';
        } else {
            lbCap.innerHTML = '';
            lbCap.style.display = 'none';
        }

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lbImg.src = '';
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    // click outside the image returns to the wall
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lbImg) closeLightbox();
    });

    lbClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });

    // keep focus inside the lightbox while it's open
    document.addEventListener('focusin', (e) => {
        if (!lightbox.hidden && !lightbox.contains(e.target)) {
            lbClose.focus();
        }
    });
})();
