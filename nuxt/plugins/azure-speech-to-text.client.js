import {SpeechToText} from "@creativeorange/azure-text-to-speech/dist/co-azure-tts.es";
export default defineNuxtPlugin(async (nuxtApp) => {
    const speechToText = new SpeechToText(
        '[key]',
        '[region]',
        '[source language]',
        '[target language]'
    );
    let started = false;

    nuxtApp.vueApp.mixin({
        mounted() {
            if (!started) {
                setTimeout(async () => {
                    await speechToText.start();
                }, 500);
                started = true;
            }
        },
        beforeUnmount() {
            if (started) {
                speechToText.stop();
                started = false;
            }
        },
    });
});
