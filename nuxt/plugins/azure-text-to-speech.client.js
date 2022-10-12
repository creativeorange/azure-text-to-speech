import {TextToSpeech} from "@creativeorange/azure-text-to-speech";
export default defineNuxtPlugin(async (nuxtApp) => {
    const textToSpeech = new TextToSpeech(
        '[key]',
        '[region]',
        '[voice]',
        1, // rate
        1 // pitch
    );
    let started = false;

    nuxtApp.vueApp.mixin({
        mounted() {
            if (!started) {
                setTimeout(() => {
                    textToSpeech.start();
                }, 500);
                started = true;
            }
        },
        beforeUnmount() {
            if (started) {
                textToSpeech.stopPlayer();
                started = false;
            }
        }
    });
});
