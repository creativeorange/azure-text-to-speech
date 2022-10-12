import {
    SpeechTranslationConfig,
    AudioConfig,
    TranslationRecognizer,
    ResultReason,
} from 'microsoft-cognitiveservices-speech-sdk';

export class SpeechToText {
    key: string;
    region: string;
    sourceLanguage: string;
    targetLanguage: string;
    recognizer: TranslationRecognizer | undefined;

    constructor(key: string, region: string, sourceLanguage: string, targetLanguage: string|null = null) {
        this.key = key;
        this.region = region;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = (targetLanguage !== null) ? targetLanguage : sourceLanguage;
    }

    async start() {
        await this.registerBindings(document);
    }

    async registerBindings(node: any) {
        const nodes = node.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i]) {
                continue;
            }

            const currentNode = nodes[i];

            if (currentNode.attributes) {
                if (currentNode.attributes.getNamedItem('co-stt.start')) {
                    await this.handleStartModifier(currentNode, currentNode.attributes.getNamedItem('co-stt.start'));
                } else if (currentNode.attributes.getNamedItem('co-stt.stop')) {
                    await this.handleStopModifier(currentNode, currentNode.attributes.getNamedItem('co-stt.stop'));
                }
            }

            if (currentNode.childNodes.length > 0) {
                await this.registerBindings(currentNode);
            }
        }
    }

    async handleStartModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            const speechConfig = SpeechTranslationConfig.fromSubscription(this.key, this.region);
            speechConfig.speechRecognitionLanguage = this.sourceLanguage;
            speechConfig.addTargetLanguage(this.targetLanguage);

            const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

            this.recognizer = new TranslationRecognizer(speechConfig, audioConfig);

            document.dispatchEvent(new CustomEvent('COAzureSTTStartedRecording', {}));
            this.recognizer.recognizeOnceAsync(
                (result) => {
                    if (result.reason === ResultReason.TranslatedSpeech) {
                        const translation = result.translations.get(this.targetLanguage);
                        const inputElement = document.getElementById(attr.value);

                        if (inputElement !== null) {
                            if (inputElement instanceof HTMLInputElement) {
                                inputElement.value += `${translation} `;
                            } else {
                                inputElement.innerHTML += `${translation} `;
                            }
                        }
                    }

                    this.stop();
                },
                (err) => {
                    console.log(err);

                    this.stop();
                }
            );
        });
    }

    async handleStopModifier(node: any, attr: Attr) {
        node.addEventListener('click', async (_: any) => {
            await this.stop();
        });
    }

    async stop() {
        if (this.recognizer !== undefined) {
            this.recognizer.close();
            this.recognizer = undefined;
        }
        document.dispatchEvent(new CustomEvent('COAzureSTTStoppedRecording', {}));
    }
}
