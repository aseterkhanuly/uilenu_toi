/* =====================================================
   SETTINGS
===================================================== */

const WEDDING_DATE =
    new Date("2026-12-19T18:00:00+05:00");


/* =====================================================
   ELEMENTS
===================================================== */

const scene =
    document.getElementById("envelopeScene");

const envelopeScreen =
    document.getElementById("envelopeScreen");

const invitation =
    document.getElementById("invitation");

const musicButton =
    document.getElementById("musicButton");

const music =
    document.getElementById("music");


let opened = false;


/* =====================================================
   OPEN ENVELOPE
===================================================== */

async function openEnvelope() {

    if (opened) {
        return;
    }

    opened = true;


    /*
     * 1. Запускаем CSS-анимацию
     */
    scene.classList.add("opening");


    /*
     * 2. Через 1.55 сек начинаем
     *    исчезновение всей сцены
     */
    setTimeout(() => {

        envelopeScreen.classList.add("exit");

    }, 1550);


    /*
     * 3. Полностью скрываем envelope
     *    и показываем сайт
     */
    setTimeout(() => {

        envelopeScreen.style.display = "none";

        invitation.classList.remove("hidden");

        invitation.classList.add("show");

        musicButton.classList.add("show");


        /*
         * Автозапуск музыки.
         *
         * Браузер может заблокировать autoplay.
         * В таком случае пользователь просто
         * нажимает кнопку музыки.
         */

        music
            .play()
            .then(() => {

                musicButton.classList.add("playing");

            })
            .catch(() => {

                console.log(
                    "Autoplay заблокирован браузером"
                );

            });


        initReveals();

    }, 2350);
}


/* click */

scene.addEventListener(
    "click",
    openEnvelope
);


/* keyboard */

scene.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openEnvelope();
        }
    }
);


/* =====================================================
   MUSIC
===================================================== */

musicButton.addEventListener(
    "click",
    async () => {

        if (music.paused) {

            try {

                await music.play();

                musicButton.classList.add(
                    "playing"
                );

            } catch (error) {

                console.log(error);
            }

        } else {

            music.pause();

            musicButton.classList.remove(
                "playing"
            );
        }

    }
);


/* =====================================================
   SCROLL REVEAL
===================================================== */

let observer;


function initReveals() {

    if (observer) {

        observer.disconnect();
    }


    observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -30px 0px"
            }
        );


    document
        .querySelectorAll(".reveal")
        .forEach(element => {

            observer.observe(element);

        });
}


/* =====================================================
   CALENDAR
===================================================== */

function createCalendar() {

    const calendar =
        document.getElementById(
            "calendar"
        );


    const year = 2026;

    /*
     * 11 = декабрь,
     * потому что январь = 0
     */
    const month = 11;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /*
     * Переводим Sunday = 0
     * в Monday = 0
     */
    const offset =
        (firstDay + 6) % 7;


    /*
     * Пустые ячейки
     */
    for (
        let i = 0;
        i < offset;
        i++
    ) {

        calendar.appendChild(
            document.createElement("span")
        );
    }


    /*
     * Дни месяца
     */
    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const element =
            document.createElement("span");


        element.textContent =
            day;


        /*
         * День свадьбы
         */
        if (day === 19) {

            element.classList.add(
                "selected"
            );
        }


        calendar.appendChild(
            element
        );
    }
}


createCalendar();


/* =====================================================
   COUNTDOWN
===================================================== */

function updateCountdown() {

    const difference =
        WEDDING_DATE.getTime()
        - Date.now();


    if (difference <= 0) {

        [
            "days",
            "hours",
            "minutes",
            "seconds"
        ].forEach(id => {

            document.getElementById(
                id
            ).textContent = "00";

        });

        return;
    }


    const days =
        Math.floor(
            difference / 86400000
        );


    const hours =
        Math.floor(
            difference / 3600000
        ) % 24;


    const minutes =
        Math.floor(
            difference / 60000
        ) % 60;


    const seconds =
        Math.floor(
            difference / 1000
        ) % 60;


    document.getElementById("days")
        .textContent =
        String(days).padStart(2, "0");


    document.getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");


    document.getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =====================================================
   RSVP
===================================================== */

document
    .getElementById("rsvp")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /*
             * Сейчас данные просто
             * собираются в объект.
             *
             * Здесь позже можно подключить:
             *
             * - Telegram Bot
             * - PHP backend
             * - Supabase
             * - Firebase
             * - Google Sheets API
             */

            const data =
                Object.fromEntries(
                    new FormData(
                        event.target
                    ).entries()
                );


            console.log(
                "RSVP:",
                data
            );


            event.target.style.display =
                "none";


            document
                .getElementById("success")
                .classList.add("show");

        }
    );


/* =====================================================
   GALLERY LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxImg =
    document.getElementById(
        "lightboxImg"
    );


document
    .querySelectorAll(".gallery-photo")
    .forEach(photo => {

        photo.addEventListener(
            "click",
            () => {

                lightboxImg.src =
                    photo.dataset.src;


                lightbox.classList.add(
                    "show"
                );


                document.body.style.overflow =
                    "hidden";
            }
        );

    });


/* close */

function closeLightbox() {

    lightbox.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";


    setTimeout(() => {

        lightboxImg.src = "";

    }, 200);
}


document
    .getElementById("closeLightbox")
    .addEventListener(
        "click",
        closeLightbox
    );


lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            closeLightbox();
        }

    }
);


/* ESC */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeLightbox();
        }

    }
);
