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

            const prevResults = [];
            this.recognizer.recognizing = (sender, event) => {
                const result = event.result;

                if (result && result.reason === ResultReason.TranslatingSpeech) {
                    const translation = result.translations.get(this.targetLanguage);
                    prevResults['result_' +result.privOffset.toString()] = translation;
                    const totalResult = Object.values(prevResults).join('. ');

                    const inputElement = document.getElementById(attr.value);
                    if (inputElement !== null) {
                        if (inputElement instanceof HTMLInputElement) {
                            inputElement.value = `${totalResult} `;
                        } else {
                            inputElement.innerHTML = `${totalResult} `;
                        }
                    }
                }
            };

            this.recognizer.startContinuousRecognitionAsync(
                (result) => {},
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
            this.recognizer.stopContinuousRecognitionAsync();
            this.recognizer.close();
            this.recognizer = undefined;
        }
        document.dispatchEvent(new CustomEvent('COAzureSTTStoppedRecording', {}));
    }
}
